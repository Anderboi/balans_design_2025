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
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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

  const [projectInfo, specifications] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    materialsService.getSpecifications(id, supabase),
  ]);

  if (!projectInfo) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${id}`}>{projectInfo.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                {scheduleName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <BlockHeader
          title={scheduleName}
          href={``}
          buttontext="Добавить материал"
        />

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <MaterialListControls materials={specifications} />
        </div>
      </div>
    </PageContainer>
  );
};

export default ScheduleCategoryPage;
