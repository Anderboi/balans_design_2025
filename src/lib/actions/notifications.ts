"use server";

import { notificationsService } from "@/lib/services/notifications";
import { withAuth } from "./safe-action";

//?  Получить уведомления текущего пользователя (SSR).
export async function getNotificationsAction() {
  const result = await withAuth(async (userId, supabase) => {
    return await notificationsService.getNotifications(
      userId,
      { limit: 50 },
      supabase,
    );
  });

  return {
    notifications: result.success ? result.data : [],
    error: result.success ? undefined : result.error,
  };
}

//?  Отметить уведомление как прочитанное.
export async function markNotificationAsRead(notificationId: string) {
  const result = await withAuth(async (_, supabase) => {
    await notificationsService.markAsRead(notificationId, supabase);
    return true;
  });
  return { error: result.success ? undefined : result.error };
}

//?  Отметить все уведомления как прочитанные.
export async function markAllNotificationsAsRead() {
  const result = await withAuth(async (userId, supabase) => {
    await notificationsService.markAllAsRead(userId, supabase);
    return true;
  });
  return { error: result.success ? undefined : result.error };
}

//?  Удалить уведомление.
export async function deleteNotificationAction(notificationId: string) {
  const result = await withAuth(async (_, supabase) => {
    await notificationsService.deleteNotification(notificationId, supabase);
    return true;
  });
  return { error: result.success ? undefined : result.error };
}
