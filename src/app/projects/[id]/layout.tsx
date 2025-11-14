import PageContainer from "@/components/ui/page-container";
import React from "react";
import ProjectHeader from "../components/project-header";
import { projectsService } from "@/lib/services/projects";

export const revalidate = 0; // Отключаем кэширование для этой страницы

const ProjectLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Получаем данные проекта из Supabase
  const project = await projectsService.getProjectById(id);

  return (
    <PageContainer>
      <ProjectHeader id={id} project={project} />
      {children}
    </PageContainer>
  );
};

export default ProjectLayout;
