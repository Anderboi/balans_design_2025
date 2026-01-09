import { supabase } from "@/lib/supabase";
import { Project, ProjectStageItem } from "@/types";
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
  // Создание нового проекта
  async createProject(
    project: Omit<
      Project,
      "id" | "created_at" | "updated_at" | "contacts" | "rooms"
    >,
    client?: SupabaseClient
  ): Promise<Project> {
    const supabaseClient = client || supabase;

    // Вызвать функцию PostgreSQL
    const { data, error } = await supabaseClient.rpc(
      "create_project_with_owner",
      {
        p_name: project.name,
        p_address: project.address || "",
        p_area: project.area || 0,
        p_client_id: project.client_id || null,
        p_stage: project.stage,
        p_residents: project.residents || "",
        p_demolition_info: project.demolition_info || "",
        p_construction_info: project.construction_info || "",
      }
    );

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    // Если функция возвращает ID созданного проекта, получаем полные данные
    // В данном случае, судя по RPC, она может возвращать сам объект или ID.
    // Предполагаем, что RPC возвращает { id: "..." } или сам объект.
    // Если RPC возвращает void или только ID, то нужно сделать select.

    // Для совместимости с текущим API получим проект
    // (Если RPC возвращает уже полный проект, можно вернуть data)

    // Проверим, что вернуло data.
    // Если id есть в data, используем его.
    const newProjectId = data?.id || data;

    if (!newProjectId) {
      throw new Error("Не удалось получить ID созданного проекта");
    }

    const { data: newProject, error: fetchError } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("id", newProjectId)
      .single();

    if (fetchError || !newProject) {
      throw new Error("Проект создан, но не удалось получить его данные");
    }

    return newProject;
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

  // Получение статусов этапов проекта
  async getProjectStageItems(
    projectId: string,
    client?: SupabaseClient
  ): Promise<ProjectStageItem[]> {
    if (!projectId) return [];

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("project_stage_items")
      .select("*")
      .eq("project_id", projectId);

    if (error) {
      console.error(`Ошибка при получении этапов проекта ${projectId}:`, error);
      // Не выбрасываем ошибку, чтобы не ломать UI, просто вернем пустой массив
      return [];
    }

    return data || [];
  },

  // Обновление/создание статуса этапа
  async toggleProjectStageItem(
    projectId: string,
    stageId: string,
    itemId: string,
    completed: boolean,
    client?: SupabaseClient
  ): Promise<ProjectStageItem | null> {
    const supabaseClient = client || supabase;

    // Используем upsert для создания или обновления
    // completed_at ставим текущее время если completed=true, иначе null
    const { data, error } = await supabaseClient
      .from("project_stage_items")
      .upsert(
        {
          project_id: projectId,
          stage_id: stageId,
          item_id: itemId,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id,stage_id,item_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении статуса этапа:", error);
      throw error;
    }

    return data;
  },

  // Получение брифа проекта
  async getProjectBrief(projectId: string, client?: SupabaseClient) {
    if (!projectId) return null;

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("project_briefs")
      .select("*")
      .eq("project_id", projectId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (бриф еще не создан)
      console.error(`Ошибка при получении брифа проекта ${projectId}:`, error);
      throw error;
    }

    return data;
  },

  // Обновление/создание брифа
  async updateProjectBrief(
    projectId: string,
    data: Record<string, any>, // Allow flexible partial updates
    client?: SupabaseClient
  ) {
    if (!projectId) throw new Error("ID проекта обязателен");

    const supabaseClient = client || supabase;

    const { data: result, error } = await supabaseClient
      .from("project_briefs")
      .upsert(
        {
          project_id: projectId,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id" }
      )
      .select()
      .single();

    if (error) {
      console.error(`Ошибка при сохранении брифа проекта ${projectId}:`, error);
      throw error;
    }

    return result;
  },
};
