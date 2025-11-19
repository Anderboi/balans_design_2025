"use client";

import { useMemo, Suspense } from "react";
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
import { SortAsc, SortDesc } from "lucide-react"; // Иконки для сортировки

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

  // 2. Используем watch для отслеживания изменений "вживую"
  const searchTerm = form.watch("searchTerm");
  const filterType = form.watch("filterType");
  const sortOrder = form.watch("sortOrder");

  // 3. useMemo остается таким же, но теперь зависит от RHF state
  const groupedMaterials = useMemo(() => {
    let processedMaterials = [...materials];

    // Фильтрация по типу
    if (filterType !== "all") {
      processedMaterials = processedMaterials.filter(
        (m) => m.type === filterType
      );
    }

    // Фильтрация по поиску
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      processedMaterials = processedMaterials.filter(
        (m) => (m.name || "").toLowerCase().includes(lowerSearch)
      );
    }

    // Сортировка (по имени)
    processedMaterials.sort((a, b) => {
      const aVal = a.name || "";
      const bVal = b.name || "";

      const comparison = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? comparison : comparison * -1;
    });

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

    return groups;
  }, [materials, searchTerm, filterType, sortOrder]);

  // Функция для переключения сортировки
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    form.setValue("sortOrder", newOrder);
  };

  const hasMaterials = Object.values(groupedMaterials).some(
    (group) => group.length > 0
  );

  return (
    <div className="flex flex-col gap-4">
      {/* --- Панель управления (теперь с RHF и shadcn) --- */}
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
                  <Input placeholder="Поиск по названию..." {...field} />
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

      {/* --- Список материалов (остается без изменений) --- */}
      <div className="flex flex-col gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          {hasMaterials ? (
            Object.entries(groupedMaterials).map(
              ([type, materialsInGroup]) =>
                materialsInGroup.length > 0 && (
                  <div key={type} className="flex flex-col gap-2">
                    <h2 className="text-base text-muted-foreground/75 font-semibold">
                      {type}
                    </h2>
                    {materialsInGroup.map((material, index) => (
                      <SpecMaterialCard
                        key={material.id || index}
                        material={material}
                      />
                    ))}
                  </div>
                )
            )
          ) : (
            <p className="text-gray-500 text-center py-4">
              Материалы не найдены.
            </p>
          )}
        </Suspense>
      </div>
    </div>
  );
}
