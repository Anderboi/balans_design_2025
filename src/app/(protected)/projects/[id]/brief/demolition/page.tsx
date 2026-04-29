import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { DemolitionForm } from "../components/forms/demolition-form";
import { DemolitionType } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWrapper from '@/features/projects/components/brief-block-wraper';
import { getCachedProjectAndBrief } from '@/features/projects/actions';

export default async function BriefDemolitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, brief } = await getCachedProjectAndBrief(id);

  if (!project) {
    notFound();
  }

  const initialData =
    (brief?.demolition as Partial<DemolitionType>) || undefined;

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Демонтаж"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWrapper>
        <DemolitionForm projectId={id} initialData={initialData} />
      </BriefBlockWrapper>
    </PageContainer>
  );
}
