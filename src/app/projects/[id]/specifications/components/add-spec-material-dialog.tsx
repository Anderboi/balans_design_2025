"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Filter, ArrowUpDown, LayoutGrid } from "lucide-react";
import { materialsService } from "@/lib/services/materials";
import { Material, Contact, Company, MaterialType } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AddMaterialDialog } from "@/app/materials/components/add-material-dialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface ComboboxOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface GenericComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: React.ReactNode;
  className?: string;
}

function GenericCombobox({
  options,
  value,
  onChange,
  placeholder = "Выбрать...",
  searchPlaceholder = "Поиск...",
  emptyMessage = "Ничего не найдено",
  icon: Icon,
  className,
}: GenericComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 bg-[#F5F5F7] border-none rounded-xl focus:ring-1 focus:ring-[#0071E3] justify-between px-3 font-normal hover:bg-[#F5F5F7]",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {Icon}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-[#86868b] opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 rounded-2xl border-none shadow-2xl overflow-hidden" align="start">
        <Command className="rounded-2xl">
          <CommandInput placeholder={searchPlaceholder} className="h-11 border-none focus:ring-0" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-sm text-[#86868b]">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="rounded-lg mx-1 py-2 aria-selected:bg-[#F5F5F7] aria-selected:text-[#0071E3] cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MaterialItemProps {
  material: Material;
  onSelect: (material: Material) => void;
  isAdding: boolean;
}

function MaterialItem({ material, onSelect, isAdding }: MaterialItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F5F7] transition-colors group cursor-pointer"
      onClick={() => onSelect(material)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-12 rounded-lg border border-[#E5E5E7] bg-white">
          <AvatarImage src={material.image_url} className="object-cover" />
          <AvatarFallback className="bg-[#F5F5F7] text-[#86868b] text-xs">
            {material.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-[#1D1D1F] leading-tight">
            {material.name}
          </span>
          <span className="text-sm text-[#86868b]">
            {material.manufacturer && `${material.manufacturer} • `}
            {material.type} • {material.article || "Нет артикула"}
          </span>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-white shadow-sm"
        disabled={isAdding}
      >
        {isAdding ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
      </Button>
    </div>
  );
}

interface AddSpecMaterialDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialAdded: () => void;
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
}

export function AddSpecMaterialDialog({
  projectId,
  open,
  onOpenChange,
  onMaterialAdded,
  initialSuppliers,
  initialSupplierCompanies,
}: AddSpecMaterialDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [showAddLibraryDialog, setShowAddLibraryDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterType, setFilterType] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<string>("manufacturer");
  const supabase = createClient();

  const loadMaterials = useCallback(
    async (query = "") => {
      setIsLoading(true);
      try {
        let data: Material[];
        if (query) {
          data = await materialsService.searchMaterials(query, supabase);
        } else {
          data = await materialsService.getMaterials(supabase);
        }
        setMaterials(data);
      } catch (error) {
        console.error("Error loading materials:", error);
        toast.error("Ошибка при загрузке материалов");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    if (open) {
      loadMaterials();
    }
  }, [open, loadMaterials]);

  const filteredAndSortedMaterials = materials
    .filter((m) => {
      if (filterType === "all") return true;
      return m.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      return 0; // default newest is already handled by DB order usually
    });

  const groupedMaterials = filteredAndSortedMaterials.reduce(
    (acc, material) => {
      let key = "None";
      if (groupBy === "manufacturer") {
        key = material.manufacturer || "Без производителя";
      } else if (groupBy === "type") {
        key = material.type || "Без типа";
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(material);
      return acc;
    },
    {} as Record<string, Material[]>,
  );

  const groupKeys = Object.keys(groupedMaterials).sort((a, b) => {
    if (a === "Без производителя" || a === "Без типа") return 1;
    if (b === "Без производителя" || b === "Без типа") return -1;
    return a.localeCompare(b);
  });


  const handleSelectMaterial = async (material: Material) => {
    setIsAdding(material.id);
    try {
      await materialsService.addSpecification(
        {
          project_id: projectId,
          material_id: material.id,
          name: material.name,
          description: material.description || "",
          manufacturer: material.manufacturer || "",
          article: material.article || "",
          type: material.type,
          supplier: material.supplier || "",
          price: material.price || 0,
          unit: material.unit || "шт",
          image_url: material.image_url || "",
          quantity: 1,
          notes: "",
          size: material.size || "",
          color: material.color || "",
          finish: material.finish || "",
          material: material.material || "",
          lead_time: material.lead_time || 0,
          product_url: material.product_url || "",
          in_stock: material.in_stock ?? true,
          tags: material.tags || [],
        },
        supabase,
      );
      toast.success("Материал добавлен в спецификацию");
      onMaterialAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding material to spec:", error);
      toast.error("Ошибка при добавлении материала");
    } finally {
      setIsAdding(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight">Добавить материал</DialogTitle>
              <DialogDescription className="text-base text-[#86868b]">
                Выберите материал из библиотеки или создайте новый
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                <Input
                  placeholder="Поиск по названию, производителю..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    loadMaterials(e.target.value);
                  }}
                  className="pl-10 h-12 bg-[#F5F5F7] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-[#0071E3] transition-all"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAddLibraryDialog(true)}
                className="w-full h-12 rounded-xl border-dashed border-2 border-[#D2D2D7] hover:border-[#0071E3] hover:bg-white hover:text-[#0071E3] transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="size-4 group-hover:scale-110 transition-transform" />
                Создать новый материал
              </Button>

              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[160px]">
                  <GenericCombobox
                    options={[
                      { label: "Все категории", value: "all" },
                      ...Object.values(MaterialType).map((type) => ({
                        label: type,
                        value: type,
                      })),
                    ]}
                    value={filterType}
                    onChange={setFilterType}
                    placeholder="Категория"
                  
                    searchPlaceholder="Поиск категории..."
                    icon={<Filter className="size-4 text-[#86868b]" />}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <GenericCombobox
                    options={[
                      { label: "Без группировки", value: "none" },
                      { label: "По производителю", value: "manufacturer" },
                      { label: "По категории", value: "type" },
                    ]}
                    value={groupBy}
                    onChange={setGroupBy}
                    placeholder="Группировка"
                    icon={<LayoutGrid className="size-4 text-[#86868b]" />}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <GenericCombobox
                    options={[
                      { label: "Сначала новые", value: "newest" },
                      { label: "По названию (А-Я)", value: "name_asc" },
                      { label: "По названию (Я-А)", value: "name_desc" },
                      { label: "По цене (дешевле)", value: "price_asc" },
                      { label: "По цене (дороже)", value: "price_desc" },
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                    placeholder="Сортировка"
                    searchPlaceholder="Поиск метода..."
                    icon={<ArrowUpDown className="size-4 text-[#86868b]" />}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-2 pb-6">
            <div className="space-y-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#86868b] gap-3">
                  <Loader2 className="size-8 animate-spin text-[#0071E3]" />
                  <p>Загрузка библиотеки...</p>
                </div>
              ) : groupBy === "none" ? (
                <div className="px-4 space-y-1">
                  {filteredAndSortedMaterials.length > 0 ? (
                    filteredAndSortedMaterials.map((material) => (
                      <MaterialItem
                        key={material.id}
                        material={material}
                        onSelect={handleSelectMaterial}
                        isAdding={isAdding === material.id}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[#86868b]">
                      <p>Материалы не найдены</p>
                    </div>
                  )}
                </div>
              ) : groupKeys.length > 0 ? (
                groupKeys.map((key) => (
                  <div key={key} className="space-y-1 mb-6">
                    <h3 className="px-6 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider sticky top-0 bg-white/80 backdrop-blur-md z-10 transition-colors">
                      {key}
                    </h3>
                    <div className="px-4 space-y-1">
                      {groupedMaterials[key].map((material) => (
                        <MaterialItem
                          key={material.id}
                          material={material}
                          onSelect={handleSelectMaterial}
                          isAdding={isAdding === material.id}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#86868b]">
                  <p>Материалы не найдены</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AddMaterialDialog
        open={showAddLibraryDialog}
        onOpenChange={setShowAddLibraryDialog}
        onMaterialAdded={() => {
          loadMaterials();
          onMaterialAdded();
        }}
        initialSuppliers={initialSuppliers}
        initialSupplierCompanies={initialSupplierCompanies}
      />
    </>
  );
}
