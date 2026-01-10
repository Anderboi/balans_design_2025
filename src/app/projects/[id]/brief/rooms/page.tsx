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
import MainBlockCard from '@/components/ui/main-block-card';
import { PremisesForm } from '../components/forms/premises-form';

export default async function BriefRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await projectsService.getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${id}`}>{project.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${id}/brief`}>Техническое задание</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Состав помещений
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* <PageHeader title="Состав помещений" /> */}
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Состав помещений" />
        <PremisesForm projectId={id}/>
      </MainBlockCard>
      
    </PageContainer>
  );
}
