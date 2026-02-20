"use client";

import { useState } from "react";
import { Room } from "@/types";
import { VisualizationVariant } from "@/types/visualizations";
import { VariantCard } from "./variant-card";
import { UploadVariantCard } from "./upload-variant-card";
import { VariantDetailDialog } from "./variant-detail-dialog";
import { CancelApprovalDialog } from "./cancel-approval-dialog";
import { visualizationVariantsService } from "@/lib/services/visualization-variants";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { syncVisualizationsStatusAction } from "@/lib/actions/concept-sync";

interface RoomSectionProps {
  room: Room;
  variants: VisualizationVariant[];
  projectId: string;
}

export function RoomSection({
  room,
  variants: initialVariants,
  projectId,
}: RoomSectionProps) {
  const [variants, setVariants] =
    useState<VisualizationVariant[]>(initialVariants);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] =
    useState<VisualizationVariant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const approvedVariant = variants.find((v) => v.approved);

  const handleView = (variant: VisualizationVariant) => {
    setSelectedVariant(variant);
    setIsDetailOpen(true);
  };

  const handleFilesSelected = async (fileList: FileList) => {
    try {
      setIsUploading(true);
      const files = Array.from(fileList);
      const uploadedImages = [];

      for (const file of files) {
        const { fullUrl } = await visualizationVariantsService.uploadFile(
          file,
          `${projectId}/${room.id}/visualizations`,
          supabase,
        );
        uploadedImages.push({
          id: crypto.randomUUID(),
          url: fullUrl,
          name: file.name,
          size: file.size,
        });
      }

      const newVariant =
        await visualizationVariantsService.createVisualizationVariant(
          {
            project_id: projectId,
            room_id: room.id,
            title: `Вариант ${variants.length + 1}`,
            description: "",
            images: uploadedImages,
          },
          supabase,
        );

      setVariants([...variants, newVariant]);
      router.refresh();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApprove = async (variant: VisualizationVariant) => {
    try {
      setIsApproving(true);
      await visualizationVariantsService.approveVisualizationVariant(
        variant.id,
        room.id,
        supabase,
      );

      setVariants(
        variants.map((v) => ({
          ...v,
          approved: v.id === variant.id,
          approved_at: v.id === variant.id ? new Date().toISOString() : null,
        })),
      );

      if (selectedVariant?.id === variant.id) {
        setSelectedVariant({
          ...selectedVariant,
          approved: true,
          approved_at: new Date().toISOString(),
        });
      }

      // Sync stage status
      await syncVisualizationsStatusAction(projectId);

      router.refresh();
    } catch (error) {
      console.error("Error approving variant:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelApproval = async () => {
    try {
      setIsCanceling(true);
      await visualizationVariantsService.cancelApproval(room.id, supabase);

      setVariants(
        variants.map((v) => ({
          ...v,
          approved: false,
          approved_at: null,
        })),
      );

      if (selectedVariant) {
        setSelectedVariant({
          ...selectedVariant,
          approved: false,
          approved_at: null,
        });
      }

      // Sync stage status
      await syncVisualizationsStatusAction(projectId);

      setIsCancelDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error canceling approval:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      {/* Room Header — Collapsible */}
      <button
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
          {room.area > 0 && (
            <span className="text-sm text-gray-400">{room.area} м²</span>
          )}
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {variants.length} {variants.length === 1 ? "вариант" : "вариантов"}
          </span>
          {approvedVariant && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Утверждено
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
          {/* Status Alert */}
          {approvedVariant ? (
            <Alert className="bg-green-50 border-green-200 text-green-900 rounded-2xl p-4 flex gap-3">
              <div className="size-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-4 text-green-600" />
              </div>
              <div>
                <AlertTitle className="text-green-800 font-bold text-sm mb-0.5">
                  Визуализация утверждена
                </AlertTitle>
                <AlertDescription className="text-green-700 text-sm">
                  Утвержден вариант &quot;{approvedVariant.title}&quot;.
                </AlertDescription>
              </div>
            </Alert>
          ) : variants.length > 0 ? (
            <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-4 flex gap-3">
              <div className="size-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="size-4 text-amber-600" />
              </div>
              <div>
                <AlertTitle className="text-amber-800 font-bold text-sm mb-0.5">
                  Требуется согласование
                </AlertTitle>
                <AlertDescription className="text-amber-700 text-sm">
                  Выберите один из предложенных вариантов визуализации.
                </AlertDescription>
              </div>
            </Alert>
          ) : null}

          {/* Variants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UploadVariantCard
              onFilesSelected={handleFilesSelected}
              isLoading={isUploading}
            />
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                onView={handleView}
                onApprove={handleApprove}
                onCancelApproval={() => setIsCancelDialogOpen(true)}
                isApproving={isApproving}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <VariantDetailDialog
        variant={selectedVariant}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onApprove={handleApprove}
        isApproving={isApproving}
        onUpdateVariant={async (updated) => {
          setVariants(variants.map((v) => (v.id === updated.id ? updated : v)));
          setSelectedVariant(updated);
          await syncVisualizationsStatusAction(projectId);
        }}
        onDeleteVariant={async (id) => {
          setVariants(variants.filter((v) => v.id !== id));
          setIsDetailOpen(false);
          setSelectedVariant(null);
          await syncVisualizationsStatusAction(projectId);
        }}
      />

      <CancelApprovalDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleCancelApproval}
        isCanceling={isCanceling}
        roomName={room.name}
      />
    </div>
  );
}
