"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  List,
  LayoutGrid,
  Funnel,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MaterialCard } from "@/app/materials/components/card/material-card";
import { AddMaterialDialog } from "@/app/materials/components/add-material-dialog";
import FilterMaterialDrawer, { FilterValues } from "./filter-material-drawer";
import { Material, Project, Contact, Company } from "@/types";
import { getMaterials } from "../actions";
import { toast } from "sonner";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

interface MaterialsPageClientProps {
  initialMaterials: Material[];
  initialCategories: string[];
  initialProjects: Project[];
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
}

export function MaterialsPageClient({
  initialMaterials,
  initialCategories,
  initialProjects,
  initialSuppliers,
  initialSupplierCompanies,
}: MaterialsPageClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [categories] = useState<string[]>(initialCategories);
  const [projects] = useState<Project[]>(initialProjects);
  const [suppliers] = useState<Contact[]>(initialSuppliers);
  const [supplierCompanies] = useState<Company[]>(initialSupplierCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    priceMin: "",
    priceMax: "",
    types: [],
    suppliers: [],
  });

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
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by active filters
    // 1. Price
    if (activeFilters.priceMin) {
      const min = parseFloat(activeFilters.priceMin);
      if (!isNaN(min)) {
        filtered = filtered.filter((m) => (m.price || 0) >= min);
      }
    }
    if (activeFilters.priceMax) {
      const max = parseFloat(activeFilters.priceMax);
      if (!isNaN(max)) {
        filtered = filtered.filter((m) => (m.price || 0) <= max);
      }
    }

    // 2. Types
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(
        (m) => m.type && activeFilters.types.includes(m.type),
      );
    }

    // 3. Suppliers (mapped to manufacturer for now based on UI label "Производитель")
    if (activeFilters.suppliers.length > 0) {
      filtered = filtered.filter(
        (m) =>
          m.manufacturer && activeFilters.suppliers.includes(m.manufacturer),
      );
    }

    return filtered;
  }, [materials, searchQuery, activeFilters]);

  // Derive available options and counts from *all* materials (or filtered? usually all for options)
  const { availableTypes, availableSuppliers, filterCounts } = useMemo(() => {
    const types = new Set<string>();
    const suppliers = new Set<string>();
    const typeCounts: Record<string, number> = {};
    const supplierCounts: Record<string, number> = {};

    materials.forEach((m) => {
      if (m.type) {
        types.add(m.type);
        typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
      }
      if (m.manufacturer) {
        suppliers.add(m.manufacturer);
        supplierCounts[m.manufacturer] =
          (supplierCounts[m.manufacturer] || 0) + 1;
      }
    });

    return {
      availableTypes: Array.from(types).sort(),
      availableSuppliers: Array.from(suppliers).sort(),
      filterCounts: {
        types: typeCounts,
        suppliers: supplierCounts,
      },
    };
  }, [materials]);

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
                "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
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
                "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
              )}
            >
              <List className="size-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block" />

          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            <Funnel className="size-4" />
            Фильтры
            {(activeFilters.types.length > 0 ||
              activeFilters.suppliers.length > 0 ||
              activeFilters.priceMin ||
              activeFilters.priceMax) && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 min-w-5">
                {[
                  activeFilters.types.length,
                  activeFilters.suppliers.length,
                  activeFilters.priceMin || activeFilters.priceMax ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
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
              initialSuppliers={suppliers}
              initialSupplierCompanies={supplierCompanies}
            />
          ))}
        </div>
      )}

      <AddMaterialDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onMaterialAdded={handleMaterialAdded}
        initialSuppliers={suppliers}
        initialSupplierCompanies={supplierCompanies}
      />

      <FilterMaterialDrawer
        open={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        defaultValues={activeFilters}
        onApply={setActiveFilters}
        availableTypes={availableTypes}
        availableSuppliers={availableSuppliers}
        counts={filterCounts}
      />
    </PageContainer>
  );
}
