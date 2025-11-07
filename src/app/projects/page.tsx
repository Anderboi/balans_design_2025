import PageErrorBoundary from "@/components/page-error-boundary";
import ProjectsListClient from "@/app/projects/components/projects-list";
import { getProjects } from './actions';

export const revalidate = 0; // Отключаем кэширование для этой страницы

export default async function ProjectsPage() {
  // Получаем проекты из Supabase
  const projects = await getProjects()

  return (
    <PageErrorBoundary pageName="страница проектов">
      <ProjectsListClient initialProjects={projects} />
    </PageErrorBoundary>
  );
}