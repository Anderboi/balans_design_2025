import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefSectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  completed?: boolean;
  onClick?: () => void;
}

export function BriefSectionCard({
  title,
  description,
  icon: Icon,
  completed = false,
  onClick,
}: BriefSectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-8 bg-background rounded-4xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1",
        completed &&
          "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-50",
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-6 right-6">
        <div
          className={cn(
            "size-6 rounded-full border-2 transition-colors duration-300",
            completed
              ? "bg-emerald-500 border-emerald-500"
              : "border-gray-100 group-hover:border-gray-200",
          )}
        >
          {completed && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 m-0.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Icon */}
      <div className="size-14 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="size-6 text-gray-400 group-hover:text-black transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed h-[36px]">
          {description}
        </p>
      </div>
    </div>
  );
}
