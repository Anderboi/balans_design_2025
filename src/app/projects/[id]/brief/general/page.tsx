import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";
import { CommonInfoForm } from "@/app/projects/[id]/brief/components/forms/common-info-form";
import MainBlockCard from "@/components/ui/main-block-card";
import { CommonFormValues } from "@/lib/schemas/brief-schema";
import { createClient } from "@/lib/supabase/server";
import { BriefBreadcrumb } from "../components/brief-breadcrumb";

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
      <div className="space-y-8">
        <BriefBreadcrumb
          projectId={id}
          projectName={project.name}
          currentPage="Общая информация"
        />
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Общая информация" />
        <CommonInfoForm
          projectId={id}
          initialData={initialData}
          contactId={project.contacts?.id}
          clientId={project.client_id || undefined}
        />
      </MainBlockCard>
    </PageContainer>
  );
}
