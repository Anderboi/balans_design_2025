"use client";

import { useMemo, Suspense, useState, useEffect } from "react";
import { SpecificationMaterial, MaterialType } from "@/types";
import SpecMaterialCard from "../specifications/components/spec-material-card";
import { Badge } from "@/components/ui/badge";
import {
  SortAsc,
  SortDesc,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import TypeFilterChips from '@/components/type-filter-chips';
import { Button } from '@/components/ui/button';

// ─── Constants ──────────────────────────────────────────────────────────────

const FORMAT_PRICE = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  return FORMAT_PRICE.format(price);
}

function calcSum(items: SpecificationMaterial[]) {
  return items.reduce(
    (acc, m) => acc + (Number(m.price) || 0) * (Number(m.quantity) || 0),
    0,
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOrder = "asc" | "desc";
type ViewMode = "list" | "grid";

interface FilterState {
  searchTerm: string;
  filterType: string;
  sortOrder: SortOrder;
}

// ─── Hook: filter + group + totals ───────────────────────────────────────────

function useFilteredMaterials(
  materials: SpecificationMaterial[],
  { searchTerm, filterType, sortOrder }: FilterState,
) {
  return useMemo(() => {
    let result = [...materials];

    if (filterType !== "all") {
      result = result.filter((m) => m.type === filterType);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.project_article || "").toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const cmp = (a.name || "").localeCompare(b.name || "");
      return sortOrder === "asc" ? cmp : -cmp;
    });

    const groups = result.reduce(
      (acc, m) => {
        if (!acc[m.type]) acc[m.type] = [];
        acc[m.type].push(m);
        return acc;
      },
      {} as Record<MaterialType, SpecificationMaterial[]>,
    );

    return {
      groups,
      totalCount: result.length,
      totalSum: calcSum(result),
    };
  }, [materials, searchTerm, filterType, sortOrder]);
}

// ─── Hook: local materials sync ──────────────────────────────────────────────

function useLocalMaterials(initial: SpecificationMaterial[]) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const update = (updated: SpecificationMaterial) =>
    setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  return { items, update };
}

// ─── Toolbar sub-components ──────────────────────────────────────────────────


function SortButton({
  order,
  onToggle,
}: {
  order: SortOrder;
  onToggle: () => void;
}) {
  return (
    <Button
      onClick={onToggle}
      size={'lg'}
      variant={'ghost'}
      className="flex items-center justify-center gap-2 px-3 cursor-pointer rounded-full hover:bg-zinc-100 text-zinc-600 outline-none transition-colors"
    >
      <span className="hidden sm:block text-xs">
        {order === "asc" ? "А → Я" : "Я → А"}
      </span>
      {order === "asc" ? (
        <SortAsc className="size-4" />
      ) : (
        <SortDesc className="size-4" />
      )}
    </Button>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  filters: FilterState;
  onFiltersChange: (patch: Partial<FilterState>) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}

function MaterialListToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 bg-background px-2 py-2 rounded-full shadow-lg shadow-zinc-300/50">
      <div className="relative grow sm:w-96 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Поиск..."
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
          className="pl-10 w-full //rounded-2xl //max-sm:rounded-full //bg-zinc-50/50 //border-zinc-200"
        />
      </div>
      <div className="flex items-center">
        <SortButton
          order={filters.sortOrder}
          onToggle={() =>
            onFiltersChange({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
        />
      </div>
      
    </div>
  );
}

// ─── Category group header ────────────────────────────────────────────────────

function CategoryHeader({
  type,
  count,
  sum,
  collapsed,
  onToggle,
}: {
  type: string;
  count: number;
  sum: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-2 group text-left"
    >
      {collapsed ? (
        <ChevronRight className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      ) : (
        <ChevronDown className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      )}
      <span className="text-[11px] text-muted-foreground/50 font-bold uppercase tracking-widest whitespace-nowrap group-hover:text-muted-foreground/70 transition-colors">
        {type}
      </span>
      <Badge
        variant="secondary"
        className="text-[11px] font-bold text-muted-foreground/50 bg-muted/40 border border-muted-foreground/10 px-2 py-0.5 min-w-[22px] text-center"
      >
        {count}
      </Badge>
      <div className="h-px bg-muted-foreground/10 grow" />
      <span className="text-[12px] font-semibold text-muted-foreground/70 tabular-nums shrink-0">
        {formatPrice(sum)} <span className="text-[10px]">₽</span>
      </span>
    </button>
  );
}

// ─── Category group ───────────────────────────────────────────────────────────

function CategoryGroup({
  type,
  items,
  viewMode,
  onUpdate,
}: {
  type: string;
  items: SpecificationMaterial[];
  viewMode: ViewMode;
  onUpdate: (m: SpecificationMaterial) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <CategoryHeader
        type={type}
        count={items.length}
        sum={calcSum(items)}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      {!collapsed && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-top-1 duration-200",
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
              : "flex flex-col gap-2",
          )}
        >
          {items.map((material, i) => (
            <SpecMaterialCard
              key={material.id ?? i}
              material={material}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <p className="text-muted-foreground text-center py-8 text-sm">
      {hasFilters
        ? "Ничего не найдено по вашему запросу."
        : "Материалы не найдены."}
    </p>
  );
}

// ─── Sticky footer ────────────────────────────────────────────────────────────

function StickyFooter({ count, sum }: { count: number; sum: number }) {
  return (
    <div className="sticky -bottom-12 sm:bottom-0 z-10 bg-black backdrop-blur-md border border-muted/30 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-500 rounded-3xl">
      <div className="px-4 py-3 sm:px-8 sm:py-5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
            Всего позиций
          </span>
          <span className="text-xl font-bold text-zinc-200">{count}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
            Общая сумма
          </span>
          <span className="text-xl font-bold text-zinc-200">
            {formatPrice(sum)} <span className="text-sm font-semibold">₽</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

interface Props {
  materials: SpecificationMaterial[];
}

export default function MaterialListControls({ materials }: Props) {
  const { items, update } = useLocalMaterials(materials);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    filterType: "all",
    sortOrder: "asc",
  });

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { groups, totalCount, totalSum } = useFilteredMaterials(items, filters);

  const hasFilters = filters.searchTerm !== "" || filters.filterType !== "all";
  const hasMaterials = Object.values(groups).some((g) => g.length > 0);

  return (
    <div className="flex flex-col gap-2 sm:gap-4 relative">
      <MaterialListToolbar
        filters={filters}
        onFiltersChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <TypeFilterChips
        value={filters.filterType}
        onChange={(v) =>
          setFilters({
            ...filters,
            filterType: filters.filterType === v ? "all" : v,
          })
        }
      />
      <div className="flex flex-col gap-6">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground py-4 text-center">
              Загрузка...
            </div>
          }
        >
          {hasMaterials ? (
            Object.entries(groups).map(([type, groupItems]) => (
              <CategoryGroup
                key={type}
                type={type}
                items={groupItems}
                viewMode={viewMode}
                onUpdate={update}
              />
            ))
          ) : (
            <EmptyState hasFilters={hasFilters} />
          )}
        </Suspense>
      </div>

      <StickyFooter count={totalCount} sum={totalSum} />
    </div>
  );
}
