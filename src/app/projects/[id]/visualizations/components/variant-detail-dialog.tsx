"use client";

import { VisualizationVariant } from "@/types/visualizations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface VariantDetailDialogProps {
  variant: VisualizationVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (variant: VisualizationVariant) => void;
  isApproving?: boolean;
}

export function VariantDetailDialog({
  variant,
  open,
  onOpenChange,
  onApprove,
  isApproving = false,
}: VariantDetailDialogProps) {
  if (!variant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden bg-white sm:rounded-[20px] border-none shadow-2xl h-[90vh] flex flex-col">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Side */}
          <div className="w-full md:w-2/3 bg-gray-100 overflow-y-auto relative min-h-[300px] md:min-h-full">
            <div className="absolute inset-0">
              <img
                src={variant.image_url}
                alt={variant.title}
                className="w-full h-auto min-h-full object-contain"
              />
            </div>
          </div>

          {/* Info Side */}
          <div className="w-full md:w-1/3 flex flex-col bg-white h-full max-h-[50vh] md:max-h-full overflow-hidden">
            <div className="p-6 md:p-8 grow overflow-y-auto">
              <DialogHeader className="mb-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-2xl font-bold leading-tight">
                    {variant.title}
                  </DialogTitle>
                </div>
                {variant.approved && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    Вариант утвержден
                  </div>
                )}
              </DialogHeader>

              {variant.description && (
                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-semibold text-black uppercase tracking-wider">
                    Описание
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {variant.description}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider">
                  Файл
                </h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-xs font-bold">FILE</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {variant.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(variant.file_size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <a
                    href={variant.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-gray-100 bg-white">
              {!variant.approved ? (
                <Button
                  className="w-full rounded-full bg-black hover:bg-zinc-800 text-white font-medium py-6 text-base"
                  onClick={() => onApprove(variant)}
                  disabled={isApproving}
                >
                  {isApproving ? "Утверждение..." : "Утвердить этот вариант"}
                </Button>
              ) : (
                <Button className="w-full rounded-full bg-gray-100 text-green-600 font-medium py-6 text-base cursor-default hover:bg-gray-100">
                  Вариант утвержден
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
