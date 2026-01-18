"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  LayoutGrid,
  Funnel,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MaterialCard } from "@/app/materials/components/card/material-card";
import { AddMaterialDialog } from "@/app/materials/components/add-material-dialog";
import { Material, MaterialType, Project } from "@/types";
import { getMaterials } from "../actions";
import { toast } from "sonner";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

interface MaterialsPageClientProps {
  initialMaterials: Material[];
  initialCategories: string[];
  initialProjects: Project[];
}

export function MaterialsPageClient({
  initialMaterials,
  initialCategories,
  initialProjects,
}: MaterialsPageClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [categories] = useState<string[]>(initialCategories);
  const [projects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
      toast.error("Не удалось загрузить материалы");
    }
  };
  const filteredMaterials = useMemo(() => {
    let filtered = materials;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(
        (material) =>
          material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          material.manufacturer
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по типу
    if (selectedType !== "all") {
      filtered = filtered.filter((material) => material.type === selectedType);
    }

    // Фильтр по категории
    // if (selectedCategory !== "all") {
    //   filtered = filtered.filter(
    //     (material) => material.category === selectedCategory
    //   );
    // }

    return filtered;
  }, [materials, searchQuery, selectedType]);

  const handleMaterialAdded = () => {
    loadMaterials();
    setIsAddDialogOpen(false);
  };

  const handleMaterialUpdated = () => {
    loadMaterials();
  };

  const handleMaterialDeleted = () => {
    loadMaterials();
  };

  const materialTypes = Object.values(MaterialType);

  return (
    <PageContainer>
      {/* Заголовок */}

      <div className="flex items-end justify-between mb-6">
        <PageHeader
          title="Библиотека"
          description="Каталог материалов, оборудования и мебели."
        />
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Добавить материал
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-background p-2 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Поиск материалов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg mr-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                viewMode === "grid" && "bg-background ",
                "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600"
              )}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                viewMode === "list" && "bg-background",
                "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600"
              )}
            >
              <List className="size-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block" />

          <Button variant={"ghost"} className="cursor-pointer ">
            <Funnel className="size-4" />
            Фильтры
          </Button>

          <Button variant={"ghost"} className="cursor-pointer ">
            <SlidersHorizontal className="size-4" />
            Сортировка
          </Button>
        </div>

        {/* <Select
          value={selectedType}
          onValueChange={(value) =>
            setSelectedType(value as MaterialType | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Тип материала" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {materialTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      {/* Статистика */}
      <div className="flex gap-4 mb-6">
        <Badge variant="secondary">Всего материалов: {materials.length}</Badge>
        <Badge variant="outline">Найдено: {filteredMaterials.length}</Badge>
      </div>

      {/* Список материалов */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {materials.length === 0 ? "Нет материалов" : "Материалы не найдены"}
          </div>
          {materials.length === 0 && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Добавить первый материал
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-2"
          }
        >
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              projects={projects}
              viewMode={viewMode}
              onMaterialUpdated={handleMaterialUpdated}
              onMaterialDeleted={handleMaterialDeleted}
            />
          ))}
        </div>
      )}

      {/* Диалог добавления материала */}
      <AddMaterialDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onMaterialAdded={handleMaterialAdded}
      />
    </PageContainer>
  );
}
