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
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils/utils";
import SpecMaterialCard from "./components/spec-material-card";
import { Material, MaterialType, SpecificationMaterial } from "@/types";
import { materialsService } from '@/lib/services/materials';

const ScheduleCategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const searchTerm = await searchParams;
  const scheduleName = searchTerm.schedule;
  const resolvedParams = await params;
  const id = resolvedParams.id;


  const projectInfo = await projectsService.getProjectById(id);

  const specMaterials = await materialsService.getSpecifications(id);

  // const testMaterials: SpecificationMaterial[] = [
  //   { name: "Плитка", type: MaterialType.FINISH, id: "1" },
  //   { name: "Плитка", type: MaterialType.FINISH, id: "2" },
  //   { name: "Плитка", type: MaterialType.FINISH, id: "3" },
  // ];

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

      <div>
        {specMaterials.map((material, key) => (
          <div
            key={key}
            className="w-full p-1 mb-2 bg-neutral-100 flex rounded-lg items-start gap-1"
          >
            {/* <Input
              className="bg-white w-14 h-14"
              value={`${getInitials(material.type)}-${key + 1}`}
            /> */}
            <SpecMaterialCard material={material} />
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
