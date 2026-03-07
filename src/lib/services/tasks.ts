import { supabase } from "../supabase";
import { Task, TaskComment } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  mapObserversToParticipants,
  mapCommentsData,
  mapAssigneeName,
} from "@/lib/utils/data-mappers";
import { handleServiceError, ERROR_CODES } from "@/lib/utils/error-handler";

export const tasksService = {
  // Получение всех задач
  async getTasks(projectId?: string, client?: SupabaseClient): Promise<Task[]> {
    const supabaseClient = client || supabase;
    let query = supabaseClient.from("tasks").select(
      `
        *,
        assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
        observers:task_participants(user:profiles(id, full_name, avatar_url)),
        checklists:task_checklists(*, items:task_checklist_items(*))
      `
    );

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query.order("due_date");

    if (error) {
      handleServiceError(
        error,
        "tasksService.getTasks",
        "Не удалось загрузить задачи",
        ERROR_CODES.DB_QUERY_FAILED
      );
    }

    // Map nested data and sort checklists/items
    return (data || []).map((task: any) => {
      const sortedChecklists = (task.checklists || [])
        .map((checklist: any) => ({
          ...checklist,
          items: (checklist.items || []).sort(
            (a: any, b: any) => (a.position || 0) - (b.position || 0)
          ),
        }))
        .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

      return {
        ...task,
        assigneeName: mapAssigneeName(task.assignee),
        observers: mapObserversToParticipants(task.observers),
        checklists: sortedChecklists,
      };
    }) as Task[];
  },

  // Получение задачи по ID
  async getTaskById(id: string, client?: SupabaseClient): Promise<Task | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("tasks")
      .select(
        `
        *,
        assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
        project:projects(name),
        observers:task_participants(
          user:profiles(id, full_name, avatar_url)
        ),
        comments:task_comments(*, user:profiles(full_name, avatar_url)),
        attachments:task_attachments(*),
        checklists:task_checklists(
          *,
          items:task_checklist_items(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      handleServiceError(
        error,
        "tasksService.getTaskById",
        `Не удалось загрузить задачу с ID ${id}`,
        ERROR_CODES.DB_QUERY_FAILED
      );
    }

    if (!data) return null;

    // Sort checklists and items by position
    const sortedChecklists = ((data as any).checklists || [])
      .map((checklist: any) => ({
        ...checklist,
        items: ((checklist as any).items || []).sort(
          (a: any, b: any) => (a as any).position - (b as any).position
        ),
      }))
      .sort((a: any, b: any) => (a as any).position - (b as any).position);

    return {
      ...data,
      assigneeName: mapAssigneeName((data as any).assignee),
      observers: mapObserversToParticipants((data as any).observers),
      comments: mapCommentsData((data as any).comments),
      attachments: (data as any).attachments || [],
      checklists: sortedChecklists,
    } as unknown as Task;
  },

  // Создание новой задачи
  async createTask(
    task: Omit<Task, "id" | "created_at" | "updated_at">,
    client?: SupabaseClient
  ): Promise<Task> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert(task)
      .select()
      .single()
      .returns<any>(); // Added .returns<any>()

    if (error) {
      handleServiceError(
        error,
        "tasksService.createTask",
        "Не удалось создать задачу",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }

    return data;
  },

  // Обновление задачи
  async updateTask(
    id: string,
    task: Partial<Task>,
    client?: SupabaseClient
  ): Promise<Task> {
    const supabaseClient = client || supabase;
    
    // Strip virtual properties that don't belong to the tasks table
    const updatePayload: any = { ...task };
    const virtualFields = [
      'checklists', 'comments', 'assigneeName', 'observer_ids', 
      'observers', 'history', 'attachments', 'assignee', 'project'
    ];
    virtualFields.forEach(field => delete updatePayload[field]);

    if (Object.keys(updatePayload).length === 0) {
      // If nothing to update on the main table, just return the task
      return task as Task;
    }

    const { data, error } = await supabaseClient
      .from("tasks") // Kept original table 'tasks'
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single()
      .returns<any>(); // Added .returns<any>()

    if (error) {
      handleServiceError(
        error,
        "tasksService.updateTask",
        `Не удалось обновить задачу с ID ${id}`,
        ERROR_CODES.DB_UPDATE_FAILED
      );
    }

    return data;
  },

  // Удаление задачи
  async deleteTask(id: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

    if (error) {
      handleServiceError(
        error,
        "tasksService.deleteTask",
        `Не удалось удалить задачу с ID ${id}`,
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },

  // Получение комментариев к задаче
  async getTaskComments(
    taskId: string,
    client?: SupabaseClient
  ): Promise<TaskComment[]> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_comments" as any)
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .eq("task_id", taskId)
      .order("created_at", { ascending: true })
      .returns<any[]>();

    if (error) {
      handleServiceError(
        error,
        "tasksService.getTaskComments",
        `Не удалось загрузить комментарии для задачи ${taskId}`,
        ERROR_CODES.DB_QUERY_FAILED
      );
    }

    return data || [];
  },

  // Добавление комментария к задаче
  async addTaskComment(
    comment: Omit<TaskComment, "id" | "created_at" | "updated_at">,
    client?: SupabaseClient
  ): Promise<TaskComment> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_comments" as any)
      .insert(comment)
      .select()
      .single()
      .returns<any>();

    if (error) {
      handleServiceError(
        error,
        "tasksService.addTaskComment",
        "Не удалось добавить комментарий",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }

    return data;
  },

  // Управление участниками
  async addParticipant(
    taskId: string,
    userId: string,
    role: string = "observer",
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabaseClient.from("task_participants" as any).insert({
      task_id: taskId,
      user_id: userId,
      role, // Kept original 'role' parameter
    });

    if (error) {
      handleServiceError(
        error,
        "tasksService.addParticipant",
        "Не удалось добавить участника",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }
  },

  async removeParticipant(
    taskId: string,
    userId: string,
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_participants" as any)
      .delete()
      .match({ task_id: taskId, user_id: userId }); // Changed to .match as per instruction

    if (error) {
      handleServiceError(
        error,
        "tasksService.removeParticipant",
        "Не удалось удалить участника",
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },

  // Вложения
  async uploadAttachment(
    taskId: string,
    file: File,
    client?: SupabaseClient
  ): Promise<import("@/types").TaskAttachment> {
    const supabaseClient = client || supabase;

    // 1. Загрузка файла в Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `tasks/${taskId}/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("task-attachments")
      .upload(filePath, file);

    if (uploadError) {
      handleServiceError(
        uploadError,
        "tasksService.uploadAttachment",
        "Не удалось загрузить файл",
        ERROR_CODES.STORAGE_UPLOAD_FAILED
      );
    }

    // 2. Получение публичной ссылки
    const { data: urlData } = supabaseClient.storage
      .from("task-attachments")
      .getPublicUrl(filePath);

    // 3. Создание записи в таблице task_attachments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attachment, error: dbError } = await supabaseClient.from("task_attachments" as any).insert({
      task_id: taskId,
      file_name: file.name, // Kept original file.name
      file_url: urlData.publicUrl, // Kept original urlData.publicUrl
      file_size: file.size, // Kept original file.size
      file_type: file.type, // Kept original file.type
      // uploaded_by: uploadedBy, // Removed as 'uploadedBy' is not defined and not in original
    }).select().single().returns<any>();

    if (dbError) {
      handleServiceError(
        dbError,
        "tasksService.uploadAttachment.createRecord",
        "Не удалось создать запись о вложении",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }

    return attachment;
  },

  async deleteAttachment(
    id: string,
    fileUrl: string,
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;

    // Извлечение пути файла из URL
    // URL format typically: .../storage/v1/object/public/task-attachments/tasks/{taskId}/{fileName}
    const pathParts = fileUrl.split("task-attachments/");
    const filePath = pathParts[pathParts.length - 1];

    // 1. Удаление из Storage
    const { error: storageError } = await supabaseClient.storage
      .from("task-attachments")
      .remove([filePath]);

    if (storageError) {
      console.error("Ошибка при удалении из Storage:", storageError);
      // Можно продолжить удаление из БД даже если в Storage ошибка (например, файл уже удален)
    }

    // 2. Удаление из БД
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_attachments" as any)
      .delete()
      .eq("id", id); // Kept original 'id' parameter

    if (dbError) {
      handleServiceError(
        dbError,
        "tasksService.deleteAttachment",
        "Не удалось удалить вложение",
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },

  // Checklists
  async createChecklist(
    taskId: string,
    title: string,
    position: number = 0,
    client?: SupabaseClient
  ): Promise<import("@/types").TaskChecklist> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabaseClient
      .from("task_checklists" as any)
      .insert({
        task_id: taskId,
        title,
        position,
      })
      .select()
      .single()
      .returns<any>();

    if (error) {
      handleServiceError(
        error,
        "tasksService.createChecklist",
        "Не удалось создать чек-лист",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }

    return { ...data, items: [] };
  },

  async updateChecklist(
    id: string,
    updates: Partial<import("@/types").TaskChecklist>,
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("task_checklists")
      .update(updates)
      .eq("id", id);

    if (error) {
      handleServiceError(
        error,
        "tasksService.updateChecklist",
        "Не удалось обновить чек-лист",
        ERROR_CODES.DB_UPDATE_FAILED
      );
    }
  },

  async deleteChecklist(id: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_checklists" as any)
      .delete()
      .eq("id", id);

    if (error) {
      handleServiceError(
        error,
        "tasksService.deleteChecklist",
        "Не удалось удалить чек-лист",
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },

  // Checklist Items
  async createChecklistItem(
    checklistId: string,
    title: string,
    position: number = 0,
    client?: SupabaseClient
  ): Promise<import("@/types").TaskChecklistItem> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabaseClient
      .from("task_checklist_items" as any)
      .insert({
        checklist_id: checklistId,
        title,
        position,
      })
      .select()
      .single()
      .returns<any>();

    if (error) {
      handleServiceError(
        error,
        "tasksService.createChecklistItem",
        "Не удалось создать элемент чек-листа",
        ERROR_CODES.DB_INSERT_FAILED
      );
    }

    return data;
  },

  async updateChecklistItem(
    id: string,
    updates: Partial<import("@/types").TaskChecklistItem>,
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("task_checklist_items")
      .update(updates)
      .eq("id", id);

    if (error) {
      handleServiceError(
        error,
        "tasksService.updateChecklistItem",
        "Не удалось обновить элемент чек-листа",
        ERROR_CODES.DB_UPDATE_FAILED
      );
    }
  },

  async deleteChecklistItem(
    id: string,
    client?: SupabaseClient
  ): Promise<void> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabaseClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("task_checklist_items" as any)
      .delete()
      .eq("id", id);

    if (error) {
      handleServiceError(
        error,
        "tasksService.deleteChecklistItem",
        "Не удалось удалить элемент чек-листа",
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },
};

