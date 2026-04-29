import { Button } from '@/components/ui/button';
import { getProjects } from "@/features/projects/actions";
import PageContainer from '@/components/ui/page-container';
import PageHeader from '@/components/ui/page-header';
import ProjectCard from '@/features/projects/components/project-card';
import { ProjectsEmptyState } from '@/features/projects/components/projects-empty-state';
import { Metadata } from 'next';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Проекты",
  description: "Список активных и завершенных проектов дизайна интерьера.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageContainer>
      <div className="flex items-end justify-between mb-2">
        <PageHeader
          title="Проекты"
          description="Управление объектами и стадиями работ"
        />
        <Button asChild size={"lg"} className="max-sm:size-12">
          <Link href="/projects/new">
            <Plus className="size-5 sm:mr-2" />
            <span className="hidden sm:inline">Создать проект</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <ProjectsEmptyState />
        )}
      </div>
    </PageContainer>
  );
}
