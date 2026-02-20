"use server";

import { createClient } from "@/lib/supabase/server";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";

export async function syncPlanningStatusAction(projectId: string) {
  try {
    const supabase = await createClient();
    await projectsService.syncPlanningStatus(projectId, supabase);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error syncing planning status:", error);
    return { success: false, error: "Failed to sync planning status" };
  }
}

export async function syncCollagesStatusAction(projectId: string) {
  try {
    const supabase = await createClient();
    await projectsService.syncCollagesStatus(projectId, supabase);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error syncing collages status:", error);
    return { success: false, error: "Failed to sync collages status" };
  }
}

export async function syncVisualizationsStatusAction(projectId: string) {
  try {
    const supabase = await createClient();
    await projectsService.syncVisualizationsStatus(projectId, supabase);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error syncing visualizations status:", error);
    return { success: false, error: "Failed to sync visualizations status" };
  }
}
