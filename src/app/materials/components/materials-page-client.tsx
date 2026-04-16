"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaterialsToolbar, SortField, GroupField } from "./materials-toolbar";
import { MaterialCard } from "@/app/materials/components/card/material-card";
import { AddMaterialDialog } from "@/app/materials/components/add-material-dialog";
import FilterMaterialDrawer, { FilterValues } from "./filter-material-drawer";
import TypeFilterChips from "@/components/type-filter-chips";
import { Material, Project, Contact, Company } from "@/types";
import { getMaterials } from "../actions";
import { toast } from "sonner";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";

interface MaterialsPageClientProps {
  initialMaterials: Material[];
  // initialCategories: string[];
  initialProjects: Project[];
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
  isGuest?: boolean;
}

export function MaterialsPageClient({
  initialMaterials,
  initialProjects,
  initialSuppliers,
  initialSupplierCompanies,
  isGuest = false,
}: MaterialsPageClientProps) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [projects] = useState<Project[]>(initialProjects);
  const [suppliers] = useState<Contact[]>(initialSuppliers);
  const [supplierCompanies] = useState<Company[]>(initialSupplierCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: "asc" | "desc";
  }>({
    field: null,
    direction: "asc",
  });

  const [groupBy, setGroupBy] = useState<GroupField>(null);

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

    // Сортировка
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        let aValue: string | number | undefined | null = "";
        let bValue: string | number | undefined | null = "";

        switch (sortConfig.field) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "description":
            aValue = a.description;
            bValue = b.description;
            break;
          case "price":
            aValue = a.price;
            bValue = b.price;
            break;
          case "manufacturer":
            aValue = a.manufacturer;
            bValue = b.manufacturer;
            break;
          case "type":
            aValue = a.type;
            bValue = b.type;
            break;
        }

        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : (aValue as number) - (bValue as number);

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [materials, searchQuery, activeFilters, sortConfig]);

  const groupedMaterials = useMemo(() => {
    if (!groupBy) return { "Все материалы": filteredMaterials };

    const groups: Record<string, Material[]> = {};

    filteredMaterials.forEach((material) => {
      let key = "Не указано";
      const value = material[groupBy];

      if (typeof value === "string" && value) {
        key = value;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(material);
    });

    return groups;
  }, [filteredMaterials, groupBy]);

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedMaterials).sort((a, b) => {
      if (a === "Не указано") return 1;
      if (b === "Не указано") return -1;
      return a.localeCompare(b);
    });
  }, [groupedMaterials]);

  const handleSort = (field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

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

      <div className="flex items-end justify-between">
        <PageHeader
          title="Библиотека"
          description="Каталог материалов, оборудования и мебели."
        />
        {!isGuest && (
          <>
            <Button
              size="lg"
              className="max-sm:size-12"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="size-5" />
              <span className="hidden sm:inline">Добавить материал</span>
            </Button>
          </>
        )}
      </div>

      {/* Фильтры и поиск */}
      <MaterialsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onFilterClick={() => setIsFilterDrawerOpen(true)}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        sortConfig={sortConfig}
        onSortChange={handleSort}
      />
 
      {/* Быстрые фильтры по типу (Chips) */}
        <TypeFilterChips
          value={activeFilters.types}
          types={availableTypes}
          onChange={(t) => {
            if (t === "all") {
              setActiveFilters((prev) => ({ ...prev, types: [] }));
            } else {
              setActiveFilters((prev) => {
                const currentTypes = prev.types || [];
                const isSelected = currentTypes.includes(t);
                return {
                  ...prev,
                  types: isSelected
                    ? currentTypes.filter((type) => type !== t)
                    : [...currentTypes, t],
                };
              });
            }
          }}
        />

      {/* Статистика */}
      <div className="flex gap-4  mb-2 sm:mb-6">
        <Badge variant="secondary">Всего материалов: {materials.length}</Badge>
        <Badge variant="outline">Найдено: {filteredMaterials.length}</Badge>
      </div>

      {/* Список материалов */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {materials.length === 0 ? "Нет материалов" : "Материалы не найдены"}
          </div>
          {materials.length === 0 && !isGuest && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Добавить первый материал
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroupKeys.map((groupKey) => (
            <div key={groupKey} className="space-y-4">
              {groupBy && (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-900">
                    {groupKey}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="text-zinc-500 bg-zinc-100"
                  >
                    {groupedMaterials[groupKey].length}
                  </Badge>
                </div>
              )}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-4"
                    : "space-y-2"
                }
              >
                {groupedMaterials[groupKey].map((material) => (
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
            </div>
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
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        sortConfig={sortConfig}
        onSortChange={handleSort}
      />
    </PageContainer>
  );
}
