"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/types";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";
import {
  Loader2,
  UploadCloud,
  Plus as PlusIcon,
  File as FileIcon,
  ImageIcon,
  Trash2,
} from "lucide-react";

interface TaskAttachmentsProps {
  task: Task;
}

export function TaskAttachments({ task }: TaskAttachmentsProps) {
  const [attachments, setAttachments] = useState<
    import("@/types").TaskAttachment[]
  >(task.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAttachments(task.attachments || []);
  }, [task.attachments]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      await uploadFiles(droppedFiles);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      await uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    try {
      for (const file of filesToUpload) {
        const newAttachment = await tasksService.uploadAttachment(
          task.id,
          file
        );
        setAttachments((prev) => [...prev, newAttachment]);
      }
      toast.success(
        filesToUpload.length === 1 ? "Файл загружен" : "Файлы загружены"
      );
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Ошибка при загрузке файлов");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = async (attachmentId: string, fileUrl: string) => {
    try {
      await tasksService.deleteAttachment(attachmentId, fileUrl);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      toast.success("Вложение удалено");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Ошибка при удалении вложения");
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">Вложения</h3>
      <div
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative overflow-hidden ${
          isDragging
            ? "border-blue-500 bg-blue-50/50"
            : isUploading
            ? "border-zinc-200 bg-zinc-50 cursor-wait"
            : "border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={isUploading ? undefined : () => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
          disabled={isUploading}
        />

        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDragging
              ? "bg-blue-100 text-blue-600 shadow-sm scale-110"
              : "bg-zinc-100 text-zinc-400 group-hover:bg-white group-hover:shadow-sm"
          }`}
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin text-zinc-400" />
          ) : isDragging ? (
            <UploadCloud size={20} />
          ) : (
            <PlusIcon size={20} />
          )}
        </div>
        <span
          className={`text-xs transition-colors ${
            isDragging ? "text-blue-600 font-medium" : "text-zinc-400"
          }`}
        >
          {isUploading
            ? "Загрузка..."
            : isDragging
            ? "Отпустите файлы для загрузки"
            : "Нажмите или перетащите файлы"}
        </span>

        {(isDragging || isUploading) && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              isDragging ? "bg-blue-500/5 backdrop-blur-[1px]" : "bg-white/10"
            }`}
          />
        )}
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group flex items-center gap-3 p-2 rounded-lg border border-zinc-100 bg-white hover:border-zinc-200 shadow-sm transition-all"
            >
              <a
                href={attachment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-3 min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100 text-zinc-400">
                  {attachment.file_type?.startsWith("image/") ? (
                    <ImageIcon size={14} />
                  ) : (
                    <FileIcon size={14} />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-medium text-zinc-700 truncate">
                    {attachment.file_name}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {attachment.file_size
                      ? (attachment.file_size / 1024).toFixed(1)
                      : "?"}{" "}
                    KB
                  </div>
                </div>
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAttachment(attachment.id, attachment.file_url);
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
