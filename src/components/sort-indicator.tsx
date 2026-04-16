import { ArrowDown, ArrowUp } from "lucide-react";
import { SortConfig } from "@/types/ui";

interface SortIndicatorProps<T extends string> {
  sortConfig: SortConfig<T>;
  labels?: Record<T, string>;
}

const SortIndicator = <T extends string>({
  sortConfig,
  labels,
}: SortIndicatorProps<T>) => {
  if (!sortConfig.field) return null;

  return (
    <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-500 text-xs font-medium border border-zinc-200/50">
      {labels ? labels[sortConfig.field as T] : (sortConfig.field as string)}
      {sortConfig.direction === "asc" ? (
        <ArrowUp className="size-3" />
      ) : (
        <ArrowDown className="size-3" />
      )}
    </div>
  );
};

export default SortIndicator;
