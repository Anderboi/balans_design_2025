import PageContainer from "@/components/ui/page-container";
import { projectsService } from "@/lib/services/projects";
import { materialsService } from "@/lib/services/materials";
import MaterialListControls from "../components/material-list-controls";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectPageHeader } from "@/components/project-page-header";
import { AddMaterialButton } from "./components/add-material-button";
import { getSuppliers, getSupplierCompanies } from "@/app/materials/actions";

const ScheduleCategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { id } = await params;
  const { schedule } = await searchParams;
  const scheduleName = schedule || "Спецификации";

  const supabase = await createClient();

  const [projectInfo, specifications, suppliers, supplierCompanies] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    materialsService.getSpecifications(id, supabase),
    getSuppliers(),
    getSupplierCompanies(),
  ]);

  if (!projectInfo) {
    notFound();
  }

  return (
    <PageContainer>
      <ProjectPageHeader
        projectId={id}
        projectName={projectInfo.name}
        title={scheduleName}
        subtitle={`${specifications.length} позиции`}
      >
        <AddMaterialButton
          projectId={id}
          initialSuppliers={suppliers}
          initialSupplierCompanies={supplierCompanies}
        />
      </ProjectPageHeader>

      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <MaterialListControls materials={specifications} />
      </div>
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
