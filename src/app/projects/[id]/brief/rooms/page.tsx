import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";
import MainBlockCard from "@/components/ui/main-block-card";
import { PremisesForm } from "../components/forms/premises-form";
import { createClient } from "@/lib/supabase/server";
import { roomsService } from "@/lib/services/rooms";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";

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
            order: r.order,
            type: r.type,
            area: r.area,
          }))
        : [{ name: "", order: 1, type: undefined }],
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Состав помещений"
        />

        {/* <PageHeader title="Состав помещений" /> */}
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Состав помещений" />
        <PremisesForm projectId={id} initialData={initialData} />
      </MainBlockCard>
    </PageContainer>
  );
}
