"use client";

import { ProjectStageItem } from "@/types";
import { toggleStageItemAction } from "@/lib/actions/stages";
import { useOptimistic, useTransition, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { STAGES_CONFIG } from "@/config/project-stages";
import { StageCard } from "./stages/stage-card";

interface ProjectStagesProps {
  initialStageItems?: ProjectStageItem[];
}

export function ProjectStages({ initialStageItems = [] }: ProjectStagesProps) {
  const params = useParams();
  const id = params?.id as string;
  const [isPending, startTransition] = useTransition();

  // Optimistic state for stage items
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    initialStageItems,
    (
      state,
      newItem: { stageId: string; itemId: string; completed: boolean }
    ) => {
      const existingIndex = state.findIndex(
        (item) =>
          item.stage_id === newItem.stageId && item.item_id === newItem.itemId
      );

      const updatedItem: ProjectStageItem = {
        id: existingIndex >= 0 ? state[existingIndex].id : "temp-id",
        project_id: id,
        stage_id: newItem.stageId,
        item_id: newItem.itemId,
        completed: newItem.completed,
        completed_at: newItem.completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        const newState = [...state];
        newState[existingIndex] = updatedItem;
        return newState;
      } else {
        return [...state, updatedItem];
      }
    }
  );

  // Merge config with optimistic data
  const stagesWithData = STAGES_CONFIG.map((stage) => {
    // Filter items relevant to this stage once
    const stageDbItems = optimisticItems.filter(
      (item) => item.stage_id === stage.id
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

  const handleItemToggle = async (
    stageId: string,
    itemId: string,
    completed: boolean
  ) => {
    startTransition(async () => {
      addOptimisticItem({ stageId, itemId, completed });

      const result = await toggleStageItemAction(
        id,
        stageId,
        itemId,
        completed
      );

      if (!result.success) {
        toast.error("Не удалось обновить статус этапа");
        // Reverting would require more complex logic or just ensuring the next server fetch corrects it
      }
    });
  };

  // By default expand the 'in_progress' stage or the first one
  const [expandedStages, setExpandedStages] = useState<string[]>([
    "preproject",
    "concept",
  ]);

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId]
    );
  };

  return (
    <div
      className={`w-full space-y-6 ${
        isPending ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Этапы работ</h2>

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
