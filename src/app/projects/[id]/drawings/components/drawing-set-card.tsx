"use client";

import { DrawingFile, DRAWING_CATEGORIES } from "@/types/drawings";
import { FileText, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DrawingSetCardProps {
  drawingSet: DrawingFile;
  onView: (set: DrawingFile) => void;
}

export function DrawingSetCard({ drawingSet, onView }: DrawingSetCardProps) {
  const formattedDate = new Date(drawingSet.created_at).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  const categoryLabel =
    DRAWING_CATEGORIES.find((c) => c.value === drawingSet.category)?.label ||
    "Общие чертежи";

  const totalFiles =
    (Array.isArray(drawingSet.images) ? drawingSet.images.length : 0) +
    (drawingSet.file_url ? 1 : 0);

  const fileSizeMB = drawingSet.file_size
    ? (drawingSet.file_size / (1024 * 1024)).toFixed(1)
    : null;

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer group",
      )}
      onClick={() => onView(drawingSet)}
    >
      <div className="relative aspect-4/3 bg-linear-to-br from-zinc-50 to-zinc-100 overflow-hidden flex items-center justify-center">
        {drawingSet.image_url &&
        !drawingSet.image_url.toLowerCase().endsWith(".pdf") ? (
          <img
            src={drawingSet.image_url}
            alt={drawingSet.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-300">
            <div className="size-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
              <FileText className="size-8 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-400">
              {drawingSet.file_name || "Чертёж"}
            </span>
          </div>
        )}

        {/* Category badge */}
        <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-zinc-700 border-0 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
          {categoryLabel}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {drawingSet.title}
        </h3>

        {drawingSet.description && (
          <p className="text-sm text-gray-500 mb-6 line-clamp-2 grow">
            {drawingSet.description}
          </p>
        )}

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>
                {totalFiles}{" "}
                {totalFiles === 1
                  ? "файл"
                  : totalFiles < 5
                    ? "файла"
                    : "файлов"}
                {fileSizeMB ? ` • ${fileSizeMB} MB` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
