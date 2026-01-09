import { Button } from "./button";
import { Trash2 } from "lucide-react";

const DeleteIconButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
      onClick={onClick}
    >
      <Trash2 className="size-4" />
    </Button>
  );
};

export default DeleteIconButton;
