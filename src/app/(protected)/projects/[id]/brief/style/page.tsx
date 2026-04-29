import { notFound } from "next/navigation";
import { StyleForm } from "../components/forms/style-form";
import PageContainer from "@/components/ui/page-container";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWrapper from '@/features/projects/components/brief-block-wraper';
import { getCachedProjectAndBrief } from '@/features/projects/actions';

export default async function BriefStylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {project, brief} = await getCachedProjectAndBrief(id);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Стилевые предпочтения"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWrapper>
        <StyleForm
          projectId={id}
          initialData={
            brief?.style as
              | { preferences?: string; pinterestLink?: string }
              | undefined
          }
        />
      </BriefBlockWrapper>
    </PageContainer>
  );
}
