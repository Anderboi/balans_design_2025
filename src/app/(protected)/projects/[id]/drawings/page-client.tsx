"use client";

import { useState } from "react";
import {
  DrawingFile,
  DrawingCategory,
  DRAWING_CATEGORIES,
} from "@/types/drawings";
import PageContainer from "@/components/ui/page-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SlashIcon, Plus, FileText } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DrawingCategorySection } from './components/drawing-category-section';
import { UploadDrawingDialog } from './components/upload-drawing-dialog';
import { PdfViewerDialog } from './components/pdf-viewer-dialog';

interface DrawingsPageClientProps {
  initialDrawings: DrawingFile[];
  projectId: string;
  projectName: string;
}

export default function DrawingsPageClient({
  initialDrawings,
  projectId,
  projectName,
}: DrawingsPageClientProps) {
  const [drawings, setDrawings] = useState<DrawingFile[]>(initialDrawings);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewerDrawing, setViewerDrawing] = useState<DrawingFile | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    // Auto-expand categories that have drawings
    const categoriesWithFiles = Array.from(
      new Set(initialDrawings.map((d) => d.category)),
    );
    return categoriesWithFiles;
  });

  // Group drawings by category
  const drawingsByCategory: Record<string, DrawingFile[]> = {};
  for (const d of drawings) {
    if (!drawingsByCategory[d.category]) {
      drawingsByCategory[d.category] = [];
    }
    drawingsByCategory[d.category].push(d);
  }

  // Categories that have files
  const categoriesWithFiles = DRAWING_CATEGORIES.filter(
    (cat) => drawingsByCategory[cat.value]?.length > 0,
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleDelete = (id: string) => {
    setDrawings((prev) => prev.filter((d) => d.id !== id));
  };

  const totalFiles = drawings.length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${projectId}`}>{projectName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Чертежи
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <PageHeader title="Рабочая документация" />
            <p className="text-sm text-zinc-500 mt-1">
              {totalFiles > 0
                ? `${totalFiles} ${totalFiles === 1 ? "документ" : totalFiles < 5 ? "документа" : "документов"} в ${categoriesWithFiles.length} ${categoriesWithFiles.length === 1 ? "разделе" : "разделах"}`
                : "Загрузите чертежи и документацию для проекта"}
            </p>
          </div>

          <Button
            onClick={() => setIsUploadOpen(true)}
            className="rounded-full bg-black hover:bg-zinc-800 text-white px-6 h-11 gap-2 shadow-sm"
          >
            <Plus className="size-4" />
            Загрузить PDF
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-3">
        {categoriesWithFiles.length > 0 ? (
          categoriesWithFiles.map((cat) => (
            <DrawingCategorySection
              key={cat.value}
              category={cat}
              drawings={drawingsByCategory[cat.value] || []}
              isExpanded={expandedCategories.includes(cat.value)}
              onToggle={() => toggleCategory(cat.value)}
              onViewPdf={(drawing:any) => setViewerDrawing(drawing)}
              onDelete={handleDelete}
              projectId={projectId}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-5">
              <FileText className="size-7 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              Нет загруженных чертежей
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mb-6">
              Загружайте PDF-файлы рабочей документации — демонтажные и
              монтажные планы, схемы электрики, сантехники и другие чертежи.
            </p>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="rounded-full bg-black hover:bg-zinc-800 text-white px-6 h-11 gap-2"
            >
              <Plus className="size-4" />
              Загрузить первый чертёж
            </Button>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <UploadDrawingDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        projectId={projectId}
      />

      {/* PDF Viewer Dialog */}
      {viewerDrawing && (
        <PdfViewerDialog
          drawing={viewerDrawing}
          open={!!viewerDrawing}
          onOpenChange={(open:any) => {
            if (!open) setViewerDrawing(null);
          }}
        />
      )}
    </PageContainer>
  );
}
