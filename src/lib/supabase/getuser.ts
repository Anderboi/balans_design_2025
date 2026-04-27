import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { redirect } from "next/navigation";

// Кешируется в рамках одного запроса
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error fetching user:", error);
    return null;
  }

  const {data: profile} = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return {...user, profile};
});

// Версия с редиректом
export const getUserOrRedirect = cache(async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});
