"use client";

import { VisualizationVariant } from "@/types/visualizations";
import { SharedVariantDetailDialog } from "@/features/projects/components/shared-variant-detail-dialog";
import { visualizationVariantsService } from "@/lib/services/visualization-variants";
import { createClient } from "@/lib/supabase/client";

interface VariantDetailDialogProps {
  variant: VisualizationVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (variant: VisualizationVariant) => void;
  isApproving?: boolean;
  onUpdateVariant: (updated: VisualizationVariant) => void;
  onDeleteVariant: (id: string) => void;
}

export function VariantDetailDialog({
  variant,
  open,
  onOpenChange,
  onApprove,
  isApproving = false,
  onUpdateVariant,
  onDeleteVariant,
}: VariantDetailDialogProps) {
  const supabase = createClient();

  if (!variant) return null;

  return (
    <SharedVariantDetailDialog
      variant={variant}
      open={open}
      onOpenChange={onOpenChange}
      onApprove={onApprove}
      isApproving={isApproving}
      titleLabel="Детали варианта"
      onUploadFiles={async (files) => {
        const uploaded = [];
        for (const file of files) {
          const { fullUrl } = await visualizationVariantsService.uploadFile(
            file,
            `${variant.project_id}/${variant.room_id}/visualizations`,
            supabase,
          );
          uploaded.push({ url: fullUrl, name: file.name, size: file.size });
        }
        return uploaded;
      }}
      onUpdateVariantInfo={async (id, updates) => {
        return await visualizationVariantsService.updateVisualizationVariant(
          id,
          updates,
          supabase,
        );
      }}
      onDeleteImage={async (variantId, imageId, currentImages) => {
        return await visualizationVariantsService.deleteImage(
          variantId,
          currentImages,
          imageId,
          supabase,
        );
      }}
      onDeleteVariantRecord={async (variantId, images) => {
        await visualizationVariantsService.deleteVisualizationVariant(
          variantId,
          images,
          supabase,
        );
      }}
      onVariantUpdated={onUpdateVariant}
      onVariantDeleted={onDeleteVariant}
    />
  );
}
