import { RefObject } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/dropzone";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function ImageUploadSection({
  imagePreview,
  onImageSelect,
  onImageRemove,
  fileInputRef,
}: ImageUploadSectionProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    onImageSelect(file);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    onImageSelect(file);
  };

  return (
    <div className="space-y-3">
      <Label>Обложка (изображение)</Label>
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Предпросмотр"
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onImageRemove}
          >
            Удалить изображение
          </Button>
        </div>
      ) : (
        <FileDropzone
          fileInputRef={fileInputRef}
          handleBoxClick={() => fileInputRef.current?.click()}
          handleDragOver={(e) => e.preventDefault()}
          handleDrop={handleDrop}
          handleFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
}
