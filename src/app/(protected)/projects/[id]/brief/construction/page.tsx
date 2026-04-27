import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { ConstructionForm } from "../components/forms/construction-form";
import { ConstructionFormValues } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWraper from '@/features/projects/components/brief-block-wraper';
import { getCachedProjectAndBrief } from '@/features/projects/actions';

export default async function BriefConstructionPage({
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
    (brief?.construction as Partial<ConstructionFormValues>) || undefined;

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

      <BriefBlockWraper>
        <ConstructionForm
          projectId={id}
          roomList={rooms}
          initialData={initialData}
        />
      </BriefBlockWraper>
    </PageContainer>
  );
}
