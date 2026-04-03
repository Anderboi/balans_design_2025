import { BRIEF_SECTION_IDS } from "@/config/brief-sections";
import { supabase } from "@/lib/supabase";
import { Project, ProjectStageItem, Room, ObjectInfo } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const projectsService = {
  // Получение всех проектов
  async getProjects(client?: SupabaseClient): Promise<Project[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*, contacts(*), project_stage_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при получении проектов:", error);
      throw error;
    }

    return (data as Project[]) || [];
  },

  // Получение проекта по ID
  async getProjectById(
    id: string,
    client?: SupabaseClient,
  ): Promise<Project | null> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error("Попытка получить проект с пустым ID");
      return null;
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*, contacts(*), project_stage_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error);
      throw error;
    }

    return data as Project;
  },

  // Создание нового проекта
  // Создание нового проекта
  async createProject(
    project: Omit<
      Project,
      "id" | "created_at" | "updated_at" | "contacts" | "rooms"
    >,
    client?: SupabaseClient,
  ): Promise<Project> {
    const supabaseClient = client || supabase;

    // Вызвать функцию PostgreSQL
    const { data, error } = await supabaseClient.rpc(
      "create_project_with_owner",
      {
        p_name: project.name,
        p_address: project.address || "",
        p_area: project.area || 0,
        p_client_id: project.client_id as string,
        p_stage: project.stage,
        p_residents: project.residents || "",
        p_demolition_info: project.demolition_info || "",
        p_construction_info: project.construction_info || "",
      },
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
    const newProjectId = typeof data === "string" ? data : (data as { id?: string })?.id;

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

    return newProject as Project;
  },

  // Обновление проекта
  async updateProject(
    id: string,
    project: Partial<Project>,
    client?: SupabaseClient,
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

    return data as Project;
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
        error,
      );
      throw error;
    }

    return (data as Room[]) || [];
  },

  // Получение проектов по ID клиента
  async getProjectsByClientId(
    clientId: string,
    client?: SupabaseClient,
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
        error,
      );
      throw error;
    }

    return (data as Project[]) || [];
  },

  // Получение статусов этапов проекта
  async getProjectStageItems(
    projectId: string,
    client?: SupabaseClient,
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

    return (data as ProjectStageItem[]) || [];
  },

  // Обновление/создание статуса этапа
  async toggleProjectStageItem(
    projectId: string,
    stageId: string,
    itemId: string,
    completed: boolean,
    client?: SupabaseClient,
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
        { onConflict: "project_id,stage_id,item_id" },
      )
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении статуса этапа:", error);
      throw error;
    }

    return data as ProjectStageItem;
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
    data: Record<string, unknown>, // Allow flexible partial updates
    client?: SupabaseClient,
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
        { onConflict: "project_id" },
      )
      .select()
      .single();

    if (error) {
      console.error(`Ошибка при сохранении брифа проекта ${projectId}:`, error);
      throw error;
    }

    // Автоматическая синхронизация статуса "Информация по объекту", если она была обновлена
    if (data.object_info) {
      await this.syncObjectInfoStatus(projectId, supabaseClient);
    }

    return result;
  },

  // Синхронизация статуса информации по объекту
  async syncObjectInfoStatus(projectId: string, client?: SupabaseClient) {
    const supabaseClient = client || supabase;

    // Получаем бриф для проверки заполненности object_info
    const { data: brief, error: fetchError } = await supabaseClient
      .from("project_briefs")
      .select("object_info")
      .eq("project_id", projectId)
      .single();

    if (fetchError) {
      console.error("Error fetching brief for object_info sync:", fetchError);
      return;
    }

    const objectInfo = (brief?.object_info as Record<string, unknown>) || {};

    // Считаем информацию по объекту заполненной, если загружены документы
    // или заполнены основные разделы (локация, тех. условия, ответственное лицо)
    const hasDocuments =
      Array.isArray(objectInfo.documents) && objectInfo.documents.length > 0;
    const hasLocation =
      !!objectInfo.location && Object.keys(objectInfo.location).length > 0;
    const hasTechnical =
      !!objectInfo.technicalConditions &&
      Object.keys(objectInfo.technicalConditions).length > 0;
    const hasResponsible =
      !!(objectInfo as unknown as ObjectInfo).responsiblePerson?.fullName;

    const isCompleted =
      hasDocuments || (hasLocation && hasTechnical && hasResponsible);

    await this.toggleProjectStageItem(
      projectId,
      "preproject",
      "object_info",
      isCompleted,
      supabaseClient,
    );
  },

  // Обновление статуса раздела брифа
  async updateBriefSectionStatus(
    projectId: string,
    sectionId: string,
    completed: boolean,
    client?: SupabaseClient,
  ) {
    const supabaseClient = client || supabase;

    // 1. Получаем текущий бриф
    const { data: brief, error: fetchError } = await supabaseClient
      .from("project_briefs")
      .select("sections_completed")
      .eq("project_id", projectId)
      .single();

    if (fetchError) {
      console.error(
        `Ошибка при получении брифа для обновления статуса ${sectionId}:`,
        fetchError,
      );
      throw fetchError;
    }

    const currentSections = (brief?.sections_completed as string[]) || [];
    let newSections = [...currentSections];

    if (completed) {
      if (!newSections.includes(sectionId)) {
        newSections.push(sectionId);
      }
    } else {
      newSections = newSections.filter((id) => id !== sectionId);
    }

    // 2. Обновляем список завершенных разделов
    const { error: updateError } = await supabaseClient
      .from("project_briefs")
      .update({
        sections_completed: newSections,
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", projectId);

    if (updateError) {
      console.error(
        `Ошибка при обновлении статуса раздела ${sectionId}:`,
        updateError,
      );
      throw updateError;
    }

    // 3. Проверяем, все ли разделы завершены
    const allCompleted = BRIEF_SECTION_IDS.every((id) =>
      newSections.includes(id),
    );

    // 4. Обновляем статус этапа "Техническое задание" (brief)
    await this.toggleProjectStageItem(
      projectId,
      "preproject",
      "brief",
      allCompleted,
      supabaseClient,
    );
  },

  // Синхронизация статуса планировочных решений
  async syncPlanningStatus(projectId: string, client?: SupabaseClient) {
    const supabaseClient = client || supabase;

    // Проверяем наличие хотя бы одного утвержденного варианта планировки
    const { data, error } = await supabaseClient
      .from("planning_variants")
      .select("id")
      .eq("project_id", projectId)
      .eq("approved", true)
      .limit(1);

    if (error) {
      console.error("Error checking planning approval status:", error);
      return;
    }

    const isCompleted = data && data.length > 0;

    await this.toggleProjectStageItem(
      projectId,
      "concept",
      "planning",
      isCompleted,
      supabaseClient,
    );
  },

  // Синхронизация статуса коллажей
  async syncCollagesStatus(projectId: string, client?: SupabaseClient) {
    const supabaseClient = client || supabase;

    // 1. Получаем все помещения проекта
    const { data: rooms, error: roomsError } = await supabaseClient
      .from("rooms")
      .select("id")
      .eq("project_id", projectId);

    if (roomsError) {
      console.error("Error fetching rooms for collage sync:", roomsError);
      return;
    }

    if (!rooms || rooms.length === 0) {
      // Если помещений нет, считаем не выполненным (или по логике бизнеса?)
      // Но обычно помещения есть.
      await this.toggleProjectStageItem(
        projectId,
        "concept",
        "collages",
        false,
        supabaseClient,
      );
      return;
    }

    // 2. Получаем все утвержденные коллажи для этих помещений
    const roomIds = rooms.map((r) => r.id);
    const { data: approvedCollages, error: collagesError } =
      await supabaseClient
        .from("collage_variants")
        .select("room_id")
        .in("room_id", roomIds)
        .eq("approved", true);

    if (collagesError) {
      console.error("Error fetching approved collages:", collagesError);
      return;
    }

    // 3. Проверяем, что для КАЖДОГО помещения есть хотя бы один утвержденный коллаж
    const approvedRoomIds = new Set(approvedCollages?.map((c) => c.room_id));
    const allRoomsHaveApprovedCollages = rooms.every((room) =>
      approvedRoomIds.has(room.id),
    );

    await this.toggleProjectStageItem(
      projectId,
      "concept",
      "collages",
      allRoomsHaveApprovedCollages,
      supabaseClient,
    );
  },

  // Синхронизация статуса визуализаций
  async syncVisualizationsStatus(projectId: string, client?: SupabaseClient) {
    const supabaseClient = client || supabase;

    // 1. Получаем все помещения проекта
    const { data: rooms, error: roomsError } = await supabaseClient
      .from("rooms")
      .select("id")
      .eq("project_id", projectId);

    if (roomsError) {
      console.error("Error fetching rooms for visualization sync:", roomsError);
      return;
    }

    if (!rooms || rooms.length === 0) {
      await this.toggleProjectStageItem(
        projectId,
        "concept",
        "viz",
        false,
        supabaseClient,
      );
      return;
    }

    // 2. Получаем все утвержденные визуализации для этих помещений
    const roomIds = rooms.map((r) => r.id);
    const { data: approvedVizes, error: vizesError } = await supabaseClient
      .from("visualization_variants")
      .select("room_id")
      .in("room_id", roomIds)
      .eq("approved", true);

    if (vizesError) {
      console.error("Error fetching approved visualizations:", vizesError);
      return;
    }

    // 3. Проверяем, что для КАЖДОГО помещения есть хотя бы один утвержденный вариант
    const approvedRoomIds = new Set(approvedVizes?.map((v) => v.room_id));
    const allRoomsHaveApprovedVizes = rooms.every((room) =>
      approvedRoomIds.has(room.id),
    );

    await this.toggleProjectStageItem(
      projectId,
      "concept",
      "viz",
      allRoomsHaveApprovedVizes,
      supabaseClient,
    );
  },
};
