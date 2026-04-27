"use client";

import { PlanningVariant } from "@/types/planning";
import { SharedVariantDetailDialog } from "@/features/projects/components/shared-variant-detail-dialog";
import { planningVariantsService } from "@/lib/services/planning-variants";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PlanningVariantDetailDialogProps {
  variant: PlanningVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (variant: PlanningVariant) => void;
  isApproving?: boolean;
  onUpdateVariant?: (updated: PlanningVariant) => void;
  onDeleteVariant?: (id: string) => void;
}

export function PlanningVariantDetailDialog({
  variant,
  open,
  onOpenChange,
  onApprove,
  isApproving = false,
  onUpdateVariant,
  onDeleteVariant,
}: PlanningVariantDetailDialogProps) {
  const supabase = createClient();
  const router = useRouter();

  if (!variant) return null;

  // Use the images array from the variant, or fallback to the legacy structure
  const images =
    variant.images && variant.images.length > 0
      ? variant.images
      : [
          // Primary preview image
          ...(variant.image_url
            ? [
                {
                  id: `${variant.id}-img`,
                  url: variant.image_url,
                  name: "Превью",
                  size: 0,
                  downloadUrl: variant.image_url,
                  type: "image/jpeg",
                },
              ]
            : []),
          // Primary file (usually PDF)
          ...(variant.file_url
            ? [
                {
                  id: `${variant.id}-file`,
                  url: variant.file_url, // For PDFs, this will show the PDF icon in our viewer
                  name: variant.file_name || "Документ",
                  size: variant.file_size || 0,
                  downloadUrl: variant.file_url,
                  type: variant.file_name?.toLowerCase().endsWith(".pdf")
                    ? "application/pdf"
                    : undefined,
                },
              ]
            : []),
        ];

  const sharedVariant = {
    ...variant,
    room_id: "", // Not used for planning variations
    images: images,
  };

  return (
    <SharedVariantDetailDialog
      variant={sharedVariant}
      open={open}
      onOpenChange={onOpenChange}
      onApprove={() => onApprove(variant)}
      isApproving={isApproving}
      titleLabel="Детали планировки"
      hideImageActions={false}
      onUploadFiles={async (files) => {
        const uploaded = [];
        for (const file of files) {
          const { fullUrl } = await planningVariantsService.uploadFile(
            file,
            `${variant.project_id}/planning`,
            supabase,
          );
          uploaded.push({
            url: fullUrl,
            name: file.name,
            size: file.size,
            downloadUrl: fullUrl,
            type: file.type,
          });
        }
        return uploaded;
      }}
      onUpdateVariantInfo={async (id, updates) => {
        const updatedVariant =
          await planningVariantsService.updatePlanningVariant(
            id,
            updates,
            supabase,
          );

        if (onUpdateVariant) {
          onUpdateVariant(updatedVariant);
        }

        router.refresh();
        return {
          ...sharedVariant,
          ...updates,
        };
      }}
      onDeleteImage={async (variantId, imageId, currentImages) => {
        const newImages = currentImages.filter((img) => img.id !== imageId);
        const updatedVariant =
          await planningVariantsService.updatePlanningVariant(
            variantId,
            { images: newImages },
            supabase,
          );

        if (onUpdateVariant) {
          onUpdateVariant(updatedVariant);
        }

        router.refresh();
        return {
          ...sharedVariant,
          images: newImages,
        };
      }}
      onDeleteVariantRecord={async (id) => {
        await planningVariantsService.deletePlanningVariant(
          id,
          variant.file_url,
          supabase,
        );
        if (onDeleteVariant) {
          onDeleteVariant(id);
        }
        onOpenChange(false);
        router.refresh();
      }}
      onVariantUpdated={(updated) => {
        if (onUpdateVariant) {
          onUpdateVariant(updated as PlanningVariant);
        }
      }}
      onVariantDeleted={(id) => {
        if (onDeleteVariant) {
          onDeleteVariant(id);
        }
      }}
    />
  );
}
