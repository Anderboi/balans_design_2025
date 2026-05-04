import { projectsService } from "@/lib/services/projects";
import { ProjectStages } from "./project-stages";
import { createClient } from "@/lib/supabase/server";

interface ProjectStagesLoaderProps {
  projectId: string;
  isStrictMode?: boolean;
}

export async function ProjectStagesLoader({
  projectId,
  isStrictMode = true,
}: ProjectStagesLoaderProps) {
  const supabase = await createClient();
  const [stageItems, stageRecords] = await Promise.all([
    projectsService.getProjectStageItems(projectId, supabase),
    projectsService.getProjectStages(projectId, supabase),
  ]);

  return (
    <ProjectStages
      initialStageItems={stageItems}
      initialStageRecords={stageRecords}
      isStrictMode={isStrictMode}
    />
  );
}
