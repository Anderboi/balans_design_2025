// app/materials/components/materials-page-client.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Grid, List } from "lucide-react";
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
import { MaterialCard } from "@/app/materials/components/material-card";
import { AddMaterialDialog } from "@/app/materials/components/add-material-dialog";
import { Material, MaterialType } from "@/types";
import { getMaterials } from "../actions";
import { toast } from "sonner";
import PageContainer from "@/components/ui/page-container";

interface MaterialsPageClientProps {
  initialMaterials: Material[];
  initialCategories: string[];
}

export function MaterialsPageClient({
  initialMaterials,
  initialCategories,
}: MaterialsPageClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [filteredMaterials, setFilteredMaterials] =
    useState<Material[]>(initialMaterials);
  const [categories] = useState<string[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MaterialType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchQuery, selectedType, selectedCategory]);

  const loadMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
      toast.error("Не удалось загрузить материалы");
    }
  };

  const filterMaterials = () => {
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
    // if (selectedCategory !== 'all') {
    //   filtered = filtered.filter(material => material.category === selectedCategory);
    // }

    setFilteredMaterials(filtered);
  };

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Библиотека материалов</h1>
          <p className="text-muted-foreground mt-1">
            Управление материалами для ваших проектов
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить материал
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск материалов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
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
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
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
              <Plus className="w-4 h-4 mr-2" />
              Добавить первый материал
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
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
