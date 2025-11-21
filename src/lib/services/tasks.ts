import { supabase } from "../supabase";
import { Task, TaskComment } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const tasksService = {
  // Получение всех задач
  async getTasks(projectId?: string, client?: SupabaseClient): Promise<Task[]> {
    const supabaseClient = client || supabase;
    let query = supabaseClient.from("tasks").select("*");

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query.order("due_date");

    if (error) {
      console.error("Ошибка при получении задач:", error);
      throw error;
    }

    return data || [];
  },

  // Получение задачи по ID
  async getTaskById(id: string, client?: SupabaseClient): Promise<Task | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Ошибка при получении задачи с ID ${id}:`, error);
      throw error;
    }

    return data;
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
      console.error("Ошибка при создании задачи:", error);
      throw error;
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
      console.error(`Ошибка при обновлении задачи с ID ${id}:`, error);
      throw error;
    }

    return data;
  },

  // Удаление задачи
  async deleteTask(id: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

    if (error) {
      console.error(`Ошибка при удалении задачи с ID ${id}:`, error);
      throw error;
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
      console.error(
        `Ошибка при получении комментариев для задачи ${taskId}:`,
        error
      );
      throw error;
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
      console.error("Ошибка при добавлении комментария:", error);
      throw error;
    }

    return data;
  },
};
