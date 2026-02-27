// Импорты UI компонентов
import { Button } from "@/components/ui/button";

// Импорты иконок (lucide-react)
import { Sparkles, ChevronLeft, CircleUser } from "lucide-react";

// Импорты внутренней логики и компонентов
import { projectsService } from "@/lib/services/projects";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ProjectStagesLoader,
  ProjectStagesSkeleton,
} from "../components/project-stages-loader";
import { ObjectInfoCard } from "../components/object-info-card";
import { ProjectClientSelector } from "../components/project-client-selector";
import { ProjectNavCards } from "../components/project-nav-cards";

export const revalidate = 0;

import { createClient } from "@/lib/supabase/server";

async function getProjectData(id: string) {
  const supabase = await createClient();
  return await projectsService.getProjectById(id, supabase);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  const address = project.address || "Адрес не указан";

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="size-4 mr-1" />
          Назад к списку
        </Link>

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
              {/* <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full border border-slate-200/60">
                {address}
              </span>
              <span className="mx-2 text-zinc-500">•</span> */}
              <span className="flex items-center text-zinc-400 gap-1 bg-white/50 px-3 py-1 rounded-full border border-slate-200/60">
                <CircleUser className="size-4  mr-1" />
                <ProjectClientSelector
                  projectId={id}
                  clientName={project.contacts?.name}
                />
              </span>
            </p>
          </div>

          <Button className="rounded-full h-12 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-200/50 transition-all font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Спросить Balans AI
          </Button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="space-y-10">
        {/* Карточка "Информация об объекте" над стадиями */}
        <ObjectInfoCard
          projectId={id}
          address={project.address}
          area={project.area}
        />

        {/* Quick Access Cards */}
        <ProjectNavCards projectId={id} />

        <Suspense fallback={<ProjectStagesSkeleton />}>
          <ProjectStagesLoader
            projectId={id}
            isStrictMode={project.is_strict_mode ?? true}
          />
        </Suspense>
      </div>
    </div>
  );
}
