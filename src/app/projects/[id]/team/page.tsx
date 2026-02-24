import { Suspense } from "react";
import TeamManagementLoader from "../components/team-management-loader";
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

export default async function TeamPage({
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
    <div className="space-y-8">
      <div className="space-y-6">
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
                Команда
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl md:text-5xl text-zinc-900 tracking-tight">
          Команда
        </h1>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Suspense fallback={<div>Loading team...</div>}>
          <TeamManagementLoader id={id} />
        </Suspense>
      </div>
    </div>
  );
}
