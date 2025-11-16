import { supabase } from '@/lib/supabase';
import { Material, SpecificationMaterial, MaterialType } from "@/types";

export const materialsService = {
  // Получение всех материалов
  async getMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
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
  async getMaterialsByType(type: MaterialType): Promise<Material[]> {
    const { data, error } = await supabase
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
  async searchMaterials(query: string): Promise<Material[]> {
    const { data, error } = await supabase
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
  async getMaterialById(id: string): Promise<Material | null> {
    const { data, error } = await supabase
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
    material: Omit<Material, "id" | "created_at" | "updated_at">
  ): Promise<Material> {
    const { data, error } = await supabase
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
    updates: Partial<Omit<Material, "id" | "created_at" | "updated_at">>
  ): Promise<Material> {
    const { data, error } = await supabase
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
  async deleteMaterial(id: string): Promise<void> {
    const { error } = await supabase.from("materials").delete().eq("id", id);

    if (error) {
      console.error("Ошибка при удалении материала:", error);
      throw error;
    }
  },

  // Получить уникальные категории
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
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
  async getSpecifications(projectId: string): Promise<SpecificationMaterial[]> {
    const { data, error } = await supabase
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

  // Добавление спецификации
  async addSpecification(
    spec: Omit<SpecificationMaterial, "id" | "created_at" | "updated_at">
  ): Promise<SpecificationMaterial> {
    const { data, error } = await supabase
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
    >
  ): Promise<SpecificationMaterial> {
    const { data, error } = await supabase
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
    }>
  ) {
    // Подготавливаем данные для обновления
    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('specifications')
      .update(updateData)
      .eq('id', specMaterialId)
      .select()
      .single();

    if (error) throw error;
    return result;
  },


  // Удаление спецификации
  async deleteSpecification(id: string): Promise<void> {
    const { error } = await supabase
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
    roomId: string
  ): Promise<SpecificationMaterial[]> {
    const { data, error } = await supabase
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