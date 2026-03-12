"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Comment } from "@/types";
import { supabase } from "@/lib/supabase";
import { mapCommentData } from "@/lib/utils/data-mappers";
import { toast } from "sonner";

interface UseTaskCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  sendComment: (content: string) => Promise<void>;
}

export function useTaskComments(taskId: string): UseTaskCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserRef = useRef<{
    id: string;
    full_name: string;
    avatar_url?: string;
  } | null>(null);

  // Fetch current user profile once
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          currentUserRef.current = {
            id: profile.id,
            full_name: profile.full_name || "Пользователь",
            avatar_url: profile.avatar_url || undefined,
          };
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch comments on mount / taskId change
  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from("task_comments" as any)
          .select(
            `
            *,
            user:profiles(full_name, avatar_url)
          `
          )
          .eq("task_id", taskId)
          .order("created_at", { ascending: true })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .returns<any[]>();

        if (error) throw error;
        if (!cancelled) {
          setComments((data || []).map(mapCommentData));
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        if (!cancelled) {
          toast.error("Не удалось загрузить сообщения");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchComments();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`task-comments-${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_comments",
          filter: `task_id=eq.${taskId}`,
        },
        async (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newRow = payload.new as Record<string, any>;

          // Skip if this comment was already added optimistically by current user
          const currentUserId = currentUserRef.current?.id;
          if (currentUserId && newRow.user_id === currentUserId) {
            // Replace optimistic placeholder with real data
            setComments((prev) => {
              const hasOptimistic = prev.some(
                (c) => c.id.startsWith("optimistic-") && c.text === newRow.content
              );
              if (hasOptimistic) {
                return prev.map((c) =>
                  c.id.startsWith("optimistic-") && c.text === newRow.content
                    ? {
                        id: newRow.id,
                        userName: currentUserRef.current?.full_name || "Вы",
                        userAvatar: currentUserRef.current?.avatar_url,
                        text: newRow.content,
                        createdAt: newRow.created_at,
                      }
                    : c
                );
              }
              return prev; // already replaced, no duplicates
            });
            return;
          }

          // Comment from another user — fetch their profile and append
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", newRow.user_id)
            .single();

          const newComment: Comment = {
            id: newRow.id,
            userName: profile?.full_name || "Пользователь",
            userAvatar: profile?.avatar_url || undefined,
            text: newRow.content,
            createdAt: newRow.created_at,
          };

          setComments((prev) => [...prev, newComment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);

  // Send comment
  const sendComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const user = currentUserRef.current;
      if (!user) {
        toast.error("Необходимо войти в систему");
        return;
      }

      // Optimistic insert
      const optimisticComment: Comment = {
        id: `optimistic-${Date.now()}`,
        userName: user.full_name || "Вы",
        userAvatar: user.avatar_url,
        text: trimmed,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [...prev, optimisticComment]);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from("task_comments" as any).insert({
          task_id: taskId,
          user_id: user.id,
          content: trimmed,
        });

        if (error) throw error;
      } catch (error) {
        console.error("Failed to send comment:", error);
        toast.error("Не удалось отправить сообщение");
        // Revert optimistic update
        setComments((prev) =>
          prev.filter((c) => c.id !== optimisticComment.id)
        );
      }
    },
    [taskId]
  );

  return { comments, isLoading, sendComment };
}
