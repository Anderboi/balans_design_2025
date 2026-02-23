"use client";

import { useState } from "react";
import { DrawingFile } from "@/types/drawings";
import { FileText, Eye, Trash2, MoreHorizontal, Download } from "lucide-react";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DrawingListItemProps {
  drawing: DrawingFile;
  index: number;
  onView: () => void;
  onDelete: () => void;
  projectId: string;
}

export function DrawingListItem({
  drawing,
  index,
  onView,
  onDelete,
}: DrawingListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fileSizeMB = (drawing.file_size / (1024 * 1024)).toFixed(1);
  const formattedDate = new Date(drawing.created_at).toLocaleDateString(
    "ru-RU",
    { day: "2-digit", month: "short", year: "numeric" },
  );

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await drawingSetsService.deleteDrawingSet(
        drawing.id,
        drawing.file_url,
        supabase,
      );
      onDelete();
      toast.success("Чертёж удалён");
      router.refresh();
    } catch {
      toast.error("Не удалось удалить чертёж");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = drawing.file_url;
    a.download = drawing.file_name;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="flex items-center gap-4 px-5 py-3 group hover:bg-zinc-50/60 transition-colors">
      {/* Index */}
      <span className="text-xs font-mono text-zinc-300 w-5 text-right shrink-0">
        {String(index).padStart(2, "0")}
      </span>

      {/* File Icon */}
      <div className="size-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
        <FileText className="size-4 text-red-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
        <p className="text-sm font-medium text-zinc-800 truncate group-hover:text-black transition-colors">
          {drawing.title}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5 truncate">
          {drawing.file_name} · {fileSizeMB} MB · {formattedDate}
        </p>
      </div>

      {/* Quick View Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onView}
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-zinc-500 hover:text-black h-8 px-3 gap-1.5"
      >
        <Eye className="size-3.5" />
        <span className="text-xs">Открыть</span>
      </Button>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-zinc-400 hover:text-zinc-600 size-8"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={onView} className="gap-2">
            <Eye className="size-4" />
            Просмотреть
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Скачать PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Удаление..." : "Удалить"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
