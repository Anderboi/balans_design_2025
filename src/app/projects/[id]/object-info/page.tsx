import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";
import { ObjectCardSection } from "./components/object-card-section";
import { LocationLogisticsSection } from "./components/location-logistics-section";
import { TechnicalConditionsSection } from "./components/technical-conditions-section";
import { ResponsiblePersonSection } from "./components/responsible-person-section";
import { DocumentationPlansSection } from "./components/documentation-plans-section";
import { PhotoFixationSection } from "./components/photo-fixation-section";

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

  return (
    <PageContainer>
      {/* Header & Breadcrumbs */}
      <div className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${id}`}>{project.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="size-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Информация по объекту
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title="Информация по объекту" />
      </div>

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
        <ResponsiblePersonSection data={objectInfo.responsiblePerson} />
        <DocumentationPlansSection data={objectInfo.documents} />
        {/* <PhotoFixationSection data={objectInfo.photos} /> */}
      </div>
    </PageContainer>
  );
}
