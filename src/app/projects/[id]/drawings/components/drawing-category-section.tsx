"use client";

import { DrawingFile, DrawingCategoryConfig } from "@/types/drawings";
import { DrawingListItem } from "./drawing-list-item";
import { ChevronDown, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawingCategorySectionProps {
  category: DrawingCategoryConfig;
  drawings: DrawingFile[];
  isExpanded: boolean;
  onToggle: () => void;
  onViewPdf: (drawing: DrawingFile) => void;
  onDelete: (id: string) => void;
  projectId: string;
}

export function DrawingCategorySection({
  category,
  drawings,
  isExpanded,
  onToggle,
  onViewPdf,
  onDelete,
  projectId,
}: DrawingCategorySectionProps) {
  const totalSize = drawings.reduce((sum, d) => sum + (d.file_size || 0), 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-xs transition-all">
      {/* Section Header — clickable accordion trigger */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50/80",
          isExpanded && "border-b border-zinc-100",
        )}
      >
        <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
          <FolderOpen className="size-5 text-zinc-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-zinc-900 text-[15px]">
              {category.label}
            </h3>
            <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full">
              {drawings.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 truncate">
            {category.description}
            {totalSize > 0 && ` · ${totalSizeMB} MB`}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "size-5 text-zinc-400 transition-transform duration-200 shrink-0",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Expandable file list */}
      {isExpanded && (
        <div className="divide-y divide-zinc-50 animate-in slide-in-from-top-1 duration-150">
          {drawings.map((drawing, index) => (
            <DrawingListItem
              key={drawing.id}
              drawing={drawing}
              index={index + 1}
              onView={() => onViewPdf(drawing)}
              onDelete={() => onDelete(drawing.id)}
              projectId={projectId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
