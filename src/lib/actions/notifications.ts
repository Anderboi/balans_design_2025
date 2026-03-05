"use server";

import { createClient } from "@/lib/supabase/server";
import { notificationsService } from "@/lib/services/notifications";
import { Notification } from "@/types/notifications";

/**
 * Получить уведомления текущего пользователя (SSR).
 */
export async function getNotificationsAction(): Promise<{
  notifications: Notification[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: [], error: "Not authenticated" };
  }

  try {
    const notifications = await notificationsService.getNotifications(
      user.id,
      { limit: 50 },
      supabase,
    );
    return { notifications };
  } catch {
    return { notifications: [], error: "Failed to fetch notifications" };
  }
}

/**
 * Отметить уведомление как прочитанное.
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    await notificationsService.markAsRead(notificationId, supabase);
    return {};
  } catch {
    return { error: "Failed to mark notification as read" };
  }
}

/**
 * Отметить все уведомления как прочитанные.
 */
export async function markAllNotificationsAsRead(): Promise<{
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    await notificationsService.markAllAsRead(user.id, supabase);
    return {};
  } catch {
    return { error: "Failed to mark all notifications as read" };
  }
}

/**
 * Удалить уведомление.
 */
export async function deleteNotificationAction(
  notificationId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    await notificationsService.deleteNotification(notificationId, supabase);
    return {};
  } catch {
    return { error: "Failed to delete notification" };
  }
}
