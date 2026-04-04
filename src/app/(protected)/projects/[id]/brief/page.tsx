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
import { Button } from "@/components/ui/button";
import { BriefSectionsGrid } from "./components/brief-section-grid";
import PageHeader from "@/components/ui/page-header";
import PageContainer from "@/components/ui/page-container";

import { createClient } from "@/lib/supabase/server";

export default async function BriefPage({
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
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Техническое задание
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title="Техническое задание" />
      </div>

      {/* Main Content Info */}
      <div className="text-center space-y-6 max-w-2xl mx-auto pt-10">
        <div className="space-y-2">
          {/* <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            Техническое задание
          </p> */}
          <h2 className="text-5xl font-medium tracking-tight text-zinc-900">
            Заполните анкету
          </h2>
        </div>

        <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
          Для создания идеального интерьера нам нужно узнать вас лучше. Вы
          можете заполнять разделы в любом порядке.
        </p>

        <div className="pt-4 flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400">
            {brief?.sections_completed
              ? Math.round(
                  ((brief.sections_completed as string[]).length / 8) * 100,
                )
              : 0}
            %
          </span>
          {/* Progress bar could go here if needed, but the design shows just the percentage for now */}
        </div>
      </div>

      {/* Grid */}
      <BriefSectionsGrid
        completedSections={(brief?.sections_completed as string[]) || []}
      />

      {/* Footer Action */}
      <div className="flex justify-center pt-10">
        <Button
          variant="outline"
          className="rounded-full px-8 py-6 border-gray-100/80 text-gray-500 hover:text-black hover:bg-gray-50/50 shadow-sm transition-all"
        >
          Скачать анкету в PDF
        </Button>
      </div>
    </PageContainer>
  );
}
