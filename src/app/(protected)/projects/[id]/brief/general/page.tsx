import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { CommonInfoForm } from "@/app/(protected)/projects/[id]/brief/components/forms/common-info-form";
import MainBlockCard from "@/components/ui/main-block-card";
import { CommonFormValues } from "@/lib/schemas/brief-schema";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/project-page-header";

export default async function BriefGeneralPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [project, brief] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    projectsService.getProjectBrief(id, supabase),
  ]);

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

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <MainBlockCard className="p-8 md:p-12">
          <CommonInfoForm
            projectId={id}
            initialData={initialData}
            contactId={project.contacts?.id}
            clientId={project.client_id || undefined}
          />
        </MainBlockCard>
      </div>
    </PageContainer>
  );
}
