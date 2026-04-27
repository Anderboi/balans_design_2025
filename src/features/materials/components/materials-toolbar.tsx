import { PageToolbar } from "@/components/ui/page-toolbar";
import { ButtonGroup } from "@/components/ui/button-group";
import { FilterValues } from "./filter-material-drawer";
import ViewToggle from "../../../components/view-toggle";
import SortIndicator from "../../../components/sort-indicator";
import FilterButton from "../../../components/filter-button";
import { SortConfig as GenericSortConfig } from "@/types/ui";

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

export type SortConfig = GenericSortConfig<NonNullable<SortField>>;

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

function countActiveFilters(
  activeFilters: FilterValues,
  groupBy: GroupField,
  sortConfig: SortConfig,
) {
  return [
    activeFilters.types.length,
    activeFilters.suppliers.length,
    activeFilters.priceMin || activeFilters.priceMax ? 1 : 0,
    groupBy ? 1 : 0,
    sortConfig.field ? 1 : 0,
  ].reduce((a, b) => a + b, 0);
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
  const sortLabels: Record<NonNullable<SortField>, string> = {
    name: "Название",
    description: "Описание",
    price: "Цена",
    manufacturer: "Производитель",
    type: "Тип",
  };

  return (
    <PageToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Поиск материалов..."
    >
      <div className="flex items-center gap-2">
        {/* Режим отображения */}
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

        <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block" />

        <ButtonGroup>
          <FilterButton
            count={countActiveFilters(activeFilters, groupBy, sortConfig)}
            onClick={onFilterClick}
          />

          <SortIndicator sortConfig={sortConfig} labels={sortLabels} />
        </ButtonGroup>
      </div>
    </PageToolbar>
  );
}
