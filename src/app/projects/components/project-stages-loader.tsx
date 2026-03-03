import { projectsService } from "@/lib/services/projects";
import { ProjectStages } from "./project-stages";
import { Skeleton } from "@/components/ui/skeleton";
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

export function ProjectStagesSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Skeleton className="h-7 w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-gray-100 p-6 bg-white h-24"
          />
        ))}
      </div>
    </div>
  );
}
