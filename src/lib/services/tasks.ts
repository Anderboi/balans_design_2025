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
    let query = supabaseClient.from("tasks").select("*");

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query
      .select(
        `
        *,
        assignee:assigned_to(id, full_name, avatar_url),
        observers:task_participants(user:profiles(id, full_name, avatar_url))
      `
      )
      .order("due_date");

    if (error) {
      handleServiceError(
        error,
        "tasksService.getTasks",
        "Не удалось загрузить задачи",
        ERROR_CODES.DB_QUERY_FAILED
      );
    }

    // Map nested data to Participant interface
    return (data || []).map((task: Record<string, any>) => ({
      ...task,
      assigneeName: mapAssigneeName(task.assignee),
      observers: mapObserversToParticipants(task.observers),
    })) as Task[];
  },

  // Получение задачи по ID
  async getTaskById(id: string, client?: SupabaseClient): Promise<Task | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("tasks")
      .select(
        `
        *,
        assignee:assigned_to(id, full_name, avatar_url),
        observers:task_participants(user:profiles(id, full_name, avatar_url)),
        comments:task_comments(*, user:profiles(full_name, avatar_url)),
        attachments:task_attachments(*)
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

    return {
      ...data,
      assigneeName: mapAssigneeName(data.assignee),
      observers: mapObserversToParticipants(data.observers),
      comments: mapCommentsData(data.comments),
      attachments: data.attachments || [],
    } as Task;
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
      .single();

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
    const { data, error } = await supabaseClient
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select()
      .single();

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
    const { data, error } = await supabaseClient
      .from("task_comments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at");

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
    const { data, error } = await supabaseClient
      .from("task_comments")
      .insert(comment)
      .select()
      .single();

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
    const { error } = await supabaseClient.from("task_participants").insert({
      task_id: taskId,
      user_id: userId,
      role,
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
    const { error } = await supabaseClient
      .from("task_participants")
      .delete()
      .eq("task_id", taskId)
      .eq("user_id", userId);

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
    const { data: attachment, error: dbError } = await supabaseClient
      .from("task_attachments")
      .insert({
        task_id: taskId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .single();

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
    const { error: dbError } = await supabaseClient
      .from("task_attachments")
      .delete()
      .eq("id", id);

    if (dbError) {
      handleServiceError(
        dbError,
        "tasksService.deleteAttachment",
        "Не удалось удалить вложение",
        ERROR_CODES.DB_DELETE_FAILED
      );
    }
  },
};
