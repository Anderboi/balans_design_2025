"use server";

import { projectsService } from "@/lib/services/projects";
import { materialsService } from "@/lib/services/materials";
import { contactsService } from "@/lib/services/contacts";
import { companiesService } from "@/lib/services/companies";
import { Material, ContactType, CompanyType } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    return await projectsService.getProjects();
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    return [];
  }
}

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

export async function getSuppliers() {
  try {
    return await contactsService.getContactsByType(ContactType.SUPPLIER);
  } catch (error) {
    console.error("Ошибка при загрузке поставщиков:", error);
    return [];
  }
}

export async function getSupplierCompanies() {
  try {
    return await companiesService.getCompaniesByType(CompanyType.SUPPLIER);
  } catch (error) {
    console.error("Ошибка при загрузке компаний:", error);
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
