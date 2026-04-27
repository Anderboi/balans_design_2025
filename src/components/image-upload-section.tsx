import Image from "next/image";
import { RefObject } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/dropzone";

interface ImageUploadSectionProps {
  label?: string;
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  error?: string;
}

export function ImageUploadSection({
  label = "Обложка (изображение)",
  imagePreview,
  onImageSelect,
  onImageRemove,
  fileInputRef,
  error,
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
      <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1">
        {label}
      </Label>
      <div className="relative">
        {imagePreview ? (
          <div className="relative group">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
              <Image
                src={imagePreview}
                alt="Предпросмотр"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="lg"
              className="w-full mt-2 rounded-full"
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
      {error && (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
