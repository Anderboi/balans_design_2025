import { supabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoomType } from "@/lib/schemas/brief-schema";

export type CreateRoomData = {
  id?: string;
  name: string;
  order: number;
  type?: RoomType;
  area?: number;
};

export const roomsService = {
  // Получение всех помещений проекта
  async getRoomsByProjectId(
    projectId: string,
    client?: SupabaseClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[]> {
    if (!projectId) return [];

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("rooms")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });

    if (error) {
      console.error(
        `Ошибка при получении помещений для проекта ${projectId}:`,
        error,
      );
      throw error;
    }

    return data || [];
  },

  // Массовое сохранение (создание/обновление) помещений
  async bulkUpsertRooms(
    projectId: string,
    rooms: CreateRoomData[],
    client?: SupabaseClient,
  ): Promise<void> {
    if (!projectId) throw new Error("ID проекта обязателен");

    const supabaseClient = client || supabase;

    // 1. Получаем текущие помещения для диффа
    const { data: currentRooms } = await supabaseClient
      .from("rooms")
      .select("id")
      .eq("project_id", projectId);

    const currentIds = currentRooms?.map((r) => r.id) || [];
    const newIds = rooms.map((r) => r.id).filter(Boolean) as string[];

    // 2. Находим ID для удаления (те, что есть в БД, но нет в новом списке)
    const idsToDelete = currentIds.filter((id) => !newIds.includes(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabaseClient
        .from("rooms")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) throw deleteError;
    }

    // 3. Upsert новых и измененных данных
    if (rooms.length > 0) {
      const roomsToUpsert = rooms.map((room) => ({
        ...(room.id ? { id: room.id } : {}),
        project_id: projectId,
        name: room.name,
        order: room.order,
        type: room.type,
        area: room.area || 0,
      }));

      const { error: upsertError } = await supabaseClient
        .from("rooms")
        .upsert(roomsToUpsert);

      if (upsertError) throw upsertError;
    }
  },
};
