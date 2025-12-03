import PageContainer from "@/components/ui/page-container";
import BlockHeader from "../components/block-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import { projectsService } from "@/lib/services/projects";
import { materialsService } from "@/lib/services/materials";
import MaterialListControls from "../components/material-list-controls";

const ScheduleCategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { id } = await params;
  const { schedule: scheduleName } = await searchParams;

  const [projectInfo, specifications] = await Promise.all([
    projectsService.getProjectById(id),
    materialsService.getSpecifications(id),
  ]);

  // const materials = specifications
  //   .map((spec) => spec.material)
  //   .filter((material) => material !== null && material !== undefined);

  return (
    <PageContainer>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/projects/${id}`}>
                {projectInfo && projectInfo.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{scheduleName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BlockHeader
        title={scheduleName}
        href={``}
        buttontext="Добавить материал"
      />

      <MaterialListControls materials={specifications} />
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
