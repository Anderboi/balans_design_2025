import { Plus } from 'lucide-react';
import { Button } from './button';

const AddItemButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className="cursor-pointer"
      onClick={onClick}
    >
      <Plus className="size-4 mr-2" />
      {children}
    </Button>
  );
}

export default AddItemButton