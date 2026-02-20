"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  X,
  Info,
  CheckCircle2,
  ImageIcon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SharedVariantImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface SharedVariant {
  id: string;
  project_id: string;
  room_id: string;
  title: string;
  description?: string | null;
  approved?: boolean;
  created_at: string;
  images: any[]; // Avoid complex deep type matching from usage, keep it loose for UI component
}

export interface SharedVariantDetailDialogProps<
  T extends SharedVariant = SharedVariant,
> {
  variant: T | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (variant: T) => void;
  isApproving?: boolean;
  titleLabel?: string;

  // Actions
  onUploadFiles: (
    files: File[],
  ) => Promise<{ url: string; name: string; size: number }[]>;
  onUpdateVariantInfo: (id: string, updates: any) => Promise<T>;
  onDeleteImage: (
    variantId: string,
    imageId: string,
    currentImages: SharedVariantImage[],
  ) => Promise<T>;
  onDeleteVariantRecord: (
    variantId: string,
    images: SharedVariantImage[],
  ) => Promise<void>;

  // Dispatch
  onVariantUpdated: (updated: T) => void;
  onVariantDeleted: (id: string) => void;
}

export function SharedVariantDetailDialog<T extends SharedVariant>({
  variant,
  open,
  onOpenChange,
  onApprove,
  isApproving = false,
  titleLabel = "Детали варианта",
  onUploadFiles,
  onUpdateVariantInfo,
  onDeleteImage,
  onDeleteVariantRecord,
  onVariantUpdated,
  onVariantDeleted,
}: SharedVariantDetailDialogProps<T>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetZoom();
  }, [currentImageIndex, isFullScreen, resetZoom]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = variant?.images || [];
  const currentImage = images[currentImageIndex];

  const handlePrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!isFullScreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullScreen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen, handlePrev, handleNext, resetZoom]);

  if (!variant) return null;

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      const newImages = [...images];

      const uploadedFiles = await onUploadFiles(files);
      for (const file of uploadedFiles) {
        newImages.push({
          id: crypto.randomUUID(),
          url: file.url,
          name: file.name,
          size: file.size,
        });
      }

      const updatedVariant = await onUpdateVariantInfo(variant.id, {
        images: newImages,
      });
      onVariantUpdated(updatedVariant);
    } catch (error) {
      console.error("Error adding images:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (images.length <= 1) {
      if (confirm("Это последнее изображение. Удалить весь вариант?")) {
        handleDeleteVariant();
      }
      return;
    }

    try {
      setIsDeleting(true);
      const updatedVariant = await onDeleteImage(variant.id, imageId, images);

      // Adjust index if we deleted the current image
      if (currentImageIndex >= updatedVariant.images.length) {
        setCurrentImageIndex(Math.max(0, updatedVariant.images.length - 1));
      }

      onVariantUpdated(updatedVariant);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!confirm("Вы уверены, что хотите удалить весь вариант?")) return;
    try {
      setIsDeleting(true);
      await onDeleteVariantRecord(variant.id, images);
      onVariantDeleted(variant.id);
    } catch (error) {
      console.error("Error deleting variant:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveImage = async (
    index: number,
    direction: "left" | "right",
  ) => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[newIndex];
    newImages[newIndex] = temp;

    try {
      setIsSavingOrder(true);
      const updatedVariant = await onUpdateVariantInfo(variant.id, {
        images: newImages,
      });
      onVariantUpdated(updatedVariant);
      setCurrentImageIndex(newIndex);
    } catch (error) {
      console.error("Error moving image:", error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      const updatedVariant = await onUpdateVariantInfo(variant.id, {
        title: editedTitle,
        description: editedDesc,
      });
      onVariantUpdated(updatedVariant);
      setIsEditingMetadata(false);
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  };

  const toggleEdit = () => {
    if (!isEditingMetadata) {
      setEditedTitle(variant.title);
      setEditedDesc(variant.description || "");
      setShowInfoPanel(true);
    }
    setIsEditingMetadata(!isEditingMetadata);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[80vw] w-[1400px] p-0 gap-0 overflow-hidden bg-[#111] sm:rounded-3xl border-none shadow-2xl h-[92vh] flex flex-col transition-all duration-300">
        {/* Hidden accessible header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{variant.title}</DialogTitle>
        </DialogHeader>

        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#111] border-b border-white/5 shrink-0 z-20">
          {/* Left: Title + Approved badge */}
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate max-w-[280px]">
              {variant.title}
            </h2>
            {variant.approved && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 className="size-3" />
                Утверждено
              </span>
            )}
          </div>

          {/* Center: Image counter */}
          <div className="flex items-center gap-1 text-xs text-white/40 font-medium absolute left-1/2 -translate-x-1/2">
            <ImageIcon className="size-3.5" />
            <span className="text-white/70">
              {images.length > 0 ? currentImageIndex + 1 : 0}
            </span>
            <span>/</span>
            <span>{images.length}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title="Добавить изображения"
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
            </button>

            {currentImage && (
              <a
                href={currentImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                title="Скачать"
              >
                <Download className="size-4" />
              </a>
            )}

            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={cn(
                "size-8 rounded-lg flex items-center justify-center transition-all",
                showInfoPanel
                  ? "text-white bg-white/15"
                  : "text-white/50 hover:text-white hover:bg-white/10",
              )}
              title="Информация"
            >
              <Info className="size-4" />
            </button>

            <button
              onClick={() => setIsFullScreen(true)}
              className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title="Во весь экран"
            >
              <Maximize2 className="size-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                  <MoreVertical className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-xl p-1.5 border-gray-800 bg-[#1a1a1a] shadow-2xl min-w-[180px]"
              >
                <DropdownMenuItem
                  onClick={toggleEdit}
                  className="rounded-lg flex items-center gap-2.5 py-2.5 px-3 text-white/80 hover:text-white focus:text-white focus:bg-white/10 text-sm cursor-pointer"
                >
                  <Pencil className="size-3.5" />
                  {isEditingMetadata
                    ? "Отменить редактирование"
                    : "Редактировать"}
                </DropdownMenuItem>
                {currentImage && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteImage(currentImage.id)}
                    disabled={isDeleting}
                    className="rounded-lg flex items-center gap-2.5 py-2.5 px-3 text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 text-sm cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Удалить фото
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleDeleteVariant}
                  className="rounded-lg flex items-center gap-2.5 py-2.5 px-3 text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 text-sm cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Удалить весь вариант
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Image Viewer */}
          <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] min-w-0">
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={variant.title}
                className="max-w-full max-h-full object-contain p-4 select-none"
                draggable={false}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/20">
                <ImageIcon className="size-12" />
                <span className="text-sm font-medium">Нет изображений</span>
              </div>
            )}

            {/* Left / Right Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all group border border-white/5"
                >
                  <ChevronLeft className="size-5 text-white/70 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all group border border-white/5"
                >
                  <ChevronRight className="size-5 text-white/70 group-hover:text-white transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Info Side Panel (slide in/out) */}
          <div
            className={cn(
              "bg-[#161616] border-l border-white/5 transition-all duration-300 ease-in-out overflow-hidden shrink-0",
              showInfoPanel ? "w-[320px] opacity-100" : "w-0 opacity-0",
            )}
          >
            <div className="w-[320px] h-full flex flex-col">
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                {/* Title & Description Section */}
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {titleLabel}
                  </div>
                  {isEditingMetadata ? (
                    <div className="space-y-3">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm rounded-xl focus:border-white/20 placeholder:text-white/20"
                        placeholder="Название"
                      />
                      <Textarea
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm rounded-xl min-h-[100px] resize-none focus:border-white/20 placeholder:text-white/20"
                        placeholder="Описание варианта..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveMetadata}
                          className="flex-1 rounded-xl bg-white text-black hover:bg-white/90 text-sm h-9 font-medium"
                        >
                          Сохранить
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={toggleEdit}
                          className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm h-9"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-white leading-snug">
                        {variant.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed">
                        {variant.description || "Нет описания"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Current Image Info */}
                {currentImage && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Текущее фото
                    </div>
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-2">
                      <p className="text-xs font-medium text-white/80 truncate">
                        {currentImage.name}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {(currentImage.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Variant Info */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Информация
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/30">Фотографий</span>
                      <span className="text-white/70 font-medium">
                        {images.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/30">Статус</span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          variant.approved
                            ? "text-emerald-400"
                            : "text-amber-400",
                        )}
                      >
                        {variant.approved ? "Утверждён" : "Ожидает"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/30">Создан</span>
                      <span className="text-white/70 font-medium">
                        {new Date(variant.created_at).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approve Button in side panel */}
              <div className="p-5 border-t border-white/5 shrink-0">
                {!variant.approved ? (
                  <Button
                    className="w-full rounded-xl bg-white hover:bg-white/90 text-black font-semibold h-11 text-sm shadow-lg shadow-white/5 active:scale-[0.98] transition-all"
                    onClick={() => onApprove(variant)}
                    disabled={isApproving}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Утверждение...
                      </>
                    ) : (
                      "Утвердить вариант"
                    )}
                  </Button>
                ) : (
                  <div className="w-full rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold h-11 flex items-center justify-center text-sm border border-emerald-500/20 gap-2">
                    <CheckCircle2 className="size-4" />
                    Вариант утверждён
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Thumbnails Strip */}
        {images.length > 0 && (
          <div className="h-[84px] bg-[#111] border-t border-white/5 flex items-center px-4 gap-3 overflow-x-auto shrink-0 no-scrollbar">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group/thumb shrink-0">
                <button
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "relative w-[60px] h-[60px] rounded-xl overflow-hidden border-2 transition-all duration-200",
                    currentImageIndex === idx
                      ? "border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : "border-transparent opacity-40 hover:opacity-100 hover:border-white/20",
                  )}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt={`Фото ${idx + 1}`}
                  />
                  {/* Index indicator */}
                  <div className="absolute top-1 left-1 size-4 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white/70 border border-white/10">
                    {idx + 1}
                  </div>
                </button>

                {isEditingMetadata && (
                  <div className="absolute -top-2 -left-2 -right-2 flex justify-between items-center opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10 pointer-events-none">
                    <button
                      disabled={idx === 0 || isSavingOrder}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(idx, "left");
                      }}
                      className="size-6 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-0 pointer-events-auto"
                      title="Переместить влево"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      disabled={idx === images.length - 1 || isSavingOrder}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(idx, "right");
                      }}
                      className="size-6 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-0 pointer-events-auto"
                      title="Переместить вправо"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                )}

                {isEditingMetadata && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.id);
                    }}
                    className="absolute -bottom-1 -right-1 size-5 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 hover:scale-110 active:scale-95 transition-all z-10"
                    title="Удалить фото"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-[60px] h-[60px] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 hover:border-white/25 hover:text-white/40 hover:bg-white/5 transition-all shrink-0"
              title="Добавить фото"
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-5" />
              )}
            </button>
          </div>
        )}

        {/* Bottom Approve Bar (visible when info panel is closed) */}
        {!showInfoPanel && !variant.approved && (
          <div className="px-5 py-3.5 bg-[#111] border-t border-white/5 shrink-0 flex items-center justify-between">
            <div className="text-sm text-white/40">
              {variant.description ? (
                <span className="line-clamp-1 max-w-[400px]">
                  {variant.description}
                </span>
              ) : (
                <span>Нажмите ⓘ для деталей</span>
              )}
            </div>
            <Button
              className="rounded-xl bg-white hover:bg-white/90 text-black font-semibold h-10 px-6 text-sm shadow-lg shadow-white/5 active:scale-[0.98] transition-all"
              onClick={() => onApprove(variant)}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Утверждение...
                </>
              ) : (
                "Утвердить вариант"
              )}
            </Button>
          </div>
        )}

        {!showInfoPanel && variant.approved && (
          <div className="px-5 py-3.5 bg-[#111] border-t border-white/5 shrink-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="size-4" />
              Вариант утверждён
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleAddImages}
        />

        {/* Fullscreen Overlay */}
        {isFullScreen && currentImage && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-white/90">
                  {variant.title} — {currentImageIndex + 1} / {images.length}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 mr-2">
                  <button
                    onClick={() =>
                      setZoom((prev) => Math.max(0.5, prev - 0.25))
                    }
                    className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Уменьшить"
                  >
                    <ZoomOut className="size-4" />
                  </button>
                  <span className="text-[10px] font-medium text-white/40 w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((prev) => Math.min(5, prev + 0.25))}
                    className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Увеличить"
                  >
                    <ZoomIn className="size-4" />
                  </button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button
                    onClick={resetZoom}
                    className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Сбросить"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsFullScreen(false)}
                  className="size-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  title="Выйти из полноэкранного режима"
                >
                  <Minimize2 className="size-5" />
                </button>
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="size-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Fullscreen Image Container */}
            <div
              className={cn(
                "flex-1 relative flex items-center justify-center overflow-hidden p-4 md:p-8",
                zoom > 1 ? "cursor-grab" : "cursor-default",
                isDraggingImage && "cursor-grabbing",
              )}
              onWheel={(e) => {
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom((prev) => Math.min(5, Math.max(0.5, prev + delta)));
              }}
              onMouseDown={(e) => {
                if (zoom <= 1) return;
                setIsDraggingImage(true);
                setDragStart({
                  x: e.clientX - position.x,
                  y: e.clientY - position.y,
                });
              }}
              onMouseMove={(e) => {
                if (!isDraggingImage) return;
                setPosition({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y,
                });
              }}
              onMouseUp={() => setIsDraggingImage(false)}
              onMouseLeave={() => setIsDraggingImage(false)}
            >
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDraggingImage
                    ? "none"
                    : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
                }}
                className="flex items-center justify-center select-none"
              >
                <img
                  src={currentImage.url}
                  alt={variant.title}
                  className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center transition-all group border border-white/10"
                  >
                    <ChevronLeft className="size-6 text-white/70 group-hover:text-white transition-colors" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center transition-all group border border-white/10"
                  >
                    <ChevronRight className="size-6 text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
