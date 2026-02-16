import { createClient } from "@/lib/supabase/server";
import { collageVariantsService } from "@/lib/services/collage-variants";
import { projectsService } from "@/lib/services/projects";
import { roomsService } from "@/lib/services/rooms";
import { notFound } from "next/navigation";
import CollagesPageClient from "./page-client";

export default async function CollagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [project, rooms, variants] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    roomsService.getRoomsByProjectId(id, supabase),
    collageVariantsService.getCollageVariants(id, supabase),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <CollagesPageClient
      rooms={rooms}
      variants={variants}
      projectId={id}
      projectName={project.name}
    />
  );
}
