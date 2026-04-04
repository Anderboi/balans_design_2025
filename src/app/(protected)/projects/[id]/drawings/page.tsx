import { createClient } from "@/lib/supabase/server";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { projectsService } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import DrawingsPageClient from './page-client';

export default async function DrawingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, drawingSets] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    drawingSetsService.getDrawingSets(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <DrawingsPageClient
      initialDrawings={drawingSets}
      projectId={id}
      projectName={project.name}
    />
  );
}
