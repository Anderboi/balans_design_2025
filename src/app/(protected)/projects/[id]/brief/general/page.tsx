import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { CommonInfoForm } from "@/app/(protected)/projects/[id]/brief/components/forms/common-info-form";
import { CommonFormValues } from "@/lib/schemas/brief-schema";
import { ProjectPageHeader } from "@/components/project-page-header";
import {
  getCachedProjectAndBrief
} from "@/features/projects/actions";
import BriefBlockWrapper from "@/features/projects/components/brief-block-wraper";

export default async function BriefGeneralPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { brief, project } = await getCachedProjectAndBrief(id);

  if (!project) {
    notFound();
  }

  // Parse contact name if available
  const contactName = project.contacts?.name || "";
  const [firstName, ...lastNameParts] = contactName.split(" ");
  const lastName = lastNameParts.join(" ");

  // Extract general info from brief if available
  const generalInfo = (brief?.general_info as Record<string, any>) || {};

  const initialData: CommonFormValues = {
    clientName: firstName || "",
    clientSurname: lastName || "",
    email: project.contacts?.email || "",
    phone: project.contacts?.phone || "",
    address: project.address || "",
    area: project.area || 0,
    contractNumber: generalInfo.contractNumber || "",
    startDate: generalInfo.startDate || "",
    finalDate: generalInfo.finalDate || "",
  };

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Общая информация"
        middleLink={{
          href: `/projects/${id}/brief`,
          label: "Техническое задание",
        }}
      />

      <BriefBlockWrapper>
        <CommonInfoForm
          projectId={id}
          initialData={initialData}
          contactId={project.contacts?.id}
          clientId={project.client_id || undefined}
        />
      </BriefBlockWrapper>
    </PageContainer>
  );
}
