import { RefObject } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/dropzone";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface ImageUploadSectionProps {
  control: Control<AddMaterialFormValues>;
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function ImageUploadSection({
  control,
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
    <FormField
      control={control}
      name="image_url"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>Обложка (изображение)</FormLabel>
          <FormControl>
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
