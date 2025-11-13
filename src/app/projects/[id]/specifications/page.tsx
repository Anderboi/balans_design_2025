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

      <span>{id}</span>
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
