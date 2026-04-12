import { ArrowDown, ArrowUp } from "lucide-react";
import {
  SortConfig,
  SortField,
} from "../app/materials/components/materials-toolbar";

const SortIndicator = ({ sortConfig }: { sortConfig: SortConfig }) => {
  if (!sortConfig.field) return null;

  const labels: Record<NonNullable<SortField>, string> = {
    name: "Название",
    description: "Описание",
    price: "Цена",
    manufacturer: "Производитель",
    type: "Тип",
  };

  return (
    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 text-zinc-500 text-xs">
      {labels[sortConfig.field]}
      {sortConfig.direction === "asc" ? (
        <ArrowUp className="size-3" />
      ) : (
        <ArrowDown className="size-3" />
      )}
    </div>
  );
};

export default SortIndicator;
