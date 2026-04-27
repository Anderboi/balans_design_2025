import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { ResidentsForm } from "../components/forms/residents-form";
import { ResidentsFormValues } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import BriefBlockWraper from "@/features/projects/components/brief-block-wraper";
import { getCachedProjectAndBrief } from "@/features/projects/actions";

export default async function BriefResidentsPage({
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
    (brief?.residents as Partial<ResidentsFormValues>) || undefined;

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Проживающие"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWraper>
        <ResidentsForm projectId={id} initialData={initialData} />
      </BriefBlockWraper>
    </PageContainer>
  );
}
