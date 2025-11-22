"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProjectRole =
  | "owner"
  | "lead_designer"
  | "designer"
  | "project_manager"
  | "client";

export async function addProjectMember(
  projectId: string,
  email: string,
  role: ProjectRole
) {
  console.log("Server Action: addProjectMember", { projectId, email, role });
  const supabase = await createClient();

  try {
    // 1. Find the user by email in the profiles table using Service Role (bypass RLS)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error("No SUPABASE_SERVICE_ROLE_KEY");
      return { success: false, error: "Configuration error" };
    }

    const { createClient: createSupabaseClient } = await import(
      "@supabase/supabase-js"
    );
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found or error:", profileError);
      return { success: false, error: "Пользователь с таким email не найден" };
    }

    console.log("Found profile:", profile);

    // 2. Add the user to the project_members table using User Client (enforce RLS for adding members)
    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: profile.id,
        role: role,
      });

    if (memberError) {
      console.error("Error adding member to DB:", memberError);
      if (memberError.code === "23505") {
        return { success: false, error: "Пользователь уже добавлен в проект" };
      }
      return { success: false, error: "Не удалось добавить участника" };
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in addProjectMember:", error);
    return { success: false, error: "Произошла непредвиденная ошибка" };
  }
}

interface RawMember {
  id: string;
  role: ProjectRole;
  user:
    | {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
      }
    | {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
      }[];
}

export async function getProjectMembers(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .select(
      `
      id,
      role,
      user:profiles (
        id,
        full_name,
        email,
        avatar_url
      )
    `
    )
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }

  // Supabase might return user as an array if the relationship is not detected as 1:1
  // We need to cast or transform it.
  return (data as unknown as RawMember[]).map((member) => ({
    ...member,
    user: Array.isArray(member.user) ? member.user[0] : member.user,
  }));
}

export async function removeProjectMember(projectId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing member:", error);
      return { success: false, error: "Не удалось удалить участника" };
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Произошла непредвиденная ошибка" };
  }
}

export async function searchProfiles(query: string) {
  const supabase = await createClient();

  if (!query || query.length < 2) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5);

  if (error) {
    console.error("Error searching profiles:", error);
    return [];
  }

  return data;
}

export async function inviteUser(
  projectId: string,
  email: string,
  role: ProjectRole
) {
  const supabase = await createClient();

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return addProjectMember(projectId, email, role);
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return {
      success: false,
      error: "Не настроен ключ администратора для приглашений",
    };
  }

  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: inviteData, error: inviteError } =
    await adminAuthClient.auth.admin.inviteUserByEmail(email);

  if (inviteError) {
    console.error("Error inviting user:", inviteError);
    return { success: false, error: "Не удалось пригласить пользователя" };
  }

  if (inviteData.user) {
    // Wait a moment for trigger to create profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: inviteData.user.id,
        role: role,
      });

    if (memberError) {
      console.error("Error adding invited member:", memberError);
      return {
        success: true,
        message:
          "Приглашение отправлено. Пользователь будет добавлен после регистрации.",
      };
    }

    revalidatePath(`/projects/${projectId}`);
    return {
      success: true,
      message: "Пользователь приглашен и добавлен в проект",
    };
  }

  return { success: false, error: "Не удалось создать приглашение" };
}
