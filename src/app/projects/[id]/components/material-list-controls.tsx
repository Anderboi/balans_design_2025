"use client";

import { useMemo, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { SpecificationMaterial, MaterialType } from "@/types";
import SpecMaterialCard from "../specifications/components/spec-material-card";

// Импорты компонентов shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SortAsc, SortDesc, ChevronRight, ChevronDown } from "lucide-react"; // Иконки для сортировки
import { Badge } from "@/components/ui/badge";

// Получаем значения Enum для фильтра
const materialTypes = Object.values(MaterialType);

interface Props {
  materials: SpecificationMaterial[];
}

// Типизация для нашей формы
type FilterFormValues = {
  searchTerm: string;
  filterType: string;
  sortOrder: "asc" | "desc";
};

export default function MaterialListControls({ materials }: Props) {
  // 1. Инициализируем react-hook-form
  const form = useForm<FilterFormValues>({
    defaultValues: {
      searchTerm: "",
      filterType: "all",
      sortOrder: "asc",
    },
  });

  // State для управления свернутыми категориями (храним названия типов, которые СВЕРНУТЫ)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (type: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // 2. Используем watch для отслеживания изменений "вживую"
  const searchTerm = form.watch("searchTerm");
  const filterType = form.watch("filterType");
  const sortOrder = form.watch("sortOrder");

  // 3. useMemo остается таким же, но теперь зависит от RHF state
  const { groupedMaterials, totalCount, totalSum } = useMemo(() => {
    let processedMaterials = [...materials];

    // Фильтрация по типу
    if (filterType !== "all") {
      processedMaterials = processedMaterials.filter(
        (m) => m.type === filterType,
      );
    }

    // Фильтрация по поиску
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      processedMaterials = processedMaterials.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(lowerSearch) ||
          (m.project_article || "").toLowerCase().includes(lowerSearch),
      );
    }

    // Сортировка (по имени)
    processedMaterials.sort((a, b) => {
      const aVal = a.name || "";
      const bVal = b.name || "";

      const comparison = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? comparison : comparison * -1;
    });

    // Расчет итогов
    const count = processedMaterials.length;
    const sum = processedMaterials.reduce((acc, m) => {
      const price = Number(m.price) || 0;
      const q = Number(m.quantity) || 0;
      return acc + price * q;
    }, 0);

    // Группировка по типу материала
    const groups: Record<MaterialType, SpecificationMaterial[]> = {} as Record<
      MaterialType,
      SpecificationMaterial[]
    >;
    processedMaterials.forEach((material) => {
      if (!groups[material.type]) {
        groups[material.type] = [];
      }
      groups[material.type].push(material);
    });

    return { groupedMaterials: groups, totalCount: count, totalSum: sum };
  }, [materials, searchTerm, filterType, sortOrder]);

  // Функция для переключения сортировки
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    form.setValue("sortOrder", newOrder);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasMaterials = Object.values(groupedMaterials).some(
    (group) => group.length > 0,
  );

  return (
    <div className="flex flex-col gap-4 relative pb-20">
      {/* --- Панель управления--- */}
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 /p-4 //bg-muted/40 rounded-lg //border">
          {/* Поиск */}
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Поиск</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Поиск по названию или марке..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Фильтр */}
          <FormField
            control={form.control}
            name="filterType"
            render={({ field }) => (
              <FormItem className="w-full col-span-1 ">
                <FormLabel>Фильтр по типу</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full text-xs">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Сортировка */}
          <FormItem className="col-span-1 w-full">
            <FormLabel>Сортировка</FormLabel>
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="w-full justify-between text-xs text-ellipsis overflow-hidden"
            >
              <span>
                {sortOrder === "asc"
                  ? "По возрастанию (А-Я)"
                  : "По убыванию (Я-А)"}
              </span>
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </FormItem>
        </div>
      </Form>

      {/* --- Список материалов--- */}
      <div className="flex flex-col gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          {hasMaterials ? (
            Object.entries(groupedMaterials).map(([type, materialsInGroup]) => {
              const categorySum = materialsInGroup.reduce((acc, m) => {
                const price = Number(m.price) || 0;
                const q = Number(m.quantity) || 0;
                return acc + price * q;
              }, 0);

              const isCollapsed = collapsedCategories.has(type);

              return (
                materialsInGroup.length > 0 && (
                  <div key={type} className="flex flex-col gap-2">
                    <div 
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                      onClick={() => toggleCategory(type)}
                    >
                      <div className="flex items-center gap-2">
                         {isCollapsed ? (
                           <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground" />
                         ) : (
                           <ChevronDown className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground" />
                         )}
                        <h2 className="text-[11px] text-muted-foreground/50 font-bold uppercase tracking-widest whitespace-nowrap group-hover:text-muted-foreground/70 transition-colors">
                          {type}
                        </h2>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-bold text-muted-foreground/50 bg-muted/40 border border-muted-foreground/10 px-2 py-0.5 min-w-[22px] text-center"
                      >
                        {materialsInGroup.length}
                      </Badge>
                      <div className="h-[0.5px] bg-muted-foreground/10 grow mt-px" />
                      <span className="text-[12px] font-semibold text-muted-foreground/70 tabular-nums">
                        {formatPrice(categorySum)}{" "}
                        <span className="text-[10px]">₽</span>
                      </span>
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {materialsInGroup.map((material, index) => (
                          <SpecMaterialCard
                            key={material.id || index}
                            material={material}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              Материалы не найдены.
            </p>
          )}
        </Suspense>
      </div>

      {/* Sticky Footer Summary */}
      <div className="sticky bottom-0 left-0 right-0 z-10 bg-white/40 backdrop-blur-md border-t border-muted/30 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-500 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
              Всего позиций
            </span>
            <span className="text-lg font-semibold text-[#1D1D1F]">
              {totalCount}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
              Общая сумма бюджета
            </span>
            <span className="text-xl font-bold text-[#1D1D1F]">
              {formatPrice(totalSum)}{" "}
              <span className="text-sm font-semibold">₽</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
