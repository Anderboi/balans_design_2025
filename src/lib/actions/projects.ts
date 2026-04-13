"use server";

import { Project } from "@/types";
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
  cover?: string | null;
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
    const newProject = await projectsService.createProject(
      {
        name: formData.name,
        address: formData.address ?? null,
        area: formData.area,
        client_id: formData.client_id,
        stage: formData.stage,
        residents: formData.residents,
        demolition_info: formData.demolition_info,
        construction_info: formData.construction_info,
        cover: formData.cover,
      },
      supabase,
    );

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

export async function updateProjectAction(id: string, data: Partial<Project>) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await projectsService.updateProject(id, data, supabase);
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Ошибка при обновлении проекта";
    return { success: false, error: errorMessage };
  }
}
