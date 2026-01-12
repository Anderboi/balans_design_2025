import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";
import MainBlockCard from "@/components/ui/main-block-card";
import { EngineeringForm } from "../components/forms/engineering-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { EngineeringSystemsType } from "@/lib/schemas/brief-schema";

export default async function BriefEngineeringPage({
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
    (brief?.engineering as Partial<EngineeringSystemsType>) || undefined;

  return (
    <PageContainer>
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Инженерные системы"
        />
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <EngineeringForm
          roomList={rooms}
          projectId={id}
          initialData={initialData}
        />
      </MainBlockCard>
    </PageContainer>
  );
}
