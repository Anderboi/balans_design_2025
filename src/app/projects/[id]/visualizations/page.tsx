import { createClient } from "@/lib/supabase/server";
import { visualizationVariantsService } from "@/lib/services/visualization-variants";
import { projectsService } from "@/lib/services/projects";
import { roomsService } from "@/lib/services/rooms";
import { notFound } from "next/navigation";
import VisualizationsPageClient from "./page-client";

export default async function VisualizationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, rooms, variants] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    roomsService.getRoomsByProjectId(id, supabase),
    visualizationVariantsService.getVisualizationVariants(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <VisualizationsPageClient
      rooms={rooms}
      variants={variants}
      projectId={id}
      projectName={project.name}
    />
  );
}
