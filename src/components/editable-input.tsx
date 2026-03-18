import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

/** Thin wrapper that keeps Input styling consistent across the card */
const EditableInput = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => (
  <Input
    className={cn(
      "p-0 h-auto border-none shadow-none focus-visible:ring-0 bg-transparent",
      className,
    )}
    {...props}
  />
);

export default EditableInput;
