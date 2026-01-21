import { supabase } from "../supabase";
import { SupabaseClient } from "@supabase/supabase-js";

// Загрузка изображения материала в Supabase Storage и возврат публичного URL
export const storageService = {
  async uploadMaterialImage(
    file: File,
    client?: SupabaseClient,
  ): Promise<string> {
    const supabaseClient = client || supabase;
    // Валидация размера (макс ~4MB)
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("Файл превышает максимальный размер 4MB");
    }

    const bucket = "materials";
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Ошибка при загрузке файла в Storage:", uploadError);
      throw uploadError;
    }

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },

  async uploadMaterialAttachment(
    file: File,
    client?: SupabaseClient,
  ): Promise<{ url: string; size: number; name: string; type: string }> {
    const supabaseClient = client || supabase;
    // Макс 20MB для вложений
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`Файл ${file.name} превышает лимит 20MB`);
    }

    const bucket = "materials";
    const ext = file.name.split(".").pop() || "";
    // Уникальное имя: attachments/timestamp-random.ext
    const fileName = `attachments/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${ext ? "." + ext : ""}`;

    const { error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Ошибка при загрузке вложения:", uploadError);
      throw uploadError;
    }

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(fileName);

    return {
      url: data.publicUrl,
      size: file.size,
      name: file.name, // Сохраняем оригинальное имя
      type: file.type,
    };
  },
};
