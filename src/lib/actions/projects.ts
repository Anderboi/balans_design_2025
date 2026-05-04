"use server";

import { Project } from "@/types";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";
import { withAuth } from "./safe-action";

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
  return withAuth(async (userId, supabase) => {
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

    revalidatePath("/projects");
    return { success: true, projectId: newProject.id };
  });
}

export async function updateProjectAction(id: string, data: Partial<Project>) {
  return withAuth(async (userId, supabase) => {
    await projectsService.updateProject(id, data, supabase);
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    return { projectId: id };
  });
}

export async function deleteProjectAction(id: string) {
  return withAuth(async (userId, supabase) => {
    await projectsService.deleteProject(id, supabase);
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    return { projectId: id };
  });
}
