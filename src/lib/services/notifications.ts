import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/notifications";
import { SupabaseClient } from "@supabase/supabase-js";

export const notificationsService = {
  /**
   * Получение уведомлений пользователя с пагинацией.
   */
  async getNotifications(
    userId: string,
    options: { limit?: number; offset?: number } = {},
    client?: SupabaseClient,
  ): Promise<Notification[]> {
    const { limit = 50, offset = 0 } = options;
    const supabaseClient = client || supabase;

    const { data, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Ошибка при получении уведомлений:", error);
      throw error;
    }

    return (data as Notification[]) || [];
  },

  /**
   * Количество непрочитанных уведомлений.
   */
  async getUnreadCount(
    userId: string,
    client?: SupabaseClient,
  ): Promise<number> {
    const supabaseClient = client || supabase;

    const { count, error } = await supabaseClient
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Ошибка при получении количества непрочитанных:", error);
      return 0;
    }

    return count ?? 0;
  },

  /**
   * Отметить уведомление как прочитанное.
   */
  async markAsRead(
    notificationId: string,
    client?: SupabaseClient,
  ): Promise<void> {
    const supabaseClient = client || supabase;

    const { error } = await supabaseClient
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Ошибка при отметке уведомления прочитанным:", error);
      throw error;
    }
  },

  /**
   * Отметить все уведомления пользователя как прочитанные.
   */
  async markAllAsRead(userId: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;

    const { error } = await supabaseClient
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Ошибка при отметке всех уведомлений прочитанными:", error);
      throw error;
    }
  },

  /**
   * Удалить уведомление.
   */
  async deleteNotification(
    notificationId: string,
    client?: SupabaseClient,
  ): Promise<void> {
    const supabaseClient = client || supabase;

    const { error } = await supabaseClient
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Ошибка при удалении уведомления:", error);
      throw error;
    }
  },
};
