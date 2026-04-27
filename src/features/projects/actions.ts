import { projectsService } from "@/lib/services/projects";
import { roomsService } from '@/lib/services/rooms';

import { createClient } from "@/lib/supabase/server";
import { cache } from 'react';

export async function getProjects() {
  try {
    const supabase = await createClient();
    return await projectsService.getProjects(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    throw error;
  }
}

export const getCachedProjectAndBrief = cache(async (id: string) => {
  const supabase = await createClient();
  const [project, brief, rooms] = await Promise.all([
    projectsService.getProjectById(id, supabase),
    projectsService.getProjectBrief(id, supabase),
    roomsService.getRoomsByProjectId(id, supabase),
  ]);
  return { project, brief, rooms };
});
