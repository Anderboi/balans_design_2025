import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormRowProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormRow({
  label,
  htmlFor,
  children,
  className,
  required,
}: FormRowProps) {
  return (
    <div className={cn("grid grid-cols-4 items-center gap-4", className)}>
      <Label htmlFor={htmlFor} className="text-right">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="col-span-3">{children}</div>
    </div>
  );
}
