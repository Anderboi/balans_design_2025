import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

const FilterButton = ({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      variant={'ghost'}
      size='lg'
      
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
    </Button>
  );
}

export default FilterButton;