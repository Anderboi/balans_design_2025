"use server";

import { createClient } from "@/lib/supabase/server";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";

interface CreateProjectFormData {
  name: string;
  address?: string;
  area?: number;
  client_id: string | null;
  stage: string;
  residents?: string;
  demolition_info?: string;
  construction_info?: string;
}

export async function createProjectAction(formData: CreateProjectFormData) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 2. Service call
    const newProject = await projectsService.createProject(formData, supabase);

    // 3. Revalidate
    revalidatePath("/projects");
    return { success: true, projectId: newProject.id };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла непредвиденная ошибка";
    console.error("Unexpected error:", error);
    return { success: false, error: errorMessage };
  }
}
