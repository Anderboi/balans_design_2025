import { supabase } from '@/lib/supabase';

// Загрузка изображения материала в Supabase Storage и возврат публичного URL
export const storageService = {
  async uploadMaterialImage(file: File): Promise<string> {
    // Валидация размера (макс ~4MB)
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('Файл превышает максимальный размер 4MB');
    }

    const bucket = 'materials';
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error('Ошибка при загрузке файла в Storage:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },
};