import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";
import { DemolitionForm } from "../components/forms/demolition-form";
import MainBlockCard from "@/components/ui/main-block-card";
import { createClient } from "@/lib/supabase/server";
import { DemolitionType } from "@/lib/schemas/brief-schema";

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
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Демонтаж"
        />
      </div>
      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Демонтаж" />
        <DemolitionForm projectId={id} initialData={initialData} />
      </MainBlockCard>
    </PageContainer>
  );
}
