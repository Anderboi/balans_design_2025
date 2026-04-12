import { cn } from '@/lib/utils';
import { MaterialType } from '@/types';

const MATERIAL_TYPES = Object.values(MaterialType);

const TypeFilterChips = ({
  value,
  onChange,
  types = MATERIAL_TYPES,
}: {
  value: string | string[];
  onChange: (v: string) => void;
  types?: string[];
}) => {
  const isAllSelected = Array.isArray(value) ? value.length === 0 : value === "all";

  const isSelected = (t: string) => {
    return Array.isArray(value) ? value.includes(t) : value === t;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
          isAllSelected
            ? "bg-black text-white border-black"
            : "bg-background text-zinc-600 border-zinc-200 hover:bg-zinc-50",
        )}
      >
        Все типы
      </button>
      {types.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
            isSelected(t)
              ? "bg-black text-white border-black"
              : "bg-background text-zinc-600 border-zinc-200 hover:bg-zinc-50",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
export default TypeFilterChips;