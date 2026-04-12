import { SlidersHorizontal } from 'lucide-react';

const FilterButton = ({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors"
    >
      <SlidersHorizontal className="size-4" />
      <span className="hidden sm:block text-sm font-medium">Фильтры</span>

      {count > 0 && (
        <>
          {/* Mobile: dot */}
          <span className="absolute top-1.5 right-1.5 sm:hidden size-2 rounded-full bg-zinc-800" />
          {/* Desktop: count badge */}
          <span className="hidden sm:flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-zinc-800 text-white text-xs font-medium">
            {count}
          </span>
        </>
      )}
    </button>
  );
}

export default FilterButton;