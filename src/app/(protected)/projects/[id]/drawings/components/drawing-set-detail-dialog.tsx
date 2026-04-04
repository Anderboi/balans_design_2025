"use client";

import { DrawingFile } from "@/types/drawings";
import { SharedVariantDetailDialog } from "@/app/(protected)/projects/components/shared-variant-detail-dialog";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DrawingSetDetailDialogProps {
  drawingSet: DrawingFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateDrawingSet?: (updated: DrawingFile) => void;
  onDeleteDrawingSet?: (id: string) => void;
}

export function DrawingSetDetailDialog({
  drawingSet,
  open,
  onOpenChange,
  onUpdateDrawingSet,
  onDeleteDrawingSet,
}: DrawingSetDetailDialogProps) {
  const supabase = createClient();
  const router = useRouter();

  if (!drawingSet) return null;

  // Build images array from the drawing set
  const images =
    Array.isArray(drawingSet.images) && drawingSet.images.length > 0
      ? (drawingSet.images as any[])
      : [
          // Primary preview image
          ...(drawingSet.image_url
            ? [
                {
                  id: `${drawingSet.id}-img`,
                  url: drawingSet.image_url,
                  name: "Превью",
                  size: 0,
                  downloadUrl: drawingSet.image_url,
                  type: "image/jpeg",
                },
              ]
            : []),
          // Primary file (usually PDF/DWG)
          ...(drawingSet.file_url
            ? [
                {
                  id: `${drawingSet.id}-file`,
                  url: drawingSet.file_url,
                  name: drawingSet.file_name || "Чертёж",
                  size: drawingSet.file_size || 0,
                  downloadUrl: drawingSet.file_url,
                  type: drawingSet.file_name?.toLowerCase().endsWith(".pdf")
                    ? "application/pdf"
                    : undefined,
                },
              ]
            : []),
        ];

  const sharedVariant = {
    ...drawingSet,
    room_id: "",
    approved: false,
    images: images,
  };

  return (
    <SharedVariantDetailDialog
      variant={sharedVariant}
      open={open}
      onOpenChange={onOpenChange}
      onApprove={() => {}}
      isApproving={false}
      titleLabel="Детали чертежа"
      hideImageActions={false}
      onUploadFiles={async (files) => {
        const uploaded = [];
        for (const file of files) {
          const { fullUrl } = await drawingSetsService.uploadFile(
            file,
            `${drawingSet.project_id}/drawings`,
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
        const updatedSet = await drawingSetsService.updateDrawingSet(
          id,
          updates,
          supabase,
        );

        if (onUpdateDrawingSet) {
          onUpdateDrawingSet(updatedSet);
        }

        router.refresh();
        return {
          ...sharedVariant,
          ...updates,
        };
      }}
      onDeleteImage={async (setId, imageId, currentImages) => {
        const newImages = currentImages.filter((img) => img.id !== imageId);
        const updatedSet = await drawingSetsService.updateDrawingSet(
          setId,
          { images: newImages },
          supabase,
        );

        if (onUpdateDrawingSet) {
          onUpdateDrawingSet(updatedSet);
        }

        router.refresh();
        return {
          ...sharedVariant,
          images: newImages,
        };
      }}
      onDeleteVariantRecord={async (id) => {
        await drawingSetsService.deleteDrawingSet(
          id,
          drawingSet.file_url || "",
          supabase,
        );
        if (onDeleteDrawingSet) {
          onDeleteDrawingSet(id);
        }
        onOpenChange(false);
        router.refresh();
      }}
      onVariantUpdated={(updated) => {
        if (onUpdateDrawingSet) {
          onUpdateDrawingSet(updated as DrawingFile);
        }
      }}
      onVariantDeleted={(id) => {
        if (onDeleteDrawingSet) {
          onDeleteDrawingSet(id);
        }
      }}
    />
  );
}
