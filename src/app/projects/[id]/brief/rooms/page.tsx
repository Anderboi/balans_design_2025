import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import MainBlockCard from "@/components/ui/main-block-card";
import { PremisesForm } from "../components/forms/premises-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { ProjectPageHeader } from "@/components/project-page-header";

export default async function BriefRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, rooms] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    roomsService.getRoomsByProjectId(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  const initialData = {
    rooms:
      rooms.length > 0
        ? rooms.map((r) => ({
            name: r.name,
            order: r.order || 0,
            type: (r.type as any) || undefined,
            area: r.area || 0,
          }))
        : [{ name: "", order: 1, type: undefined }],
  };

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Состав помещений"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <MainBlockCard className="p-8 md:p-12">
          <PremisesForm projectId={id} initialData={initialData} />
        </MainBlockCard>
      </div>
    </PageContainer>
  );
}
