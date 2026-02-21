"use client";

import { ProjectStageItem } from "@/types";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { STAGES_CONFIG } from "@/config/project-stages";
import { StageCard } from "./stages/stage-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateProjectAction } from "@/lib/actions/projects";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ProjectStagesProps {
  initialStageItems?: ProjectStageItem[];
  isStrictMode?: boolean;
}

export function ProjectStages({
  initialStageItems = [],
  isStrictMode = true,
}: ProjectStagesProps) {
  const params = useParams();
  const id = params?.id as string;
  const [isPending, startTransition] = useTransition();

  // Merge config with optimistic data
  const stagesWithData = STAGES_CONFIG.map((stage) => {
    // Filter items relevant to this stage once
    const stageDbItems = initialStageItems.filter(
      (item: ProjectStageItem) => item.stage_id === stage.id,
    );

    const totalItems = stage.items.length;

    const completedItemsCount = stage.items.reduce((acc, item) => {
      // Check in the filtered list
      const isCompleted =
        stageDbItems.find((i) => i.item_id === item.id)?.completed ??
        item.completed;
      return acc + (isCompleted ? 1 : 0);
    }, 0);

    return {
      ...stage,
      defaultStatus: !isStrictMode
        ? stage.defaultStatus === "locked"
          ? "in_progress"
          : stage.defaultStatus
        : stage.defaultStatus,
      progress: {
        current: completedItemsCount,
        total: totalItems,
      },
      items: stage.items.map((item) => {
        const dbItem = stageDbItems.find((i) => i.item_id === item.id);
        return {
          ...item,
          completed: dbItem ? dbItem.completed : false,
        };
      }),
    };
  });

  // By default expand the 'in_progress' stage or the first one
  const [expandedStages, setExpandedStages] = useState<string[]>([
    "preproject",
    "concept",
  ]);

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId],
    );
  };

  return (
    <div
      className={`w-full space-y-6 ${
        isPending ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Этапы работ
        </h2>

        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/60 p-2 px-3 rounded-2xl shadow-xs transition-all hover:bg-zinc-100/50">
          <div className="flex items-center gap-2 mr-2">
            {isStrictMode ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            )}
            <Label
              htmlFor="strict-mode"
              className="text-sm font-semibold cursor-pointer select-none text-zinc-700"
            >
              Строгий режим
            </Label>
          </div>
          <Switch
            id="strict-mode"
            disabled={isPending}
            checked={isStrictMode}
            onCheckedChange={(checked) => {
              startTransition(async () => {
                const res = await updateProjectAction(id, {
                  is_strict_mode: checked,
                });
                if (!res.success) {
                  toast.error("Не удалось изменить режим проекта");
                } else {
                  toast.success(
                    checked ? "Строгий режим включен" : "Гибкий режим включен",
                  );
                }
              });
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {stagesWithData.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isExpanded={expandedStages.includes(stage.id)}
            onToggle={toggleStage}
            projectId={id}
          />
        ))}
      </div>
    </div>
  );
}
