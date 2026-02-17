import { SupabaseClient } from "@supabase/supabase-js";
import { CollageVariant, CollageImage } from "@/types/collages";

const BUCKET_NAME = "collage_files";

export const collageVariantsService = {
  // Получение всех вариантов коллажей для проекта
  async getCollageVariants(
    projectId: string,
    client: SupabaseClient,
  ): Promise<CollageVariant[]> {
    const { data, error } = await client
      .from("collage_variants")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching collage variants:", error);
      throw error;
    }

    return data || [];
  },

  // Получение вариантов по помещению
  async getByRoomId(
    roomId: string,
    client: SupabaseClient,
  ): Promise<CollageVariant[]> {
    const { data, error } = await client
      .from("collage_variants")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching collage variants by room:", error);
      throw error;
    }

    return data || [];
  },

  // Создание нового варианта коллажа
  async createCollageVariant(
    variant: Omit<
      CollageVariant,
      "id" | "created_at" | "updated_at" | "approved" | "approved_at"
    >,
    client: SupabaseClient,
  ): Promise<CollageVariant> {
    const { data, error } = await client
      .from("collage_variants")
      .insert(variant)
      .select()
      .single();

    if (error) {
      console.error("Error creating collage variant:", error);
      throw error;
    }

    return data;
  },

  // Обновление варианта (заголовок, описание, изображения)
  async updateCollageVariant(
    variantId: string,
    updates: Partial<CollageVariant>,
    client: SupabaseClient,
  ): Promise<CollageVariant> {
    const { data, error } = await client
      .from("collage_variants")
      .update(updates)
      .eq("id", variantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating collage variant:", error);
      throw error;
    }

    return data;
  },

  // Утверждение варианта коллажа (per-room)
  async approveCollageVariant(
    variantId: string,
    roomId: string,
    client: SupabaseClient,
  ): Promise<void> {
    // Сначала снимаем утверждение со всех вариантов этого помещения
    const { error: resetError } = await client
      .from("collage_variants")
      .update({
        approved: false,
        approved_at: null,
      })
      .eq("room_id", roomId);

    if (resetError) {
      console.error("Error resetting approved status:", resetError);
      throw resetError;
    }

    // Затем утверждаем выбранный вариант
    const { error: approveError } = await client
      .from("collage_variants")
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
      })
      .eq("id", variantId);

    if (approveError) {
      console.error("Error approving collage variant:", approveError);
      throw approveError;
    }
  },

  // Отмена согласования для помещения
  async cancelApproval(roomId: string, client: SupabaseClient): Promise<void> {
    const { error } = await client
      .from("collage_variants")
      .update({
        approved: false,
        approved_at: null,
      })
      .eq("room_id", roomId);

    if (error) {
      console.error("Error canceling collage approval:", error);
      throw error;
    }
  },

  // Удаление варианта коллажа (включая все файлы в нем)
  async deleteCollageVariant(
    variantId: string,
    images: CollageImage[],
    client: SupabaseClient,
  ): Promise<void> {
    // Удаляем из БД
    const { error: dbError } = await client
      .from("collage_variants")
      .delete()
      .eq("id", variantId);

    if (dbError) {
      console.error("Error deleting collage variant from DB:", dbError);
      throw dbError;
    }

    // Удаляем все файлы из хранилища
    for (const image of images) {
      try {
        const urlParts = image.url.split(`${BUCKET_NAME}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await client.storage.from(BUCKET_NAME).remove([filePath]);
        }
      } catch (e) {
        console.warn("Error deleting file during variant deletion:", e);
      }
    }
  },

  // Удаление конкретного изображения из варианта
  async deleteImage(
    variantId: string,
    images: CollageImage[],
    imageToDeleteId: string,
    client: SupabaseClient,
  ): Promise<CollageVariant> {
    const imageToDelete = images.find((img) => img.id === imageToDeleteId);
    const updatedImages = images.filter((img) => img.id !== imageToDeleteId);

    // Удаляем из хранилища
    if (imageToDelete) {
      try {
        const urlParts = imageToDelete.url.split(`${BUCKET_NAME}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await client.storage.from(BUCKET_NAME).remove([filePath]);
        }
      } catch (e) {
        console.warn("Error deleting file from storage:", e);
      }
    }

    // Обновляем БД
    return this.updateCollageVariant(
      variantId,
      { images: updatedImages },
      client,
    );
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
