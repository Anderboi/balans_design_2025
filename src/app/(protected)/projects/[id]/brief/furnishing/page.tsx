import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { FurnishingForm } from "../components/forms/furnishing-form";
import { EquipmentBlockFormValues } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWraper from "@/features/projects/components/brief-block-wraper";
import { getCachedProjectAndBrief } from "@/features/projects/actions";

export default async function BriefFurnishingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, brief, rooms } = await getCachedProjectAndBrief(id);

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

      <BriefBlockWraper>
        <FurnishingForm
          projectId={id}
          initialData={initialData}
          roomList={rooms}
        />
      </BriefBlockWraper>
    </PageContainer>
  );
}
