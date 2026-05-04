import { notFound } from "next/navigation";
import { ConstructionFormValues } from "@/lib/schemas/brief-schema";
import { getCachedProjectAndBriefAndRooms } from "@/features/projects/actions";
import PageContainer from '@/components/ui/page-container';
import { ProjectPageHeader } from '@/components/project-page-header';
import BriefBlockWrapper from '@/features/projects/components/brief-block-wraper';
import { ConstructionForm } from '../components/forms/construction-form';

export default async function BriefConstructionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, brief, rooms } = await getCachedProjectAndBriefAndRooms(id);

  if (!project) {
    notFound();
  }

  const initialData =
    (brief?.construction as Partial<ConstructionFormValues>) || {};

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Монтаж"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWrapper>
        <ConstructionForm
          projectId={id}
          roomList={rooms}
          initialData={initialData}
        />
      </BriefBlockWrapper>
    </PageContainer>
  );
}
