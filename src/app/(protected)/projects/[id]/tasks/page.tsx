import { Suspense } from "react";
import TasksBlockLoader from "../components/tasks-block-loader";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/project-page-header";
import PageContainer from "@/components/ui/page-container";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const project = await projectsService.getProjectById(id, supabase);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-8 h-full flex flex-col">
        <ProjectPageHeader
          projectId={id}
          projectName={project.name}
          title="Задачи"
        />

        <div className="flex-1 min-h-0 overflow-hidden mt-4">
          <Suspense fallback={<div>Загрузка задач...</div>}>
            <TasksBlockLoader id={id} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
