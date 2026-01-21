import { useRef } from "react";
import { Control, useController } from "react-hook-form";
import { AddMaterialFormValues } from "@/lib/schemas/materials";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileIcon, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { useFileUpload } from "@/app/materials/hooks/use-file-upload";
import { cn } from "@/lib/utils";

interface MaterialFilesSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function MaterialFilesSection({ control }: MaterialFilesSectionProps) {
  const { field } = useController({
    control,
    name: "attachments",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { files, isUploading, uploadFiles, removeFile } = useFileUpload(
    field.value || [],
    (newFiles) => {
      field.onChange(newFiles);
    },
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    // Сброс input, чтобы можно было выбрать тот же файл повторно
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Форматирование размера файла
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer",
          isUploading
            ? "bg-zinc-50 border-zinc-200"
            : "hover:bg-zinc-50 border-zinc-200 hover:border-zinc-300",
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8 text-zinc-400" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-900">
              {isUploading ? "Загрузка..." : "Нажмите или перетащите файлы"}
            </p>
            <p className="text-xs text-zinc-500">
              PDF, изображения, документы (до 20MB)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <FileIcon className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  Скачать
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
