"use server";

import { createClient } from "@/lib/supabase/server";
import { projectsService } from "@/lib/services/projects";
import { revalidatePath } from "next/cache";
import { CreateRoomData, roomsService } from "../services/rooms";
import { contactsService } from "../services/contacts";
import { CommonFormValues } from "../schemas/brief-schema";

export async function updateProjectBriefAction(
  projectId: string,
  data: Record<string, unknown>,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await projectsService.updateProjectBrief(projectId, data, supabase);

    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}/brief/engineering`);
    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating project brief:", error);
    return { success: false, error: "Failed to update project brief" };
  }
}

export async function updateRoomsAction(
  projectId: string,
  rooms: CreateRoomData[],
) {
  try {
    const supabase = await createClient();
    await roomsService.bulkUpsertRooms(projectId, rooms, supabase);

    revalidatePath(`/projects/${projectId}/brief/rooms`);
    revalidatePath(`/projects/${projectId}/brief/engineering`);
    revalidatePath(`/projects/${projectId}/brief/construction`);
    revalidatePath(`/projects/${projectId}/brief/furnishing`);
    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating rooms:", error);
    return { success: false, error: "Failed to update rooms" };
  }
}

export async function updateCommonInfoAction(
  projectId: string,
  data: CommonFormValues,
  contactId?: string,
) {
  try {
    const supabase = await createClient();

    // 1. Update Project Data
    await projectsService.updateProject(
      projectId,
      {
        address: data.address,
        area: data.area,
      },
      supabase,
    );

    // 2. Update Brief General Info
    await projectsService.updateProjectBrief(
      projectId,
      {
        general_info: {
          contractNumber: data.contractNumber,
          startDate: data.startDate,
          finalDate: data.finalDate,
        },
      },
      supabase,
    );

    // 3. Update Contact Data
    if (contactId) {
      const fullName = `${data.clientName} ${data.clientSurname}`.trim();
      await contactsService.updateContact(
        contactId,
        {
          name: fullName,
          email: data.email,
          phone: data.phone,
        },
        supabase,
      );
    }

    // 4. Mark stage item as completed (if not already)
    await projectsService.toggleProjectStageItem(
      projectId,
      "preproject",
      "object_info",
      true,
      supabase,
    );

    revalidatePath(`/projects/${projectId}/brief/general`);
    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}/object-info`);
    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating common info:", error);
    return { success: false, error: "Failed to update common info" };
  }
}
