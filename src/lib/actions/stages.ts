"use server";

import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";
import { withAuth } from "./safe-action";

export async function toggleStageItemAction(
  projectId: string,
  stageId: string,
  itemId: string,
  completed: boolean,
) {
  return withAuth(async (_, supabase) => {
    await projectsService.toggleProjectStageItem(
      projectId,
      stageId,
      itemId,
      completed,
      supabase,
    );

    revalidatePath(`/projects/${projectId}`);
    return true;
  });
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

    return true;
  });
}

// Приёмка стадии менеджером
export async function acceptStageAction(
  projectId: string,
  stageId: string,
) {
  return withAuth(async (userId, supabase) => {
    await projectsService.acceptStage(
      projectId,
      stageId,
      userId,
      supabase,
    );

    revalidatePath(`/projects/${projectId}`);
    return true;
  });
}
