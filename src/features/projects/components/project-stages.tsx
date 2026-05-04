"use client";

import { ProjectStageItem, ProjectStageRecord } from "@/types";
import { useTransition, useState, useOptimistic } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { STAGES_CONFIG, StageStatus } from "@/config/project-stages";
import { StageCard } from "./stages/stage-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateProjectAction } from "@/lib/actions/projects";
import { acceptStageAction } from "@/lib/actions/stages";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ProjectStagesProps {
  initialStageItems?: ProjectStageItem[];
  initialStageRecords?: ProjectStageRecord[];
  isStrictMode?: boolean;
}

export function ProjectStages({
  initialStageItems = [],
  initialStageRecords = [],
  isStrictMode = true,
}: ProjectStagesProps) {
  const params = useParams();
  const id = params?.id as string;
  const [isPending, startTransition] = useTransition();

  // Оптимистичные данные для мгновенного обновления UI
  const [optimisticStageRecords, setOptimisticStageRecords] = useOptimistic(
    initialStageRecords,
  );

  // Вычисляем статус стадии на основе данных из БД
  const computeStageStatus = (
    stageId: string,
    stageIndex: number,
  ): StageStatus => {
    // Ищем запись из project_stages для этой стадии
    const stageRecord = optimisticStageRecords.find(
      (r) => r.stage_id === stageId,
    );

    if (stageRecord) {
      // В гибком режиме разблокируем все стадии (кроме уже completed)
      if (!isStrictMode && stageRecord.status === "locked") {
        return "in_progress";
      }
      return stageRecord.status as StageStatus;
    }

    // Fallback: если записи нет
    if (!isStrictMode) return "in_progress";
    if (stageIndex === 0) return "in_progress";
    return "locked";
  };

  // Merge config with DB data
  const stagesWithData = STAGES_CONFIG.map((stage, index) => {
    // Filter items relevant to this stage
    const stageDbItems = initialStageItems.filter(
      (item: ProjectStageItem) => item.stage_id === stage.id,
    );

    const completedItemsCount = stage.items.reduce((acc, item) => {
      const isCompleted =
        stageDbItems.find((i) => i.item_id === item.id)?.completed ?? false;
      return acc + (isCompleted ? 1 : 0);
    }, 0);

    const computedStatus = computeStageStatus(stage.id, index);

    // Находим запись о приёмке
    const stageRecord = optimisticStageRecords.find(
      (r) => r.stage_id === stage.id,
    );

    return {
      ...stage,
      defaultStatus: computedStatus,
      acceptedAt: stageRecord?.accepted_at || null,
      acceptedBy: stageRecord?.accepted_by || null,
      progress: {
        current: completedItemsCount,
        total: stage.items.length,
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

  // Обработчик приёмки стадии менеджером
  const handleAcceptStage = (stageId: string) => {
    startTransition(async () => {
      // Оптимистичное обновление
      setOptimisticStageRecords((prev) => {
        const updated = prev.map((r) => {
          if (r.stage_id === stageId) {
            return { ...r, status: "completed" as const, accepted_at: new Date().toISOString() };
          }
          return r;
        });

        // Разблокируем следующую стадию
        const stageIndex = STAGES_CONFIG.findIndex((s) => s.id === stageId);
        if (stageIndex >= 0 && stageIndex < STAGES_CONFIG.length - 1) {
          const nextStageId = STAGES_CONFIG[stageIndex + 1].id;
          return updated.map((r) =>
            r.stage_id === nextStageId && r.status === "locked"
              ? { ...r, status: "in_progress" as const }
              : r,
          );
        }

        return updated;
      });

      const res = await acceptStageAction(id, stageId);
      if (!res.success) {
        toast.error("Не удалось завершить стадию");
      } else {
        toast.success("Стадия принята!");
      }
    });
  };

  // By default expand the 'in_progress' or 'ready' stages
  const [expandedStages, setExpandedStages] = useState<string[]>(() => {
    return stagesWithData
      .filter((s) => s.defaultStatus === "in_progress" || s.defaultStatus === "ready")
      .map((s) => s.id);
  });

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
            onAcceptStage={handleAcceptStage}
            projectId={id}
          />
        ))}
      </div>
    </div>
  );
}
