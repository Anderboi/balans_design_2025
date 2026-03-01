import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import MainBlockCard from "@/components/ui/main-block-card";
import { FurnishingForm } from "../components/forms/furnishing-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { EquipmentBlockFormValues } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";

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
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Наполнение помещений"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <MainBlockCard className="p-8 md:p-12">
          <FurnishingForm
            projectId={id}
            initialData={initialData}
            roomList={rooms}
          />
        </MainBlockCard>
      </div>
    </PageContainer>
  );
}
