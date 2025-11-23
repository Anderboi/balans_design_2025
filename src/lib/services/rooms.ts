import { supabase } from "@/lib/supabase";
import { Room } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoomType } from "@/lib/schemas/brief-schema";

export type CreateRoomData = {
  name: string;
  order: number;
  type?: RoomType;
  area?: number;
};

export const roomsService = {
  // Получение всех помещений проекта
  async getRoomsByProjectId(
    projectId: string,
    client?: SupabaseClient
  ): Promise<Room[]> {
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
        error
      );
      throw error;
    }

    return data || [];
  },

  // Массовое сохранение (создание/обновление) помещений
  async bulkUpsertRooms(
    projectId: string,
    rooms: CreateRoomData[],
    client?: SupabaseClient
  ): Promise<void> {
    if (!projectId) throw new Error("ID проекта обязателен");

    const supabaseClient = client || supabase;

    // 1. Получаем текущие помещения, чтобы понять, какие нужно удалить
    const { data: currentRooms } = await supabaseClient
      .from("rooms")
      .select("id")
      .eq("project_id", projectId);

    // В реальном приложении мы бы делали умный дифф, но для простоты
    // и гарантии порядка проще удалить все и создать заново,
    // ИЛИ использовать upsert если у нас есть ID.
    // В форме у нас пока нет ID помещений, поэтому стратегия:
    // Удалить все старые -> Создать новые.
    // Это безопасно, так как у нас нет зависимых данных (пока что).

    // Если будут зависимые данные (мебель), то нужно будет делать upsert по ID.
    // Сейчас реализуем стратегию "полная перезапись" для простоты синхронизации порядка.

    // Удаляем старые
    if (currentRooms && currentRooms.length > 0) {
      const { error: deleteError } = await supabaseClient
        .from("rooms")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) throw deleteError;
    }

    // Создаем новые
    if (rooms.length > 0) {
      const roomsToInsert = rooms.map((room) => ({
        project_id: projectId,
        name: room.name,
        order: room.order,
        type: room.type,
        area: room.area || 0,
      }));

      const { error: insertError } = await supabaseClient
        .from("rooms")
        .insert(roomsToInsert);

      if (insertError) throw insertError;
    }
  },
};
