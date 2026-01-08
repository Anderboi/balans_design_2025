import { cn } from "@/lib/utils";
import { StageConfig } from "@/config/project-stages";
import { StageHeader } from "./stage-header";
import { StageItem } from "./stage-item";

interface StageCardProps {
  stage: StageConfig;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  projectId: string;
}

export function StageCard({
  stage,
  isExpanded,
  onToggle,
  projectId,
}: StageCardProps) {
  // In a real app, status would come from props/DB, here utilizing defaultStatus
  const status = stage.defaultStatus;
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "rounded-3xl transition-all duration-300",
        isLocked ? "opacity-60" : "bg-white border border-gray-100 shadow-sm"
      )}
    >
      <StageHeader
        stage={stage}
        isExpanded={isExpanded}
        onToggle={() => onToggle(stage.id)}
        status={status}
      />

      {/* Expandable Content */}
      {!isLocked && isExpanded && (
        <div className="px-6 pb-6 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="h-px bg-gray-100 mb-4 mx-2" />
          {stage.items.map((item) => (
            <StageItem key={item.id} item={item} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}
