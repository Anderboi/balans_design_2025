import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, RefreshCcw, ArrowUp, ArrowDown } from "lucide-react";
import { SortField, GroupField, SortConfig } from "./materials-toolbar";

export const filterSchema = z.object({
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  types: z.array(z.string()),
  suppliers: z.array(z.string()),
});

export type FilterValues = z.infer<typeof filterSchema>;

interface FilterMaterialDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: FilterValues;
  onApply: (values: FilterValues) => void;
  availableTypes: string[];
  availableSuppliers: string[];
  counts?: {
    types: Record<string, number>;
    suppliers: Record<string, number>;
  };
  groupBy: GroupField;
  onGroupByChange: (value: GroupField) => void;
  sortConfig: SortConfig;
  onSortChange: (field: SortField) => void;
}

const FilterMaterialDrawer = ({
  open,
  onOpenChange,
  defaultValues,
  onApply,
  availableTypes,
  availableSuppliers,
  counts,
  groupBy,
  onGroupByChange,
  sortConfig,
  onSortChange,
}: FilterMaterialDrawerProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  const handleReset = () => {
    reset(defaultValues);
  };

  // Reset form when opening with new default values
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: FilterValues) => {
    onApply(data);
    onOpenChange(false);
  };

  const selectedTypes = watch("types") || [];
  const selectedSuppliers = watch("suppliers") || [];

  const toggleType = (type: string) => {
    const current = selectedTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("types", updated, { shouldDirty: true });
  };

  const toggleSupplier = (supplier: string) => {
    const current = selectedSuppliers;
    const updated = current.includes(supplier)
      ? current.filter((s) => s !== supplier)
      : [...current, supplier];
    setValue("suppliers", updated, { shouldDirty: true });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="right-0 left-auto h-screen rounded-l-2xl rounded-r-none">
        <DrawerHeader>
          <DrawerTitle>Фильтры</DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full overflow-hidden"
        >
          <ScrollArea className="flex-1 px-4 overflow-auto">
            <div className="space-y-8 pb-6 pt-4">
              {/* === MOBILE ONLY: Группировка и Сортировка === */}
              <div className="sm:hidden space-y-8 pb-4">
                {/* Группировка */}
                <section>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    Группировка
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Нет", value: null },
                      { label: "Производитель", value: "manufacturer" },
                      { label: "Тип", value: "type" },
                      { label: "Поставщик", value: "supplier" },
                    ].map((option) => {
                      const isActive = groupBy === option.value;
                      return (
                        <button
                          type="button"
                          key={option.value || "none"}
                          onClick={() =>
                            onGroupByChange(option.value as GroupField)
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                            isActive
                              ? "bg-black text-white border-black"
                              : "bg-white text-zinc-600 border-zinc-200",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Сортировка */}
                <section>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    Сортировка
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "По умолчанию", value: null },
                      { label: "Название", value: "name" },
                      { label: "Цена", value: "price" },
                      { label: "Производитель", value: "manufacturer" },
                      { label: "Тип", value: "type" },
                    ].map((option) => {
                      const isActive = sortConfig.field === option.value;
                      return (
                        <button
                          type="button"
                          key={option.value || "none"}
                          onClick={() => onSortChange(option.value as SortField)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                            isActive
                              ? "bg-zinc-100 text-black border-zinc-300"
                              : "bg-white text-zinc-600 border-zinc-200",
                          )}
                        >
                          {option.label}
                          {isActive && sortConfig.direction === "asc" && (
                            <ArrowUp className="size-4 text-zinc-500" />
                          )}
                          {isActive && sortConfig.direction === "desc" && (
                            <ArrowDown className="size-4 text-zinc-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
                <div className="h-px bg-zinc-200 w-full my-4" />
              </div>

              {/* Price Range */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                  Цена (₽)
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="От"
                      {...register("priceMin")}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div className="w-2 h-px bg-zinc-300"></div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="До"
                      {...register("priceMax")}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>
              </section>

              {/* Types */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                  Тип изделия
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {availableTypes.map((type) => {
                    const isChecked = selectedTypes.includes(type);
                    const count = counts?.types[type] ?? 0;

                    return (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group hover:bg-zinc-50 p-2 rounded-lg -mx-2 transition-colors"
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-black border-black text-white"
                              : "bg-white border-zinc-300 text-transparent group-hover:border-zinc-400",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleType(type);
                          }}
                        >
                          <Check className="size-3" />
                        </div>
                        <span className="text-sm text-zinc-700 flex-1">
                          {type}
                        </span>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Suppliers */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
                  Производитель
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {availableSuppliers.map((supplier) => {
                    const isChecked = selectedSuppliers.includes(supplier);
                    const count = counts?.suppliers[supplier] ?? 0;

                    return (
                      <label
                        key={supplier}
                        className="flex items-center gap-3 cursor-pointer group hover:bg-zinc-50 p-2 rounded-lg -mx-2 transition-colors"
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-black border-black text-white"
                              : "bg-white border-zinc-300 text-transparent group-hover:border-zinc-400",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSupplier(supplier);
                          }}
                        >
                          <Check className="size-3" />
                        </div>
                        <span className="text-sm text-zinc-700 flex-1">
                          {supplier}
                        </span>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <div className="flex gap-2">
              <Button type="reset" size="icon" variant="outline" onClick={handleReset}>
                <RefreshCcw size={16} />
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                Показать результаты
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterMaterialDrawer;
