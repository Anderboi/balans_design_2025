"use server";

import { materialsService } from "@/lib/services/materials";
import { Material } from "@/types";
import { revalidatePath } from "next/cache";

export async function getMaterials() {
  try {
    return await materialsService.getMaterials();
  } catch (error) {
    console.error("Ошибка при загрузке материалов:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    return await materialsService.getCategories();
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    // Возвращаем пустой массив вместо выброса ошибки
    return [];
  }
}

export async function createMaterial(
  material: Omit<Material, "id" | "created_at" | "updated_at">
) {
  try {
    const result = await materialsService.createMaterial(material);
    revalidatePath("/materials");
    return { success: true, data: result };
  } catch (error) {
    console.error("Ошибка при добавлении материала:", error);
    return { success: false, error: "Не удалось добавить материал" };
  }
}

export async function updateMaterial(id: string, updates: Partial<Material>) {
  try {
    await materialsService.updateMaterial(id, updates);
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении материала:", error);
    return { success: false, error: "Не удалось обновить материал" };
  }
}

export async function deleteMaterial(id: string) {
  try {
    await materialsService.deleteMaterial(id);
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении материала:", error);
    return { success: false, error: "Не удалось удалить материал" };
  }
}
