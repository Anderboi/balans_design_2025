import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";
import MainBlockCard from "@/components/ui/main-block-card";
import { ConstructionForm } from "../components/forms/construction-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { ConstructionFormValues } from "@/lib/schemas/brief-schema";

export default async function BriefConstructionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, rooms, brief] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    roomsService.getRoomsByProjectId(id, supabase),
    projectsService.getProjectBrief(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  const initialData =
    (brief?.construction as Partial<ConstructionFormValues>) || undefined;

  return (
    <PageContainer>
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Монтаж"
        />
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <ConstructionForm
          projectId={id}
          roomList={rooms}
          initialData={initialData}
        />
      </MainBlockCard>
    </PageContainer>
  );
}
