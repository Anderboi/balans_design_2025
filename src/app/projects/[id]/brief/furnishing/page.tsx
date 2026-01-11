import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";
import MainBlockCard from "@/components/ui/main-block-card";
import { FurnishingForm } from "../components/forms/furnishing-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { EquipmentBlockFormValues } from "@/lib/schemas/brief-schema";

export default async function BriefFurnishingPage({
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
    (brief?.equipment as Partial<EquipmentBlockFormValues>) || undefined;

  return (
    <PageContainer>
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Наполнение помещений"
        />
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <FurnishingForm
          projectId={id}
          initialData={initialData}
          roomList={rooms}
        />
      </MainBlockCard>
    </PageContainer>
  );
}
