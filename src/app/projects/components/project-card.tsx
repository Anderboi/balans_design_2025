import { Project } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getStageBadgeClass } from "@/lib/utils/utils";
import { STAGES_CONFIG } from "@/config/project-stages";
import { ArrowRight, MapPin } from "lucide-react";

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
      <div className=" relative h-[360px] rounded-4xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-zinc-100/50">
        {/* Make the card clicking generic for the whole card */}
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </div>
        <div className="absolute top-6 right-6 z-10">
          <Badge
            variant={"secondary"}
            className={`${getStageBadgeClass(
              project.stage,
            )} text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md bg-white/90 border-transparent shadow-sm`}
          >
            {project.stage}
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-10">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-sm truncate pr-2">
                  {project.name}
                </h3>
                <div className="flex flex-col items-start gap-2 text-white/70 text-sm font-medium">
                  <span className="truncate max-w-[120px]">{clientName}</span>
                  <span className="line-clamp-2 flex items-center gap-1 h-9">
                    <MapPin size={12} className="min-w-4" /> {project.address}
                  </span>
                </div>
              </div>

              {/* Floating Action Button */}
              <div className="size-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl shrink-0">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>

          {/* Progress Bar Container (appears/highlights on hover) */}
          <div className="mt-6 flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-white/90">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
