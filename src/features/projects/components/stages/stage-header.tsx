import { ChevronDown, ChevronUp, Lock, PencilRuler, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageConfig } from "@/config/project-stages";
import { Badge } from '@/components/ui/badge';

interface StageHeaderProps {
  stage: StageConfig;
  isExpanded: boolean;
  onToggle: () => void;
  onAcceptStage: () => void;
  status: "completed" | "in_progress" | "ready" | "locked";
  acceptedAt?: string | null;
}

export function StageHeader({
  stage,
  isExpanded,
  onToggle,
  onAcceptStage,
  status,
  acceptedAt,
}: StageHeaderProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const isReady = status === "ready";
  const Icon = stage.icon || PencilRuler;

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
              ? "bg-zinc-900 text-white border-0"
              : isReady
                ? "bg-emerald-500 text-white border-0 animate-pulse"
                : isInProgress
                  ? "bg-zinc-100 text-zinc-900 border border-zinc-200/50"
                  : "bg-gray-50 text-gray-400",
          )}
        >
          {isLocked ? (
            <Lock className="size-5" />
          ) : isCompleted ? (
            <CheckCircle2 className="size-6" />
          ) : (
            <Icon className="size-6" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h3
              className={cn(
                "text-lg font-bold",
                isCompleted && "text-zinc-600/80",
                isLocked ? "text-zinc-400" : "text-zinc-800",
              )}
            >
              {stage.title}
            </h3>
            {isCompleted && (
              <Badge
                variant="secondary"
                className="text-green-600 bg-green-50 border border-green-300 text-[10px] uppercase tracking-wide font-bold"
              >
                завершен
              </Badge>
            )}
            {isReady && (
              <Badge
                variant="secondary"
                className="text-amber-600 bg-amber-50 border border-amber-300 text-[10px] uppercase tracking-wide font-bold animate-in fade-in duration-500"
              >
                Готов к приёмке
              </Badge>
            )}
            {isInProgress && (
              <Badge
                variant="secondary"
                className="text-blue-600 bg-blue-50 border border-blue-200 text-[10px] uppercase tracking-wide font-bold"
              >
                В работе
              </Badge>
            )}
          </div>
          {isCompleted && acceptedAt && (
            <p className="text-sm text-gray-400 mt-0.5">
              Принят {new Date(acceptedAt).toLocaleDateString("ru-RU")}
            </p>
          )}
          {isInProgress && stage.dueDate && (
            <p className="text-sm text-gray-500 mt-0.5">
              Срок: {stage.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Progress bar for in_progress */}
        {(isInProgress || isReady) && stage.progress && (
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <span>
              {stage.progress.current} из {stage.progress.total}
            </span>
            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isReady ? "bg-emerald-500" : "bg-foreground",
                )}
                style={{
                  width: `${
                    (stage.progress.current / stage.progress.total) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Кнопка приёмки — отображается только для ready статуса */}
        {isReady && (
          <Button
            variant="default"
            size="sm"
            className="rounded-full px-5 h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onAcceptStage();
            }}
          >
            <CheckCircle2 className="size-4 mr-1.5" />
            Принять
          </Button>
        )}

        {!isLocked && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-gray-400"
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
