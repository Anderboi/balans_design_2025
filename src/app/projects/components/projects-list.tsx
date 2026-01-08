import { Project } from "@/types";
import ProjectCard from "./project-card";
import { ProjectsEmptyState } from "./projects-empty-state";

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({
  initialProjects = [],
}: ProjectsListProps) {
  return (
    <div className="container //max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-normal text-gray-900 mb-3 tracking-tight">
          Проекты
        </h1>
        <p className="text-gray-500 text-lg">
          Управление объектами и стадиями работ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {initialProjects.length > 0 ? (
          initialProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <ProjectsEmptyState />
        )}
      </div>
    </div>
  );
}
