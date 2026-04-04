"use server";

import { createClient } from "@/lib/supabase/server";
import { AppRole } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: AppRole) {
  const supabase = await createClient();

  // Get current user to verify they are admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if current user is admin
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUserProfile?.role !== "admin") {
    return { error: "Unauthorized: Only admins can update roles" };
  }

  // Update the target user's role
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Update user role error:", error);
    return { error: error.message };
  }

  revalidatePath("/settings/team");
  return { success: true };
}
