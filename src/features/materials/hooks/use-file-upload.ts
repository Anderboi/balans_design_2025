import { useState } from "react";
import { storageService } from "@/lib/services/storage";
import { MaterialAttachment } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useFileUpload(
  initialFiles: MaterialAttachment[] = [],
  onChange?: (files: MaterialAttachment[]) => void,
) {
  const [files, setFiles] = useState<MaterialAttachment[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  // Обновление состояния и вызов колбэка
  const updateFiles = (newFiles: MaterialAttachment[]) => {
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const uploadFiles = async (fileList: FileList | File[]) => {
    setIsUploading(true);
    const newAttachments: MaterialAttachment[] = [];
    const errors: string[] = [];

    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      try {
        const result = await storageService.uploadMaterialAttachment(file);

        const attachment: MaterialAttachment = {
          id: uuidv4(),
          name: result.name,
          url: result.url,
          size: result.size,
          type: result.type,
          created_at: new Date().toISOString(),
        };

        newAttachments.push(attachment);
      } catch (error) {
        console.error(`Ошибка при загрузке ${file.name}:`, error);
        errors.push(file.name);
      }
    }

    if (newAttachments.length > 0) {
      updateFiles([...files, ...newAttachments]);
      toast.success(`Загружено файлов: ${newAttachments.length}`);
    }

    if (errors.length > 0) {
      toast.error(`Не удалось загрузить: ${errors.join(", ")}`);
    }

    setIsUploading(false);
  };

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((f) => f.id !== fileId);
    updateFiles(newFiles);
  };

  return {
    files,
    isUploading,
    uploadFiles,
    removeFile,
    setFiles: updateFiles,
  };
}
