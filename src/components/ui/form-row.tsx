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
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4", className)}>
      <Label htmlFor={htmlFor} className="text-left sm:text-right w-full sm:w-50">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="w-full">{children}</div>
    </div>
  );
}
