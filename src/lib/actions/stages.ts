"use server";

import { createClient } from "@/lib/supabase/server";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";

export async function toggleStageItemAction(
  projectId: string,
  stageId: string,
  itemId: string,
  completed: boolean
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await projectsService.toggleProjectStageItem(
      projectId,
      stageId,
      itemId,
      completed,
      supabase
    );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling stage item:", error);
    return { success: false, error: "Failed to update stage item" };
  }
}
