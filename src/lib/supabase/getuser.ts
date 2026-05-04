import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { redirect } from "next/navigation";
import { Database } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AuthUser = User & {
  profile: Profile | null;
};

// Кешируется в рамках одного запроса
export const getUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    if (error) console.error("[getUser] Auth error:", error.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

      if (profileError) {
        // Профиль может не существовать для новых пользователей — не критично
        console.warn("[getUser] Profile not found:", profileError.message);
      }

  return { ...user, profile: profile ?? null };
});

// Версия с редиректом
export const getUserOrRedirect = cache(async (): Promise<AuthUser> => {
  const user = await getUser();

  if (!user) redirect("/login");

  return user;
});
