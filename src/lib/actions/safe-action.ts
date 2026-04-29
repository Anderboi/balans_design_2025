import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

// Универсальный тип ответа
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function withAuth<T>(
  action: (userId: string, supabase: SupabaseClient) => Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Не авторизован" };
    }

    const result = await action(user.id, supabase);
    return { success: true, data: result };
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Внутренняя ошибка сервера",
    };
  }
}
