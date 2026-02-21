import { Check, ChevronDown, ChevronUp, Loader2, Lock, PencilRuler } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageConfig } from "@/config/project-stages";

interface StageHeaderProps {
  stage: StageConfig;
  isExpanded: boolean;
  onToggle: () => void;
  status: "completed" | "in_progress" | "locked";
}

export function StageHeader({
  stage,
  isExpanded,
  onToggle,
  status,
}: StageHeaderProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

  const handleToggle = () => {
    // Prevent toggle if locked, but allow button click to handle it too
    if (!isLocked) {
      onToggle();
    }
  };

  return (
    <div
      className={cn(
        "p-6 flex items-center justify-between cursor-pointer",
        !isLocked && "hover:bg-gray-50/50 rounded-3xl",
      )}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
            isCompleted
              ? "bg-black text-white"
              : isInProgress
                ? "bg-gray-100"
                : "bg-gray-50",
          )}
        >
          {isCompleted && <Check className="size-6" />}
          {isInProgress && <PencilRuler className="size-6 text-gray-500" />}
          {isLocked && <Lock className="size-5 text-gray-400" />}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h3
              className={cn(
                "text-lg font-semibold",
                isLocked ? "text-gray-400" : "text-gray-900",
              )}
            >
              {stage.title}
            </h3>
            {isCompleted && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Этап завершен
              </span>
            )}
            {isInProgress && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                В работе
              </span>
            )}
          </div>
          {isInProgress && stage.dueDate && (
            <p className="text-sm text-gray-500 mt-0.5">
              Срок: {stage.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isInProgress && stage.progress && (
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <span>
              {stage.progress.current} из {stage.progress.total}
            </span>
            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="bg-black h-full rounded-full"
                style={{
                  width: `${
                    (stage.progress.current / stage.progress.total) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {!isLocked && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
