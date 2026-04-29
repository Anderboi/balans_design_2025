// Импорты UI компонентов
import { Button } from "@/components/ui/button";

// Импорты иконок (lucide-react)
import { Sparkles, CircleUser } from "lucide-react";

// Импорты внутренней логики и компонентов
import { projectsService } from "@/lib/services/projects";
import { cache } from "react";
import { notFound } from "next/navigation";
import {
  ProjectStagesLoader,
} from "@/features/projects/components/project-stages-loader";
import { ObjectInfoCard } from "@/features/projects/components/object-info-card";
import { ProjectClientSelector } from "@/features/projects/components/project-client-selector";
import { ProjectNavCards } from "@/features/projects/components/project-nav-cards";

import { createClient } from "@/lib/supabase/server";
import BackLink from "@/components/back-link";
import { Metadata, ResolvingMetadata } from "next";

const getProjectData = cache(async (id: string) => {
  const supabase = await createClient();
  return await projectsService.getProjectById(id, supabase);
});

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectData(id);

  if (!project) {
    return { title: "Проект не найден" };
  }

  return {
    title: project.name, // Вкладка будет: "ЖК Сити Парк | Balans"
    description: `Рабочая область проекта: ${project.address || "Адрес не указан"}`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectData(id);

  if (!project) notFound();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Breadcrumb / Back Link */}
        <BackLink href="/projects" />

        {/* Title Area */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Проект
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold text-zinc-900 mb-2 tracking-tight animate-in fade-in slide-in-from-left-2 duration-700">
              {project.name}
            </h1>
            <p className="text-base text-zinc-500 flex items-center gap-1">
              <span className="flex items-center text-zinc-400 gap-1 bg-white/50 px-3 py-1 rounded-full border border-slate-200/60">
                <CircleUser className="size-4  mr-1" />
                <ProjectClientSelector
                  projectId={id}
                  clientName={project.contacts?.name}
                />
              </span>
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-full cursor-pointer h-12 px-6 //bg-primary //hover:bg-primary/80 text-primary shadow-lg //shadow-primary/20 transition-all font-medium flex items-center gap-2"
          >
            <Sparkles className="size-4" />
            Спросить Balans AI
          </Button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="space-y-6 sm:space-y-10">
        {/* Карточка "Информация об объекте" над стадиями */}
        <ObjectInfoCard
          projectId={id}
          address={project.address}
          area={project.area}
        />

        {/* Quick Access Cards */}
        <ProjectNavCards projectId={id} />
          <ProjectStagesLoader
            projectId={id}
            isStrictMode={project.is_strict_mode ?? true}
          />
      </div>
    </div>
  );
}
