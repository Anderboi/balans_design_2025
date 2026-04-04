import { createClient } from "@/lib/supabase/server";
import { planningVariantsService } from "@/lib/services/planning-variants";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PlanningPageClient from "./page-client";

export default async function PlanningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, variants] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    planningVariantsService.getPlanningVariants(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <PlanningPageClient
      initialVariants={variants}
      projectId={id}
      projectName={project.name}
    />
  );
}
