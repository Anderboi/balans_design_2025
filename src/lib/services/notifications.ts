// import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/notifications";
import { SupabaseClient } from "@supabase/supabase-js";
import z from 'zod';

const UserIdSchema = z.string().uuid("Неверный userId");

export const notificationsService = {
  /**
   * Получение уведомлений пользователя с пагинацией.
   */
  async getNotifications(
    userId: string,
    options: { limit?: number; cursor?: string } = {},
    supabase: SupabaseClient,
  ): Promise<Notification[]> {
    const parsedId = UserIdSchema.safeParse(userId);
    if (!parsedId.success) return [];

    const { limit = 50, cursor } = options;
    const supabaseClient = supabase;

    let query = supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

       if (cursor) {
         query = query.lt("created_at", cursor);
       }
       const { data, error } = await query;

    if (error) {
      console.error("[notifications] getNotifications:", error.message);
      throw error;
    }

    return (data as Notification[]) ?? [];
  },

  /**
   * Количество непрочитанных уведомлений.
   */
  async getUnreadCount(
    userId: string,
    supabase: SupabaseClient,
  ): Promise<number> {
    if (!UserIdSchema.safeParse(userId).success) return 0;

    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
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
    supabase: SupabaseClient,
  ): Promise<void> {

    const { error } = await supabase
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
  async markAllAsRead(userId: string, supabase: SupabaseClient): Promise<void> {
    if (!UserIdSchema.safeParse(userId).success) return;

    const { error } = await supabase
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
    supabase: SupabaseClient,
  ): Promise<void> {

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Ошибка при удалении уведомления:", error);
      throw error;
    }
  },
};
