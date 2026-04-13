import { Upload } from "lucide-react";
import React, { RefObject } from "react";

interface FileDropzoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}: FileDropzoneProps) {
  return (
    <div
      className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
      onClick={handleBoxClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-2 bg-muted rounded-full p-3">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Загрузите изображение
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        или,{" "}
        <label
          htmlFor="fileUpload"
          className="text-primary hover:text-primary/90 font-medium cursor-pointer"
          onClick={(e) => e.stopPropagation()} // Prevent triggering handleBoxClick
        >
          нажмите для просмотра
        </label>{" "}
        (4MB max)
      </p>
      <input
        type="file"
        id="fileUpload"
        ref={fileInputRef}
        max={4000000}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}
