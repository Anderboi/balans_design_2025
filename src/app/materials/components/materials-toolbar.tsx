import {
  List,
  LayoutGrid,
  Funnel,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { FilterValues } from "./filter-material-drawer";

export type SortField =
  | "name"
  | "description"
  | "price"
  | "manufacturer"
  | "type"
  | null;

export type GroupField =
  | "manufacturer"
  | "type"
  | "supplier"
  | "description"
  | null;

export interface SortConfig {
  field: SortField;
  direction: "asc" | "desc";
}

interface MaterialsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  activeFilters: FilterValues;
  onFilterClick: () => void;
  groupBy: GroupField;
  onGroupByChange: (value: GroupField) => void;
  sortConfig: SortConfig;
  onSortChange: (field: SortField) => void;
}

export function MaterialsToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeFilters,
  onFilterClick,
  groupBy,
  onGroupByChange,
  sortConfig,
  onSortChange,
}: MaterialsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-background p-2 rounded-2xl shadow-lg shadow-zinc-300/50">
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Поиск материалов..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center //gap-2 sm:w-full md:w-auto overflow-x-auto mr-1 no-scrollbar">
        
        {/* Режим отображения */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg ">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
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
            onClick={() => onViewModeChange("list")}
            className={cn(
              viewMode === "list" && "bg-background",
              "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
            )}
          >
            <List className="size-4" />
          </Button>
        </div>
        <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block" />

        <ButtonGroup>

          {/* Фильтры */}
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={onFilterClick}
          >
            <Funnel className="size-4" />
            <span className="hidden sm:block">Фильтры</span>
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

          {/* Группировка */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="cursor-pointer">
                <Layers className="size-4 mr-2" />
                <span className="hidden sm:block">Группировка</span>
                {groupBy && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 min-w-5"
                  >
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {[
                { label: "Нет", value: null },
                { label: "Производитель", value: "manufacturer" },
                { label: "Тип", value: "type" },
                { label: "Поставщик", value: "supplier" },
                { label: "Описание", value: "description" },
              ].map((option) => (
                <DropdownMenuItem
                  key={option.value || "none"}
                  onClick={() => onGroupByChange(option.value as GroupField)}
                  className="justify-between"
                >
                  {option.label}
                  {groupBy === option.value && (
                    <span className="ml-2">
                      <ArrowUp className="size-3 rotate-45" />
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Сортировка */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="cursor-pointer">
                <SlidersHorizontal className="size-4 mr-2" />
                <span className="hidden sm:block">Сортировка</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {[
                { label: "Название", value: "name" },
                { label: "Описание", value: "description" },
                { label: "Цена", value: "price" },
                { label: "Производитель", value: "manufacturer" },
                { label: "Тип", value: "type" },
              ].map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value as SortField)}
                  className="justify-between"
                >
                  {option.label}
                  {sortConfig.field === option.value && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      )}
                    </span>
                  )}
                  {sortConfig.field !== option.value && (
                    <span className="w-3" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
}
