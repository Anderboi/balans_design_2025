import * as React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils/utils";

/** Thin wrapper that keeps Input styling consistent across the card */
const EditableInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "p-0 h-auto border-none shadow-none focus-visible:ring-0 bg-transparent",
      className
    )}
    {...props}
  />
));

EditableInput.displayName = "EditableInput";

export default EditableInput;
