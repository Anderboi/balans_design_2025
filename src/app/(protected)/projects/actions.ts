import { projectsService } from "@/lib/services/projects";

import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
  try {
    const supabase = await createClient();
    return await projectsService.getProjects(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    throw error;
  }
}
