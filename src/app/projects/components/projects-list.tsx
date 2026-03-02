import { Project } from "@/types";
import ProjectCard from "./project-card";
import { ProjectsEmptyState } from "./projects-empty-state";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({
  initialProjects = [],
}: ProjectsListProps) {
  return (
    <PageContainer>
      <PageHeader
        title="Проекты"
        description="Управление объектами и стадиями работ"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {initialProjects.length > 0 ? (
          initialProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <ProjectsEmptyState />
        )}
      </div>
    </PageContainer>
  );
}
