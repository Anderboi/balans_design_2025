import { Suspense } from "react";
import MediaTabLoader from "../components/media-tab-loader";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/project-page-header";
import PageContainer from "@/components/ui/page-container";

export default async function MediaPage({
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
        title="Медиа"
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8">
        <Suspense fallback={<div>Загрузка медиа...</div>}>
          <MediaTabLoader id={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
