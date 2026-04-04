import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { DemolitionForm } from "../components/forms/demolition-form";
import MainBlockCard from "@/components/ui/main-block-card";
import { createClient } from "@/lib/supabase/server";
import { DemolitionType } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";

export default async function BriefDemolitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, brief] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    projectsService.getProjectBrief(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  const initialData =
    (brief?.demolition as Partial<DemolitionType>) || undefined;

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Демонтаж"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <MainBlockCard className="p-8 md:p-12">
          <DemolitionForm projectId={id} initialData={initialData} />
        </MainBlockCard>
      </div>
    </PageContainer>
  );
}
