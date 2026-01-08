import { projectsService } from "@/lib/services/projects";
import { ProjectStages } from "./project-stages";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectStagesLoaderProps {
  projectId: string;
}

export async function ProjectStagesLoader({
  projectId,
}: ProjectStagesLoaderProps) {
  const stageItems = await projectsService.getProjectStageItems(projectId);

  return <ProjectStages initialStageItems={stageItems} />;
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
