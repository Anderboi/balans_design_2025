"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profilesService } from "@/lib/services/profiles";


export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const id = user.id;
  // We need to map form data to profile fields.
  // Assuming the user fills: full_name, company, email.
  const fullName = formData.get("full_name") as string;
  const company = formData.get("company") as string;

  const updates: any = {
    updated_at: new Date().toISOString(),
  };

  if (fullName) {
    updates.full_name = fullName.trim();
  }

  if (company) updates.company = company; // Uncomment if column exists
  // if (email) updates.email = email; // Usually email is from auth, but maybe we store a contact email?

  try {
    await profilesService.updateProfile(id, updates, supabase);
    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    // We can use storageService or direct supabase storage call.
    // storageService uses client supabase, so we might need to adapt it for server or just use standard pattern.
    // But here we are in a server action.
    // Let's reuse storageService logic but adapting it manually because storageService expects a client that might be browser-based?
    // Actually storageService.uploadMaterialImage accepts a client.

    // We need to implement a specific upload for avatars if not exists.
    // Or reuse storageService.uploadMaterialAttachment but checking the bucket.
    // Let's do it directly here for simplicity and to ensure we use the "avatars" bucket if it exists, or "profiles".
    // Usually standard is "avatars".

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      // Fallback to "public" or check if bucket exists?
      // For now assume "profiles" exists or we should create it.
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Update profile
    await profilesService.updateProfile(
      user.id,
      { avatar_url: avatarUrl },
      supabase,
    );

    revalidatePath("/settings/profile");
    return { success: true, avatarUrl };
  } catch (error) {
    console.error("Upload avatar error:", error);
    return { error: "Failed to upload avatar" };
  }
}
