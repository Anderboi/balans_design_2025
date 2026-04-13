import { useState, useRef } from "react";

export function useImageUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return {
    fileInputRef,
    imageFile,
    imagePreview,
    handleImageSelect,
    handleImageRemove,
    resetImage,
  };
}
