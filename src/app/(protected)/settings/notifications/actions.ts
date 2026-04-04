"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profilesService } from "@/lib/services/profiles";

export async function updateNotificationSettings(settings: {
  notifications_new_tasks: boolean;
  notifications_comments: boolean;
  notifications_project_statuses: boolean;
  notifications_file_uploads: boolean;
  notifications_marketing: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    await profilesService.updateProfile(user.id, settings, supabase);
    revalidatePath("/settings/notifications");
    return { success: true };
  } catch (error) {
    console.error("Update notification settings error:", error);
    return { error: "Failed to update notification settings" };
  }
}
