import { Suspense } from "react";
import TasksBlockLoader from "../components/tasks-block-loader";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

export default async function TasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const project = await projectsService.getProjectById(id, supabase);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="space-y-6 shrink-0">
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
                Задачи
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl text-zinc-900 tracking-tight">
            Задачи
          </h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Suspense fallback={<div>Загрузка задач...</div>}>
          <TasksBlockLoader id={id} />
        </Suspense>
      </div>
    </div>
  );
}
