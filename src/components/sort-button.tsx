"use client";

import { ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortConfig, SortDirection } from "@/types/ui";
import { cn } from "@/lib/utils";

interface SortButtonProps<T extends string> {
  sortConfig: SortConfig<T>;
  onSortChange: (field: T, direction: SortDirection) => void;
  options: { label: string; value: T }[];
}

export function SortButton<T extends string>({
  sortConfig,
  onSortChange,
  options,
}: SortButtonProps<T>) {
  const currentOption = options.find((o) => o.value === sortConfig.field);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="gap-2">
          <ArrowUpDown className="size-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {currentOption ? currentOption.label : "Сортировка"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
          Поле
        </div>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value, sortConfig.direction)}
            className="flex items-center justify-between rounded-xl cursor-pointer"
          >
            {option.label}
            {sortConfig.field === option.value && (
              <Check className="size-4" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1" />
        <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
          Порядок
        </div>
        <DropdownMenuItem
          onClick={() => sortConfig.field && onSortChange(sortConfig.field, "asc")}
          className={cn(
            "flex items-center justify-between rounded-xl cursor-pointer",
            !sortConfig.field && "opacity-50 cursor-default"
          )}
          disabled={!sortConfig.field}
        >
          По возрастанию
          {sortConfig.direction === "asc" && <Check className="size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => sortConfig.field && onSortChange(sortConfig.field, "desc")}
          className={cn(
            "flex items-center justify-between rounded-xl cursor-pointer",
            !sortConfig.field && "opacity-50 cursor-default"
          )}
          disabled={!sortConfig.field}
        >
          По убыванию
          {sortConfig.direction === "desc" && <Check className="size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
