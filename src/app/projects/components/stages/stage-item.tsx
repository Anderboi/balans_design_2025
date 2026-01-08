import Link from "next/link";
import { Check, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { StageSubItem as IStageSubItem } from "@/config/project-stages";

interface StageItemProps {
  item: IStageSubItem;
  projectId: string;
}

export function StageItem({ item, projectId }: StageItemProps) {
  const isBrief = item.id === "brief";
  const Icon = item.icon || FileText;

  return (
    <Link
      href={isBrief && projectId ? `/projects/${projectId}/brief` : "#"}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer",
        !isBrief && "pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 text-gray-600 group-hover:text-zinc-900 transition-colors">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            item.completed
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-400"
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">{item.title}</span>
      </div>

      <div className="flex items-center gap-2">
        {item.completed && <Check className="w-4 h-4 text-green-500" />}
        {isBrief && (
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
        )}
      </div>
    </Link>
  );
}
