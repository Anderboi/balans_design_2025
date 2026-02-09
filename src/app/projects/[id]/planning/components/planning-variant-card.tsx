"use client";

import { PlanningVariant } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanningVariantCardProps {
  variant: PlanningVariant;
  onView: (variant: PlanningVariant) => void;
  onApprove: (variant: PlanningVariant) => void;
  onCancelApproval?: (variant: PlanningVariant) => void;
  isApproving?: boolean;
}

export function PlanningVariantCard({
  variant,
  onView,
  onApprove,
  onCancelApproval,
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
    <div
      className={cn(
        "bg-white rounded-[20px] overflow-hidden border transition-all duration-300 flex flex-col h-full",
        variant.approved
          ? "border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,1)]"
          : "border-gray-100 shadow-sm hover:shadow-md",
      )}
    >
      {/* Image Preview */}
      <div
        className="relative aspect-4/3 bg-gray-100 cursor-pointer overflow-hidden group"
        onClick={() => onView(variant)}
      >
        <img
          src={variant.image_url}
          alt={variant.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {variant.approved && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Утверждено
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {variant.title}
        </h3>

        {variant.description && (
          <p className="text-sm text-gray-500 mb-6 line-clamp-3 grow">
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
            <Button
              variant="ghost"
              className="w-full rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-600 border-red-100 font-medium py-6 transition-colors border hover:border-red-200 cursor-pointer"
              onClick={() => onCancelApproval?.(variant)}
            >
              <Lock className="size-4 mr-2" />
              Отменить согласование
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
