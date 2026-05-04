import { StageConfig } from "@/config/project-stages";
import { StageHeader } from "./stage-header";
import { StageItem } from "./stage-item";
import MainBlockCard from '@/components/ui/main-block-card';

interface StageCardProps {
  stage: StageConfig & { acceptedAt?: string | null; acceptedBy?: string | null };
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onAcceptStage: (stageId: string) => void;
  projectId: string;
}

export function StageCard({
  stage,
  isExpanded,
  onToggle,
  onAcceptStage,
  projectId,
}: StageCardProps) {
  // In a real app, status would come from props/DB, here utilizing defaultStatus
  const status = stage.defaultStatus;
  const isLocked = status === "locked";

  return (
    <MainBlockCard isLocked={isLocked}>
      <StageHeader
        stage={stage}
        isExpanded={isExpanded}
        onToggle={() => onToggle(stage.id)}
        onAcceptStage={() => onAcceptStage(stage.id)}
        status={status}
        acceptedAt={stage.acceptedAt}
      />

      {/* Expandable Content */}
      {!isLocked && isExpanded && (
        <div className="px-1 pb-1 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-200 ">
          <div className="space-y-2 bg-zinc-100/50 rounded-[28px]">
            {stage.items.map((item) => (
              <StageItem
                key={item.id}
                item={item}
                stageStatus={stage.defaultStatus}
                projectId={projectId}
                stageId={stage.id}
              />
            ))}
          </div>
        </div>
      )}
    </MainBlockCard>
  );
}
