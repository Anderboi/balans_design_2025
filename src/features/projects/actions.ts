import { projectsService } from "@/lib/services/projects";
import { roomsService } from "@/lib/services/rooms";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getProjects = cache(async () => {
  try {
    const supabase = await createClient();
    return await projectsService.getProjects(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    throw error;
  }
});

export const getCachedProjectAndBriefAndRooms = cache(async (id: string) => {
  const supabase = await createClient();

  try {
    const project = await projectsService.getProjectById(id, supabase);
    const brief = await projectsService.getProjectBrief(id, supabase);
    const rooms = await roomsService.getRoomsByProjectId(id, supabase);

    return { project, brief, rooms };
  } catch (error) {
    console.error("Ошибка при получении данных проекта:", error);
    // В случае ошибки возвращаем null для проекта, чтобы страница показала notFound()
    return { project: null, brief: null, rooms: [] };
  }
});

export const getCachedProjectAndBrief = cache(async (id: string) => {
  const supabase = await createClient();

  try {
    const project = await projectsService.getProjectById(id, supabase);
    const brief = await projectsService.getProjectBrief(id, supabase);

    return { project, brief };
  } catch (error) {
    console.error("Ошибка при получении данных проекта:", error);
    // В случае ошибки возвращаем null для проекта, чтобы страница показала notFound()
    return { project: null, brief: null };
  }
});
