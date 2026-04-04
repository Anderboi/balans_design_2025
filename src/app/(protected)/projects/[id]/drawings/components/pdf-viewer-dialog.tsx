"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DrawingFile, DrawingAnnotation } from "@/types/drawings";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewerDialog({
  drawing,
  open,
  onOpenChange,
}: {
  drawing: DrawingFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [annotations, setAnnotations] = useState<DrawingAnnotation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPos, setNewPos] = useState<{ x: number; y: number } | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (open && drawing.id) loadAnnotations();
  }, [open, drawing.id]);
  async function loadAnnotations() {
    try {
      const data = await drawingSetsService.getAnnotations(
        drawing.id,
        supabase,
      );
      setAnnotations(data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSave = async () => {
    if (!newPos || !content.trim()) return;
    try {
      setIsSaving(true);
      const ann = await drawingSetsService.createAnnotation(
        {
          drawing_id: drawing.id,
          page_number: pageNumber,
          x_percent: newPos.x,
          y_percent: newPos.y,
          content,
          resolved: false,
          color: "#EF4444",
        },
        supabase,
      );
      setAnnotations([...annotations, ann]);
      setIsAdding(false);
      setNewPos(null);
      setContent("");
      toast.success("Комментарий добавлен");
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[95vw] lg:max-w-[80vw] w-[1400px] h-[90vh] p-0 flex flex-col gap-0 border-none bg-zinc-950 overflow-hidden",
          isFullscreen && "fixed inset-0 max-w-none w-screen h-screen z-9999",
        )}
      >
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0 h-14 z-10">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Plus className="size-4 text-red-500" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-zinc-100 text-sm font-medium truncate max-w-[200px]">
                {drawing.title}
              </DialogTitle>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-400"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-[10px] text-zinc-400 min-w-[50px] text-center">
              {pageNumber} / {numPages || "-"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-400"
              onClick={() =>
                setPageNumber((p) => Math.min(numPages || p, p + 1))
              }
              disabled={pageNumber >= (numPages || 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-zinc-400"
                onClick={() => setScale((s) => Math.max(0.4, s - 0.1))}
              >
                <ZoomOut className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-zinc-400"
                onClick={() => setScale((s) => Math.min(3, s + 0.1))}
              >
                <ZoomIn className="size-4" />
              </Button>
            </div>
            <Button
              variant={isAdding ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 gap-2 rounded-lg text-xs",
                isAdding && "bg-red-600",
              )}
              onClick={() => setIsAdding(!isAdding)}
            >
              <MessageSquare className="size-4" />
              {isAdding ? "Отмена" : "Заметка"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-400"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div
          className="flex-1 flex sm:flex-row flex-col overflow-hidden bg-zinc-950"
          ref={containerRef}
        >
          <ScrollArea className="flex-1 overflow-auto p-4 md:p-8">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "relative bg-white shadow-2xl overflow-hidden",
                  isAdding && "cursor-crosshair",
                )}
                onClick={(e) => {
                  if (!isAdding) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  setNewPos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }}
              >
                <Document
                  file={drawing.file_url}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <div className="p-20">
                      <Loader2 className="animate-spin text-zinc-600" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
                {annotations
                  .filter((a) => a.page_number === pageNumber)
                  .map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-40 transition-transform hover:scale-110",
                        activeId === a.id
                          ? "bg-white text-zinc-900 border-red-500 scale-125"
                          : "bg-red-500 text-white",
                      )}
                      style={{
                        left: `${a.x_percent}%`,
                        top: `${a.y_percent}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveId(activeId === a.id ? null : a.id);
                      }}
                    >
                      <MessageSquare className="size-3" />
                      {activeId === a.id && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl p-3 z-50 text-zinc-950 animate-in fade-in zoom-in-95">
                          <p className="text-xs">{a.content}</p>
                          <div className="flex justify-between mt-2 pt-2 border-t border-zinc-100">
                            <span className="text-[10px] text-zinc-400">
                              {new Date(a.created_at).toLocaleDateString()}
                            </span>
                            <button
                              className="text-[10px] text-red-600"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await drawingSetsService.deleteAnnotation(
                                  a.id,
                                  supabase,
                                );
                                setAnnotations(
                                  annotations.filter((ann) => ann.id !== a.id),
                                );
                                setActiveId(null);
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                {newPos && (
                  <div
                    className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 border-2 border-white animate-pulse z-50"
                    style={{ left: `${newPos.x}%`, top: `${newPos.y}%` }}
                  >
                    <Plus className="size-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <aside className="sm:w-80 w-full sm:h-full h-[25vh] bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-zinc-100 text-sm font-semibold">
                Комментарии
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {isAdding && (
                <div className="bg-zinc-800 rounded-xl p-3 border border-red-500/30">
                  <p className="text-[10px] text-white font-bold mb-2 uppercase">
                    Новая заметка
                  </p>
                  {newPos ? (
                    <>
                      <Textarea
                        placeholder="Текст..."
                        className="bg-zinc-900 border-zinc-700 text-xs min-h-[80px] text-white"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="h-8 flex-1 bg-white text-black text-xs"
                          onClick={handleSave}
                          disabled={isSaving || !content.trim()}
                        >
                          {isSaving ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Сохранить"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-zinc-400 text-xs"
                          onClick={() => {
                            setNewPos(null);
                            setContent("");
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[10px] text-zinc-500 italic">
                      Нажмите на чертёж для выбора места
                    </p>
                  )}
                </div>
              )}
              {annotations
                .filter((a) => a.page_number === pageNumber)
                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                .map((a) => (
                  <div
                    key={a.id}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer",
                      activeId === a.id
                        ? "bg-zinc-800 border-zinc-600"
                        : "bg-zinc-800/40 border-zinc-800/50",
                    )}
                    onClick={() => setActiveId(activeId === a.id ? null : a.id)}
                  >
                    <p className="text-[13px] text-zinc-100 leading-snug">
                      {a.content}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase">
                      {new Date(a.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
            </ScrollArea>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
