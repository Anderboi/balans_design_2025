import { supabase } from "../supabase";
import { Material, SpecificationMaterial, MaterialType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const materialsService = {
  // Получение всех материалов
  async getMaterials(client?: SupabaseClient): Promise<Material[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при получении материалов:", error);
      throw error;
    }

    return data || [];
  },

  // Получить материалы по типу
  async getMaterialsByType(
    type: MaterialType,
    client?: SupabaseClient
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

    return data || [];
  },

  // Поиск материалов
  async searchMaterials(
    query: string,
    client?: SupabaseClient
  ): Promise<Material[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .select("*")
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,manufacturer.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при поиске материалов:", error);
      throw error;
    }

    return data || [];
  },

  // Получить материал по ID
  async getMaterialById(
    id: string,
    client?: SupabaseClient
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

    return data;
  },

  // Создать новый материал
  async createMaterial(
    material: Omit<Material, "id" | "created_at" | "updated_at">,
    client?: SupabaseClient
  ): Promise<Material> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .insert([material])
      .select()
      .single();

    if (error) {
      console.error("Ошибка при создании материала:", error);
      throw error;
    }

    return data;
  },

  // Обновить материал
  async updateMaterial(
    id: string,
    updates: Partial<Omit<Material, "id" | "created_at" | "updated_at">>,
    client?: SupabaseClient
  ): Promise<Material> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("materials")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении материала:", error);
      throw error;
    }

    return data;
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
    return categories.filter(Boolean);
  },

  // Получение спецификаций для проекта
  async getSpecifications(
    projectId: string,
    client?: SupabaseClient
  ): Promise<SpecificationMaterial[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .select("*, materials(*), rooms(name)")
      .eq("project_id", projectId);

    if (error) {
      console.error(
        `Ошибка при получении спецификаций для проекта ${projectId}:`,
        error
      );
      throw error;
    }

    return data || [];
  },

  // Получить материалы спецификации по типу
  async getSpecMaterialsByType(
    type: SpecificationMaterial,
    client?: SupabaseClient
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

    return data || [];
  },

  // Добавление спецификации
  async addSpecification(
    spec: Omit<SpecificationMaterial, "id" | "created_at" | "updated_at">,
    client?: SupabaseClient
  ): Promise<SpecificationMaterial> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("specifications")
      .insert(spec)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при добавлении спецификации:", error);
      throw error;
    }

    return data;
  },

  // Обновление спецификации
  async updateSpecification(
    id: string,
    updates: Partial<
      Omit<SpecificationMaterial, "id" | "created_at" | "updated_at">
    >,
    client?: SupabaseClient
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

    return data;
  },

  async updateSpecMaterial(
    specMaterialId: string,
    data: Partial<{
      name: string;
      description: string;
      manufacturer: string;
      supplier: string;
      size: string;
      color: string;
      material: string;
      quantity: number;
      unit: string;
      price: number;
      notes: string;
    }>,
    client?: SupabaseClient
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
    return result;
  },

  // Удаление спецификации
  async deleteSpecification(
    id: string,
    client?: SupabaseClient
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
    client?: SupabaseClient
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
        error
      );
      throw error;
    }

    return data || [];
  },
};
