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
  const stageItems = await projectsService.getProjectStageItems(
    projectId,
    supabase,
  );

  return (
    <ProjectStages initialStageItems={stageItems} isStrictMode={isStrictMode} />
  );
}
