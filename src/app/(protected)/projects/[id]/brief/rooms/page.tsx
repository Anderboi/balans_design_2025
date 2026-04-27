import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { PremisesForm } from "../components/forms/premises-form";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWraper from "@/features/projects/components/brief-block-wraper";
import { getCachedProjectAndBrief } from "@/features/projects/actions";

export default async function BriefRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, rooms } = await getCachedProjectAndBrief(id);

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

      <BriefBlockWraper>
        <PremisesForm projectId={id} initialData={initialData} />
      </BriefBlockWraper>
    </PageContainer>
  );
}
