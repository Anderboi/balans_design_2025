import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";
import { ObjectCardSection } from "../../../../../features/projects/components/object-info/components/object-card-section";
import { LocationLogisticsSection } from "../../../../../features/projects/components/object-info/components/location-logistics-section";
import { TechnicalConditionsSection } from "../../../../../features/projects/components/object-info/components/technical-conditions-section";
import { ResponsiblePersonSection } from "../../../../../features/projects/components/object-info/components/responsible-person-section";
import { DocumentationPlansSection } from "../../../../../features/projects/components/object-info/components/documentation-plans-section";
import { ProjectPageHeader } from "@/components/project-page-header";

export default async function ObjectInfoPage({
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

  // Extract object info from brief if available
  const objectInfo = (brief?.object_info as Record<string, any>) || {};
  const locationData = objectInfo.location || {};

  // Prepare initial data for LocationLogisticsSection
  const locationLogisticsInitialData = {
    floor: locationData.floor,
    entrance: locationData.entrance,
    code: locationData.code,
    passengerLift: locationData.passengerLift || {},
    freightLift: locationData.freightLift || {},
    logisticsRules: locationData.logisticsRules,
  };

  // Prepare initial data for TechnicalConditionsSection
  const technicalConditionsData = objectInfo.technicalConditions || {};
  const technicalConditionsInitialData = {
    voltageCapacity: technicalConditionsData.voltageCapacity,
    coolingCapacity: technicalConditionsData.coolingCapacity,
    recommendations: technicalConditionsData.recommendations,
    attachments: technicalConditionsData.attachments || [],
  };

  // Prepare initial data for ResponsiblePersonSection
  const responsiblePersonData = objectInfo.responsiblePerson || {};
  const responsiblePersonInitialData = {
    fullName: responsiblePersonData.fullName,
    position: responsiblePersonData.position,
    phone: responsiblePersonData.phone,
  };

  return (
    <PageContainer>
      {/* Header & Breadcrumbs */}
      <ProjectPageHeader
        projectId={id}
        projectName={project.name}
        title="Информация по объекту"
      />

      {/* Main Content */}
      <div className="space-y-6 mt-8">
        <ObjectCardSection projectId={id} />
        <LocationLogisticsSection
          projectId={id}
          projectAddress={project.address || ""}
          initialData={locationLogisticsInitialData}
        />
        <TechnicalConditionsSection
          projectId={id}
          initialData={technicalConditionsInitialData}
        />
        <ResponsiblePersonSection
          projectId={id}
          initialData={responsiblePersonInitialData}
        />
        <DocumentationPlansSection
          projectId={id}
          initialData={objectInfo.documents || []}
        />
        {/* <PhotoFixationSection data={objectInfo.photos} /> */}
      </div>
    </PageContainer>
  );
}
