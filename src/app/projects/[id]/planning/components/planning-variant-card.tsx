"use client";

import { PlanningVariant } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { FileText, Calendar } from "lucide-react";

interface PlanningVariantCardProps {
  variant: PlanningVariant;
  onView: (variant: PlanningVariant) => void;
  onApprove: (variant: PlanningVariant) => void;
  isApproving?: boolean;
}

export function PlanningVariantCard({
  variant,
  onView,
  onApprove,
  isApproving = false,
}: PlanningVariantCardProps) {
  const formattedDate = new Date(variant.created_at).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  const fileSizeMB = (variant.file_size / (1024 * 1024)).toFixed(1);

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Preview */}
      <div
        className="relative aspect-[4/3] bg-gray-100 cursor-pointer overflow-hidden group"
        onClick={() => onView(variant)}
      >
        <img
          src={variant.image_url}
          alt={variant.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {variant.approved && (
          <div className="absolute top-4 right-4 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
            Утвержден
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {variant.title}
        </h3>

        {variant.description && (
          <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-grow">
            {variant.description}
          </p>
        )}

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF • {fileSizeMB} MB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{formattedDate}</span>
            </div>
          </div>

          {!variant.approved && (
            <Button
              className="w-full rounded-full bg-black hover:bg-zinc-800 text-white font-medium py-6"
              onClick={() => onApprove(variant)}
              disabled={isApproving}
            >
              {isApproving ? "Утверждение..." : "Утвердить этот вариант"}
            </Button>
          )}

          {variant.approved && (
            <Button className="w-full rounded-full bg-gray-100 text-green-600 font-medium py-6 cursor-default hover:bg-gray-100">
              Вариант утвержден
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
