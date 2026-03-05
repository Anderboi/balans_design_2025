"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types/notifications";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationAction,
} from "@/lib/actions/notifications";

interface UseNotificationsOptions {
  initialNotifications: Notification[];
  userId: string;
}

export function useNotifications({
  initialNotifications,
  userId,
}: UseNotificationsOptions) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const supabaseRef = useRef(createClient());

  // Sync initial data when SSR data changes
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = supabaseRef.current;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n)),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    const result = await markNotificationAsRead(notificationId);
    if (result.error) {
      // Revert on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n)),
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const result = await markAllNotificationsAsRead();
    if (result.error) {
      // Revert — re-fetch would be ideal, but for simplicity just mark them all as read
      // since the server state might be partially updated
      console.error("Failed to mark all as read:", result.error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    // Optimistic update — remove from list
    let removed: Notification | undefined;
    setNotifications((prev) => {
      removed = prev.find((n) => n.id === notificationId);
      return prev.filter((n) => n.id !== notificationId);
    });
    const result = await deleteNotificationAction(notificationId);
    if (result.error && removed) {
      // Revert
      setNotifications((prev) => [removed!, ...prev]);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
