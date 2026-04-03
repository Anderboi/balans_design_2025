import { supabase } from "../supabase";
import { Material, SpecificationMaterial, MaterialType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const materialsService = {
  // Получение всех материалов
  async getMaterials(
    params?: { limit?: number; offset?: number },
    client?: SupabaseClient,
  ): Promise<Material[]> {
    const supabaseClient = client || supabase;
    let query = supabaseClient.from("materials").select("*");

    if (params?.limit) {
      query = query.range(
        params.offset || 0,
        (params.offset || 0) + params.limit - 1,
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Ошибка при получении материалов:", error);
      throw error;
    }

    return (data as unknown as Material[]) || [];
  },

  // Получить материалы по типу
  async getMaterialsByType(
    type: MaterialType,
    client?: SupabaseClient,
  ): Promise<Material[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при получении материалов по типу:", error);
      throw error;
    }

    return (data as unknown as Material[]) || [];
  },

  // Поиск материалов
  async searchMaterials(
    searchQuery: string,
    params?: { limit?: number; offset?: number },
    client?: SupabaseClient,
  ): Promise<Material[]> {
    const supabaseClient = client || supabase;
    let query = supabaseClient
      .from("materials")
      .select("*")
      .or(
        `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,manufacturer.ilike.%${searchQuery}%`,
      );

    if (params?.limit) {
      query = query.range(
        params.offset || 0,
        (params.offset || 0) + params.limit - 1,
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Ошибка при поиске материалов:", error);
      throw error;
    }

    return (data as unknown as Material[]) || [];
  },

  // Получить материал по ID
  async getMaterialById(
    id: string,
    client?: SupabaseClient,
  ): Promise<Material | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка при получении материала по ID:", error);
      throw error;
    }

    return data as unknown as Material;
  },

  // Создать новый материал
  async createMaterial(
    material: Omit<Material, "id" | "created_at" | "updated_at"> & {
      user_id?: string | null;
    },
    client?: SupabaseClient,
  ): Promise<Material> {
    const supabaseClient = client || supabase;

    // Получаем текущего пользователя для RLS
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { attachments, ...insertData } = material as any;
    void attachments;

    const { data, error } = await supabaseClient
      .from("materials")
      .insert([
        {
          ...insertData,
          user_id: insertData.user_id || user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Ошибка при создании материала:", error);
      throw error;
    }

    return data as unknown as Material;
  },

  // Обновить материал
  async updateMaterial(
    id: string,
    updates: Partial<Omit<Material, "id" | "created_at" | "updated_at">>,
    client?: SupabaseClient,
  ): Promise<Material> {
    const supabaseClient = client || supabase;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { attachments, ...updateData } = updates as any;
    const { data, error } = await supabaseClient
      .from("materials")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении материала:", error);
      throw error;
    }

    return data as unknown as Material;
  },

  // Удалить материал
  async deleteMaterial(id: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("materials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Ошибка при удалении материала:", error);
      throw error;
    }
  },

  // Получить уникальные категории
  async getCategories(client?: SupabaseClient): Promise<string[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .select("category")
      .not("category", "is", null);

    if (error) {
      console.error("Ошибка при получении категорий:", error);
      throw error;
    }

    const categories = [...new Set(data?.map((item) => item.category) || [])];
    return categories.filter(Boolean) as string[];
  },

  // Получение спецификаций для проекта
  async getSpecifications(
    projectId: string,
    client?: SupabaseClient,
  ): Promise<SpecificationMaterial[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .select("*, materials(*), rooms(name)")
      .eq("project_id", projectId);

    if (error) {
      console.error(
        `Ошибка при получении спецификаций для проекта ${projectId}:`,
        error,
      );
      throw error;
    }

    return (data as unknown as SpecificationMaterial[]) || [];
  },

  // Получить материалы спецификации по типу
  async getSpecMaterialsByType(
    type: MaterialType,
    client?: SupabaseClient,
  ): Promise<SpecificationMaterial[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при получении материалов по типу:", error);
      throw error;
    }

    return (data as unknown as SpecificationMaterial[]) || [];
  },

  async getNextProjectArticle(
    projectId: string,
    type: MaterialType,
    client?: SupabaseClient,
  ): Promise<string> {
    const supabaseClient = client || supabase;
    const { count, error } = await supabaseClient
      .from("specifications")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId)
      .eq("type", type);

    if (error) {
      console.error("Error getting next project article:", error);
      return "";
    }

    const prefixes: Record<string, string> = {
      Отделка: "От-",
      Мебель: "М-",
      Оборудование: "Об-",
      Сантехника: "С-",
      Освещение: "Ос-",
      Текстиль: "Т-",
      "Инженерное оборудование": "И-",
      Декор: "Д-",
      Двери: "Дв-",
      Электрика: "Э-",
    };

    const prefix = prefixes[type] || "Мат";
    const nextNumber = (count || 0) + 1;
    return `${prefix}-${nextNumber.toString().padStart(2, "0")}`;
  },

  // Добавление спецификации
  async addSpecification(
    spec: Omit<SpecificationMaterial, "id" | "created_at" | "updated_at"> & {
      project_article?: string;
    },
    client?: SupabaseClient,
  ): Promise<SpecificationMaterial> {
    const supabaseClient = client || supabase;

    let project_article = spec.project_article;
    if (!project_article) {
      project_article = await this.getNextProjectArticle(
        spec.project_id,
        spec.type,
        supabaseClient,
      );
    }

    const { data, error } = await supabaseClient
      .from("specifications")
      .insert({ ...spec, project_article })
      .select()
      .single();

    if (error) {
      console.error("Ошибка при добавлении спецификации:", error);
      throw error;
    }

    return data as unknown as SpecificationMaterial;
  },

  // Обновление спецификации
  async updateSpecification(
    id: string,
    updates: Partial<
      Omit<SpecificationMaterial, "id" | "created_at" | "updated_at">
    >,
    client?: SupabaseClient,
  ): Promise<SpecificationMaterial> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении спецификации:", error);
      throw error;
    }

    return data as unknown as SpecificationMaterial;
  },

  async updateSpecMaterial(
    specMaterialId: string,
    data: Partial<SpecificationMaterial>,
    client?: SupabaseClient,
  ) {
    const supabaseClient = client || supabase;
    // Подготавливаем данные для обновления
    const updateData: Partial<SpecificationMaterial> = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabaseClient
      .from("specifications")
      .update(updateData)
      .eq("id", specMaterialId)
      .select()
      .single();

    if (error) throw error;
    return result as unknown as SpecificationMaterial;
  },

  // Удаление спецификации
  async deleteSpecification(
    id: string,
    client?: SupabaseClient,
  ): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("specifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Ошибка при удалении спецификации:", error);
      throw error;
    }
  },

  // Получение спецификаций для конкретного помещения
  async getSpecificationsByRoom(
    projectId: string,
    roomId: string,
    client?: SupabaseClient,
  ): Promise<SpecificationMaterial[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .select("*, materials(*), rooms(name)")
      .eq("project_id", projectId)
      .eq("room_id", roomId);

    if (error) {
      console.error(
        `Ошибка при получении спецификаций для помещения ${roomId}:`,
        error,
      );
      throw error;
    }

    return (data as unknown as SpecificationMaterial[]) || [];
  },
};
