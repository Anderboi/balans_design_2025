"use server";

import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";
import { CreateRoomData, roomsService } from "../services/rooms";
import { contactsService } from "../services/contacts";
import { CommonFormValues } from "../schemas/brief-schema";
import { withAuth } from "./safe-action";

export async function updateProjectBriefAction(
  projectId: string,
  data: Record<string, unknown>,
) {
  return withAuth(async (_, supabase) => {
    await projectsService.updateProjectBrief(projectId, data, supabase);

    revalidatePath(`/projects/${projectId}/brief`);
    return true;
  });
}

export async function updateRoomsAction(
  projectId: string,
  rooms: CreateRoomData[],
) {
  return withAuth(async (_, supabase) => {
    await roomsService.bulkUpsertRooms(projectId, rooms, supabase);

    revalidatePath(`/projects/${projectId}`, "layout");
    return true;
  });
}

export async function updateCommonInfoAction(
  projectId: string,
  data: CommonFormValues,
  contactId?: string,
) {
  return withAuth(async (_, supabase) => {
    await Promise.all([
      projectsService.updateProject(
        projectId,
        { address: data.address, area: data.area },
        supabase,
      ),
      projectsService.updateProjectBrief(
        projectId,
        { general_info: { ...data } },
        supabase,
      ),
      contactId
        ? contactsService.updateContact(contactId, {
            /* ... */
          })
        : Promise.resolve(),
      projectsService.toggleProjectStageItem(
        projectId,
        "preproject",
        "object_info",
        true,
        supabase,
      ),
    ]);

    revalidatePath(`/projects/${projectId}`, "layout");
    return true;
  });
}
