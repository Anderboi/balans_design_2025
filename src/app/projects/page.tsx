import { projectsService } from "@/lib/services/projects";
import { Project } from "@/types";
import PageErrorBoundary from "@/components/page-error-boundary";
import ProjectsListClient from "@/components/projects/projects-list";

export const revalidate = 0; // Отключаем кэширование для этой страницы

export default async function ProjectsPage() {
  // Получаем проекты из Supabase
  let projects: Project[] = [];
  
  try {
    projects = await projectsService.getProjects();
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
   
  }

  return (
    <PageErrorBoundary pageName="страница проектов">
      <ProjectsListClient initialProjects={projects} />
    </PageErrorBoundary>
  );
}