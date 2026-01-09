import Link from "next/link";
import { Check, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { StageSubItem as IStageSubItem } from "@/config/project-stages";

interface StageItemProps {
  item: IStageSubItem;
  projectId: string;
  stageId: string;
  stageStatus: string;
}

export function StageItem({
  item,
  stageStatus,
  projectId,
}: Omit<StageItemProps, "onToggle">) {
  const isBrief = item.id === "brief";
  const Icon = item.icon || FileText;

  return (
    <Link
      href={isBrief ? `/projects/${projectId}/brief` : "#"}
      key={item.id}
      onClick={(e) => {
        if (!isBrief) e.preventDefault();
      }}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer",
        !isBrief && "pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 text-gray-600 group-hover:text-zinc-900 transition-colors">
        {/* <div
          className={cn(
            "size-5 rounded border flex items-center justify-center transition-colors mr-3",
            item.completed
              ? "bg-black border-black text-white"
              : "border-gray-300 bg-transparent"
          )}
        >
          {item.completed && <Check className="size-4" />}
        </div> */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            item.completed
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-400"
          )}
        >
          <Icon className="size-4" />
        </div>
        <span className="font-medium text-sm">{item.title}</span>
      </div>

      <div className="flex items-center gap-2">
        {item.completed && <Check className="size-4 text-green-500" />}
        {isBrief && (
          <ChevronRight className="size-4 text-gray-300 group-hover:text-black transition-colors" />
        )}
      </div>
    </Link>
  );
}
