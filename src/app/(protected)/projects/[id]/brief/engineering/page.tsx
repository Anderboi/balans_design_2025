import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { EngineeringForm } from "../components/forms/engineering-form";
import { EngineeringSystemsType } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWraper from '@/features/projects/components/brief-block-wraper';
import { getCachedProjectAndBrief } from '@/features/projects/actions';

export default async function BriefEngineeringPage({
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
    (brief?.engineering as Partial<EngineeringSystemsType>) || undefined;

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Инженерные системы"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWraper>
        <EngineeringForm
          roomList={rooms}
          projectId={id}
          initialData={initialData}
        />
      </BriefBlockWraper>
    </PageContainer>
  );
}
