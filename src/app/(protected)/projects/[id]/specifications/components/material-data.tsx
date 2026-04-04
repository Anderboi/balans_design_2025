import { cn } from "@/lib/utils";

interface MaterialDataProps {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
  /** Render a dash when value is empty/zero */
  showEmpty?: boolean;
}

const MaterialData = ({
  label,
  value,
  children,
  className,
  showEmpty = false,
}: MaterialDataProps) => {
  const isEmpty =
    value === undefined || value === null || value === "" || value === 0;

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <span className="text-[#8E8E93] text-[9px] font-semibold leading-none uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1 min-h-[20px]">
        {value && (
          <span className="text-[#1D1D1F] text-sm font-semibold">{value}</span>
        )}
        {children ?? (
          <span
            className={cn(
              "text-sm font-semibold",
              isEmpty ? "text-[#C7C7CC]" : "text-[#1D1D1F]",
            )}
          >
            {isEmpty && showEmpty ? "-" : value}
          </span>
        )}
      </div>
    </div>
  );
};

export default MaterialData;
