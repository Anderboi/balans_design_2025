"use client";

import { useState, useMemo } from "react";
import {
  ImageIcon,
  FileText,
  ExternalLink,
  Download,
  Layers,
  Package,
  Palette,
  ChevronRight,
  ChevronDown,
  FileBadge,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisualizationVariant } from "@/types/visualizations";
import { CollageVariant } from "@/types/collages";
import { DrawingFile, DRAWING_CATEGORIES } from "@/types/drawings";
import { SpecificationMaterial } from "@/types";
import { SharedVariantDetailDialog } from "../../components/shared-variant-detail-dialog";
import { PdfViewerDialog } from "../drawings/components/pdf-viewer-dialog";
import { cn } from "@/lib/utils";

interface EnrichedVisualizationVariant extends VisualizationVariant {
  room_name?: string | null;
}

interface EnrichedCollageVariant extends CollageVariant {
  room_name?: string | null;
}

interface MediaTabProps {
  projectId: string;
  visualizations: EnrichedVisualizationVariant[];
  collages: EnrichedCollageVariant[];
  drawings: DrawingFile[];
  equipmentSpecs: SpecificationMaterial[];
}

export default function MediaTab({
  visualizations,
  collages,
  drawings,
  equipmentSpecs,
}: MediaTabProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingFile | null>(
    null,
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    general: true, // Expand general by default
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupedDrawings = useMemo(() => {
    const groups: Record<string, DrawingFile[]> = {};
    drawings.forEach((drawing) => {
      if (!groups[drawing.category]) {
        groups[drawing.category] = [];
      }
      groups[drawing.category].push(drawing);
    });
    return groups;
  }, [drawings]);

  const activeCategories = useMemo(() => {
    return DRAWING_CATEGORIES.filter(
      (cat) => groupedDrawings[cat.value]?.length > 0,
    );
  }, [groupedDrawings]);

  const sections = [
    {
      id: "visualizations",
      title: "3D Визуализации",
      icon: ImageIcon,
      items: visualizations.map((v) => ({ ...v, mediaType: "visualization" })),
      type: "grid",
    },
    {
      id: "collages",
      title: "Коллажи / Мудборды",
      icon: Palette,
      items: collages.map((c) => ({ ...c, mediaType: "collage" })),
      type: "grid",
    },
    {
      id: "drawings",
      title: "Рабочие чертежи",
      icon: Layers,
      items: drawings,
      type: "categorized-list",
    },
    {
      id: "equipment",
      title: "Технические спецификации",
      icon: Package,
      items: equipmentSpecs,
      type: "list-spec",
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {sections.map((section) => {
        if (section.items.length === 0) return null;

        return (
          <section key={section.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <Badge variant="secondary" className="rounded-full px-2.5">
                {section.items.length}
              </Badge>
            </div>

            {section.type === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.items.map((item: any) => (
                  <Card
                    key={item.id}
                    className="group cursor-pointer overflow-hidden border-zinc-100 hover:border-purple-200 transition-all hover:shadow-xl hover:shadow-purple-500/5"
                    onClick={() => setSelectedVariant(item)}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100">
                      <Image
                        src={
                          item.images?.[0]?.url ||
                          item.image_url ||
                          "/placeholder-image.png"
                        }
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end">
                        {item.room_name && (
                          <Badge className="bg-purple-600 text-white border-none shadow-sm">
                            {item.room_name}
                          </Badge>
                        )}
                        <Badge className="bg-white/90 backdrop-blur text-black border-none ring-1 ring-black/5">
                          {item.mediaType === "visualization" ? "3D" : "Mood"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {item.description || "Без описания"}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {section.type === "categorized-list" && (
              <div className="space-y-4">
                {activeCategories.map((category) => (
                  <div
                    key={category.value}
                    className="border border-zinc-100 rounded-2xl overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      onClick={() => toggleCategory(category.value)}
                      className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                          <FileBadge className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-sm">
                            {category.label}
                          </h3>
                          <p className="text-xs text-zinc-500">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                          {groupedDrawings[category.value]?.length}
                        </span>
                        {expandedCategories[category.value] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {expandedCategories[category.value] && (
                      <div className="px-5 pb-5 divide-y divide-zinc-100">
                        {groupedDrawings[category.value].map((drawing) => (
                          <div
                            key={drawing.id}
                            className="flex items-center py-4 gap-4 group hover:bg-zinc-50/50 rounded-xl px-2 transition-colors -mx-2 cursor-pointer"
                            onClick={() => setSelectedDrawing(drawing)}
                          >
                            <div className="size-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                              <FileText className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {drawing.title}
                              </h4>
                              <p className="text-xs text-zinc-500 truncate">
                                {drawing.file_name} •{" "}
                                {(drawing.file_size / (1024 * 1024)).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full border-zinc-200 text-xs gap-2"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Скачать
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === "list-spec" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item: any) => (
                  <Card
                    key={item.id}
                    className="flex items-center p-4 gap-4 border-zinc-100 hover:border-purple-200 transition-all hover:shadow-lg"
                  >
                    <div className="size-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 relative flex items-center justify-center border border-zinc-100">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-zinc-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">
                        {item.manufacturer || "Без производителя"} •{" "}
                        {item.article || "Артикул не указан"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-full text-zinc-400 hover:text-purple-600 hover:bg-purple-50"
                      >
                        <a
                          href={item.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <SharedVariantDetailDialog
        variant={selectedVariant}
        open={!!selectedVariant}
        onOpenChange={(open) => !open && setSelectedVariant(null)}
        onApprove={() => {}}
        isApproving={false}
        titleLabel={
          selectedVariant?.mediaType === "visualization"
            ? "3D Визуализация"
            : "Коллаж / Мудборд"
        }
        hideImageActions={true}
      />

      {selectedDrawing && (
        <PdfViewerDialog
          drawing={selectedDrawing}
          open={!!selectedDrawing}
          onOpenChange={(open) => !open && setSelectedDrawing(null)}
        />
      )}
    </div>
  );
}
