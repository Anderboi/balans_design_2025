import { supabase } from "../supabase";
import { Participant } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const profilesService = {
  // Получение всех профилей (участников команды)
  async getProfiles(client?: SupabaseClient): Promise<Participant[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .order("full_name");

    if (error) {
      console.error("Ошибка при получении профилей:", error);
      throw error;
    }

    // Adapt database fields to Participant interface
    return (data || []).map((p) => ({
      id: p.id,
      name: p.full_name || "",
      avatar: p.avatar_url || undefined,
    }));
  },

  // Получение профиля по ID
  async getProfileById(
    id: string,
    client?: SupabaseClient,
  ): Promise<Participant | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      console.error(`Ошибка при получении профиля ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      name: data.full_name || "",
      avatar: data.avatar_url || undefined,
    };
  },

  // Обновление профиля
  async updateProfile(
    id: string,
    updates: {
      full_name?: string;
      avatar_url?: string;
      email?: string;
      company?: string;
      first_name?: string;
      last_name?: string;
      notifications_new_tasks?: boolean;
      notifications_comments?: boolean;
      notifications_project_statuses?: boolean;
      notifications_file_uploads?: boolean;
      notifications_marketing?: boolean;
    },
    client?: SupabaseClient,
  ): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("profiles")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error(`Ошибка при обновлении профиля ${id}:`, error);
      throw error;
    }
  },
};
