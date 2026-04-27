"use server";

import { createClient } from "@/lib/supabase/server";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/features/contacts/actions";

export async function toggleStageItemAction(
  projectId: string,
  stageId: string,
  itemId: string,
  completed: boolean,
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
      supabase,
    );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling stage item:", error);
    return { success: false, error: "Failed to update stage item" };
  }
}

export async function completeBriefSectionAction(
  projectId: string,
  sectionId: string,
  completed: boolean,
) {
  return withAuth(async (userId, supabase) => {
    await projectsService.updateBriefSectionStatus(
      projectId,
      sectionId,
      completed,
      supabase,
    );

    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}/brief/${sectionId}`);

    return true;
  });

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await projectsService.updateBriefSectionStatus(
      projectId,
      sectionId,
      completed,
      supabase,
    );

    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}/brief/${sectionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error completing brief section:", error);
    return { success: false, error: "Failed to update brief section status" };
  }
}
