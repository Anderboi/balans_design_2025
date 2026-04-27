"use client";

import { CollageVariant } from "@/types/collages";
import { SharedVariantDetailDialog } from "@/features/projects/components/shared-variant-detail-dialog";
import { collageVariantsService } from "@/lib/services/collage-variants";
import { createClient } from "@/lib/supabase/client";

interface VariantDetailDialogProps {
  variant: CollageVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (variant: CollageVariant) => void;
  isApproving?: boolean;
  onUpdateVariant: (updated: CollageVariant) => void;
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
      titleLabel="Детали коллажа"
      onUploadFiles={async (files) => {
        const uploaded = [];
        for (const file of files) {
          const { fullUrl } = await collageVariantsService.uploadFile(
            file,
            `${variant.project_id}/${variant.room_id}/collages`,
            supabase,
          );
          uploaded.push({ url: fullUrl, name: file.name, size: file.size });
        }
        return uploaded;
      }}
      onUpdateVariantInfo={async (id, updates) => {
        return await collageVariantsService.updateCollageVariant(
          id,
          updates,
          supabase,
        );
      }}
      onDeleteImage={async (variantId, imageId, currentImages) => {
        return await collageVariantsService.deleteImage(
          variantId,
          currentImages,
          imageId,
          supabase,
        );
      }}
      onDeleteVariantRecord={async (variantId, images) => {
        await collageVariantsService.deleteCollageVariant(
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
