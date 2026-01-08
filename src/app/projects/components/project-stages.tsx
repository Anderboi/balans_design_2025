"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { STAGES_CONFIG } from "@/config/project-stages";
import { StageCard } from "./stages/stage-card";

export function ProjectStages() {
  const params = useParams();
  const id = params?.id as string;

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
    <div className="w-full space-y-6">
      <h2 className="text-lg font-semibold mb-4">Этапы работ</h2>

      <div className="space-y-4">
        {STAGES_CONFIG.map((stage) => (
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
