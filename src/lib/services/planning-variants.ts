import { SupabaseClient } from "@supabase/supabase-js";
import { PlanningVariant } from "@/types/planning";

// Название бакета для хранения файлов
const BUCKET_NAME = "planning_files";

export const planningVariantsService = {
  // Получение всех вариантов планировки для проекта
  async getPlanningVariants(
    projectId: string,
    client: SupabaseClient,
  ): Promise<PlanningVariant[]> {
    const { data, error } = await client
      .from("planning_variants")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching planning variants:", error);
      throw error;
    }

    return data || [];
  },

  // Создание нового варианта планировки
  async createPlanningVariant(
    variant: Omit<
      PlanningVariant,
      "id" | "created_at" | "updated_at" | "approved" | "approved_at"
    >,
    client: SupabaseClient,
  ): Promise<PlanningVariant> {
    const { data, error } = await client
      .from("planning_variants")
      .insert(variant)
      .select()
      .single();

    if (error) {
      console.error("Error creating planning variant:", error);
      throw error;
    }

    return data;
  },

  // Утверждение варианта планировки
  async approvePlanningVariant(
    variantId: string,
    projectId: string,
    client: SupabaseClient,
  ): Promise<void> {
    // Сначала снимаем утверждение со всех вариантов проекта
    const { error: resetError } = await client
      .from("planning_variants")
      .update({
        approved: false,
        approved_at: null,
      })
      .eq("project_id", projectId);

    if (resetError) {
      console.error("Error resetting approved status:", resetError);
      throw resetError;
    }

    // Затем утверждаем выбранный вариант
    const { error: approveError } = await client
      .from("planning_variants")
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
      })
      .eq("id", variantId);

    if (approveError) {
      console.error("Error approving variant:", approveError);
      throw approveError;
    }
  },

  // Удаление варианта планировки
  async deletePlanningVariant(
    variantId: string,
    fileUrl: string,
    client: SupabaseClient,
  ): Promise<void> {
    // Сначала удаляем запись из БД
    const { error: dbError } = await client
      .from("planning_variants")
      .delete()
      .eq("id", variantId);

    if (dbError) {
      console.error("Error deleting variant from DB:", dbError);
      throw dbError;
    }

    // Затем пытаемся удалить файл из хранилища
    try {
      // Извлекаем путь к файлу из URL
      // URL обычно выглядит так: .../storage/v1/object/public/bucket_name/path/to/file
      const urlParts = fileUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await client.storage
          .from(BUCKET_NAME)
          .remove([filePath]);

        if (storageError) {
          console.warn("Error deleting file from storage:", storageError);
        }
      }
    } catch (e) {
      console.warn("Error parsing file URL for deletion:", e);
    }
  },

  // Загрузка файла в хранилище
  async uploadFile(
    file: File,
    directory: string,
    client: SupabaseClient,
  ): Promise<{ path: string; fullUrl: string }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${directory}/${fileName}`;

    const { error: uploadError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      path: filePath,
      fullUrl: data.publicUrl,
    };
  },
};
