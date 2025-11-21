import { supabase } from "@/lib/supabase";
import { Project } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const projectsService = {
  // Получение всех проектов
  async getProjects(client?: SupabaseClient): Promise<Project[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при получении проектов:", error);
      throw error;
    }

    return data || [];
  },

  // Получение проекта по ID
  async getProjectById(
    id: string,
    client?: SupabaseClient
  ): Promise<Project | null> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error("Попытка получить проект с пустым ID");
      return null;
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*, contacts(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error);
      throw error;
    }

    return data;
  },

  // Создание нового проекта
  async createProject(
    project: Omit<
      Project,
      "id" | "created_at" | "updated_at" | "contacts" | "rooms"
    >,
    client?: SupabaseClient
  ): Promise<Project> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при создании проекта:", error);
      throw error;
    }

    return data;
  },

  // Обновление проекта
  async updateProject(
    id: string,
    project: Partial<Project>,
    client?: SupabaseClient
  ): Promise<Project> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error("Попытка обновить проект с пустым ID");
      throw new Error("ID проекта не может быть пустым");
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Ошибка при обновлении проекта с ID ${id}:`, error);
      throw error;
    }

    return data;
  },

  // Удаление проекта
  async deleteProject(id: string, client?: SupabaseClient): Promise<void> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error("Попытка удалить проект с пустым ID");
      throw new Error("ID проекта не может быть пустым");
    }

    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Ошибка при удалении проекта с ID ${id}:`, error);
      throw error;
    }
  },

  // Получение помещений проекта
  async getRooms(projectId: string, client?: SupabaseClient) {
    // Проверка на undefined или пустой ID
    if (!projectId) {
      console.error("Попытка получить помещения проекта с пустым ID");
      return [];
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("rooms")
      .select("*")
      .eq("project_id", projectId)
      .order("name");

    if (error) {
      console.error(
        `Ошибка при получении помещений для проекта ${projectId}:`,
        error
      );
      throw error;
    }

    return data || [];
  },

  // Получение проектов по ID клиента
  async getProjectsByClientId(
    clientId: string,
    client?: SupabaseClient
  ): Promise<Project[]> {
    if (!clientId) {
      console.error("Попытка получить проекты с пустым ID клиента");
      return [];
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("client_id", clientId);

    if (error) {
      console.error(
        `Ошибка при получении проектов для клиента с ID ${clientId}:`,
        error
      );
      throw error;
    }

    return data || [];
  },
};
