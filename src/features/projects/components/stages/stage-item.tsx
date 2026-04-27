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
  const isObjectInfo = item.id === "object_info";
  const isPlanning = item.id === "planning";
  const isCollages = item.id === "collages";
  const isViz = item.id === "viz";
  const isDrawings = item.id === "drawings";
  const isClickable =
    isBrief || isObjectInfo || isPlanning || isCollages || isViz || isDrawings;
  const Icon = item.icon || FileText;

  const getHref = () => {
    if (isBrief) return `/projects/${projectId}/brief`;
    if (isObjectInfo) return `/projects/${projectId}/object-info`;
    if (isPlanning) return `/projects/${projectId}/planning`;
    if (isCollages) return `/projects/${projectId}/collages`;
    if (isViz) return `/projects/${projectId}/visualizations`;
    if (isDrawings) return `/projects/${projectId}/drawings`;
    return "#";
  };

  return (
    <Link
      href={getHref()}
      key={item.id}
      onClick={(e) => {
        if (!isClickable) e.preventDefault();
      }}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer",
        !isClickable && "pointer-events-none",
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
            "size-8 rounded-full flex items-center justify-center shrink-0 ",
            item.completed
              ? "bg-zinc-900 text-white border-0"
              : "bg-gray-100 text-gray-400",
          )}
        >
          {item.completed ? <Check className="size-4" /> : <Icon className="size-4" />}
        </div>
        <span
          className={cn(
            "font-medium text-sm",
            item.completed ? "text-zinc-600" : "text-zinc-900",
          )}
        >
          {item.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* {item.completed && <Check className="size-4 text-green-500" />} */}
        {isClickable && (
          <ChevronRight className="size-4 text-gray-300 group-hover:text-black transition-colors" />
        )}
      </div>
    </Link>
  );
}
