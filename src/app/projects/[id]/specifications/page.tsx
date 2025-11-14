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
import Image from "next/image";

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

  const materials = [{ name: "Плитка", type: "Отделка" }];

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
        {materials.map((material, key) => (
          <div
            key={key}
            className="w-full p-2 bg-neutral-100 flex rounded-xl items-center gap-2"
          >
            <Input
              className="bg-white w-16"
              value={`${getInitials(material.type)}-${key + 1}`}
            />
            <div className="bg-white w-full p-2 rounded-lg flex gap-2">
              {
                <Image
                  src={""}
                  alt="product_image"
                  className="bg-neutral-200 rounded-md"
                  height={120}
                  width={120}
                />
              }
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                <span>{material.name}</span>
                <span>{material.name}</span>
                <span>{material.name}</span>
                <span>{material.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
