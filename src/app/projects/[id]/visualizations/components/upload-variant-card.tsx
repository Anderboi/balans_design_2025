"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";

interface UploadVariantCardProps {
  onFilesSelected: (files: FileList) => void;
  isLoading?: boolean;
}

export function UploadVariantCard({
  onFilesSelected,
  isLoading = false,
}: UploadVariantCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <div
        className="bg-gray-50/50 rounded-[20px] border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 min-h-[400px] h-full"
        onClick={handleClick}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
          <Plus className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {isLoading ? "Загрузка..." : "Загрузить вариант"}
        </h3>
        <p className="text-sm text-gray-400 text-center">
          Выберите одно или несколько изображений
        </p>
      </div>
    </>
  );
}
