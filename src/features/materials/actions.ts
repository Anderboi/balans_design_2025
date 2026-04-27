"use server";
import { projectsService } from "@/lib/services/projects";
import { materialsService } from "@/lib/services/materials";
import { getUser } from "@/lib/supabase/getuser";
import { contactsService } from "@/lib/services/contacts";
import { companiesService } from "@/lib/services/companies";
import { Material, ContactType, CompanyType } from "@/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
  try {
    const supabase = await createClient();
    return await projectsService.getProjects(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    return [];
  }
}

export async function getMaterials() {
  try {
    const supabase = await createClient();
    return await materialsService.getMaterials(undefined, supabase);
  } catch (error) {
    console.error("Ошибка при загрузке материалов:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient();
    return await materialsService.getCategories(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    return [];
  }
}

export async function getSuppliers() {
  try {
    const supabase = await createClient();
    return await contactsService.getContactsByType(
      ContactType.SUPPLIER,
      supabase,
    );
  } catch (error) {
    console.error("Ошибка при загрузке поставщиков:", error);
    return [];
  }
}

export async function getSupplierCompanies() {
  try {
    const supabase = await createClient();
    return await companiesService.getCompaniesByType(
      CompanyType.SUPPLIER,
      supabase,
    );
  } catch (error) {
    console.error("Ошибка при загрузке компаний:", error);
    return [];
  }
}

export async function createMaterial(
  material: Omit<Material, "id" | "created_at" | "updated_at">,
) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    const result = await materialsService.createMaterial(
      {
        ...material,
        user_id: user?.id,
      },
      supabase,
    );
    revalidatePath("/materials");
    return { success: true, data: result };
  } catch (error) {
    console.error("Ошибка при добавлении материала:", error);
    return { success: false, error: "Не удалось добавить материал" };
  }
}

export async function updateMaterial(id: string, updates: Partial<Material>) {
  try {
    const supabase = await createClient();
    await materialsService.updateMaterial(id, updates, supabase);
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении материала:", error);
    return { success: false, error: "Не удалось обновить материал" };
  }
}

export async function deleteMaterial(id: string) {
  try {
    const supabase = await createClient();
    await materialsService.deleteMaterial(id, supabase);
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении материала:", error);
    return { success: false, error: "Не удалось удалить материал" };
  }
}
