import { Suspense } from "react";
import TeamManagementLoader from "../components/team-management-loader";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/project-page-header";
import PageContainer from "@/components/ui/page-container";

export default async function TeamPage({
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
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Команда"
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Suspense fallback={<div>Loading team...</div>}>
          <TeamManagementLoader id={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
