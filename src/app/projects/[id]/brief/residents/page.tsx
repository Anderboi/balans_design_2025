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
import { ResidentsForm } from "../components/forms/residents-form";
import MainBlockCard from "@/components/ui/main-block-card";

import { createClient } from "@/lib/supabase/server";
import { ResidentsFormValues } from "@/lib/schemas/brief-schema";

export default async function BriefResidentsPage({
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

  const initialData =
    (brief?.residents as Partial<ResidentsFormValues>) || undefined;

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
                Проживающие
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Проживающие" />
        <ResidentsForm projectId={id} initialData={initialData} />
      </MainBlockCard>
    </PageContainer>
  );
}
