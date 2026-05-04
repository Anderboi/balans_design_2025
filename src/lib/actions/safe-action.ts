import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { getUser } from "../supabase/getuser";

export type ActionCode =
  | "UNAUTHORIZED"
  | "VALIDATION"
  | "NOT_FOUND"
  | "INTERNAL";
// Универсальный тип ответа
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: ActionCode };

export async function withAuth<T>(
  action: (userId: string, supabase: SupabaseClient) => Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: "Не авторизован",
        code: "UNAUTHORIZED",
      };
    }

    const supabase = await createClient();
    const result = await action(user.id, supabase);
    return { success: true, data: result };
  } catch (error) {
    console.error("[withAuth] Action failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      code: "INTERNAL",
    };
  }
}

export function validationError(message: string): ActionResponse<never> {
  return { success: false, error: message, code: "VALIDATION" };
}

export function notFoundError(message = "Не найдено"): ActionResponse<never> {
  return { success: false, error: message, code: "NOT_FOUND" };
}
