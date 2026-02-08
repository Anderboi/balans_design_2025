import { Project } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getStageBadgeClass } from "@/lib/utils/utils";
import { STAGES_CONFIG } from "@/config/project-stages";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Calculate real progress based on STAGES_CONFIG
  const totalItems = STAGES_CONFIG.reduce(
    (acc, stage) => acc + stage.items.length,
    0,
  );
  const completedItemsCount =
    project.project_stage_items?.filter((item) => item.completed).length || 0;
  const progress =
    totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

  const clientName = project.contacts?.name || "Не указан";

  // Random image placeholder from Unsplash based on project ID to keep it consistent
  // Using architecture/interior keywords
  const imageUrl = `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop`;

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
        {/* Make the card clicking generic for the whole card */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <Badge
              variant={"secondary"}
              className={`${getStageBadgeClass(
                project.stage,
              )} text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md bg-white/90 border-transparent shadow-sm`}
            >
              {project.stage}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-black transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{clientName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-semibold text-gray-400">
              <span>Прогресс</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
