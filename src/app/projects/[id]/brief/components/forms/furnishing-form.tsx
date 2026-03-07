"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Equipment,
  EquipmentBlockFormValues,
  EquipmentBlockSchema,
  getMemoizedEquipmentSuggestions,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import SubBlockCard from "@/components/ui/sub-block-card";
import FormSubmitButton from "./form-submit-button";
import { updateProjectBriefAction } from "@/lib/actions/brief";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import DeleteIconButton from "@/components/ui/delete-button";
import { completeBriefSectionAction } from "@/lib/actions/stages";

interface FurnishingFormProps {
  projectId: string;
  initialData?: Partial<EquipmentBlockFormValues>;
  roomList: Room[];
}

export function FurnishingForm({
  projectId,
  initialData,
  roomList,
}: FurnishingFormProps) {
  const router = useRouter();
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set(),
  );
  const [action, setAction] = useState<"save" | "complete">("save");

  // Initialize equipment state from initialData
  const [roomsEquipment, setRoomsEquipment] = useState<{
    [roomId: string]: Equipment[];
  }>(() => {
    if (initialData?.rooms) {
      const equipmentMap: { [roomId: string]: Equipment[] } = {};
      initialData.rooms.forEach((room) => {
        equipmentMap[room.room_id] = room.equipment || [];
      });
      return equipmentMap;
    }
    // Initialize empty arrays for all rooms
    const initialEquipment: { [roomId: string]: Equipment[] } = {};
    roomList.forEach((room) => {
      initialEquipment[room.id] = [];
    });
    return initialEquipment;
  });

  const form = useForm<EquipmentBlockFormValues>({
    resolver: zodResolver(EquipmentBlockSchema),
    defaultValues: initialData || {
      rooms: [],
    },
  });

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  const toggleEquipmentDetails = (equipmentId: string) => {
    setExpandedEquipment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }
      return newSet;
    });
  };

  const addEquipmentFromSuggestion = (
    roomId: string,
    name: string,
    category?: string,
  ) => {
    const newEquipment: Equipment = {
      id: uuidv4(),
      name,
      room_id: roomId,
      category,
      isCustom: false,
    };

    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newEquipment],
    }));
  };

  const removeEquipment = (roomId: string, equipmentId: string) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((eq) => eq.id !== equipmentId),
    }));
  };

  const updateEquipment = <K extends keyof Equipment>(
    roomId: string,
    equipmentId: string,
    field: K,
    value: Equipment[K],
  ) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].map((eq) =>
        eq.id === equipmentId ? { ...eq, [field]: value } : eq,
      ),
    }));
  };

  async function onSubmit() {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      const data: EquipmentBlockFormValues = {
        rooms: roomList.map((room) => ({
          room_id: room.id,
          room_name: room.name,
          equipment: roomsEquipment[room.id] || [],
        })),
      };

      const result = await updateProjectBriefAction(projectId, {
        equipment: data,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      if (action === "complete") {
        await completeBriefSectionAction(projectId, "furnishing", true);
        toast.success("Раздел завершен");
        router.push(`/projects/${projectId}/brief`);
        return;
      }

      toast.success("Наполнение помещений сохранено");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  // Calculate suggestions for all rooms
  const allRoomSuggestions = useMemo(() => {
    const suggestionsMap: Record<
      string,
      Array<{ name: string; category: string }>
    > = {};
    roomList.forEach((room) => {
      const equipment = roomsEquipment[room.id] || [];
      const allSuggestions = getMemoizedEquipmentSuggestions(
        room.name,
        room.type as "living" | "wet" | "utility" | "technical" | undefined
      );
      const selectedNames = new Set(equipment.map((eq) => eq.name));
      suggestionsMap[room.id] = allSuggestions.filter(
        (s: { name: string; category: string }) => !selectedNames.has(s.name),
      );
    });
    return suggestionsMap;
  }, [roomList, roomsEquipment]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Наполнение помещений</h2>

          {roomList.map((room) => {
            const isExpanded = expandedRooms.has(room.id);
            const equipment = roomsEquipment[room.id] || [];
            const suggestions = allRoomSuggestions[room.id] || [];

            return (
              <SubBlockCard key={room.id}>
                <div className="space-y-3">
                  {/* Room Header */}
                  <button
                    type="button"
                    onClick={() => toggleRoom(room.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {room.order}. {room.name}
                      </span>
                      {equipment.length > 0 && (
                        <span className="text-sm text-gray-500">
                          ({equipment.length})
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {/* Room Content */}
                  {isExpanded && (
                    <div className="space-y-4">
                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Предлагаемое оборудование:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map(
                              (
                                suggestion: { name: string; category: string },
                                idx: number,
                              ) => (
                                <Button
                                  key={idx}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    addEquipmentFromSuggestion(
                                      room.id,
                                      suggestion.name,
                                      suggestion.category,
                                    );
                                  }}
                                  className="cursor-pointer"
                                >
                                  {suggestion.name}
                                </Button>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Equipment Input */}
                      <Input
                        placeholder="Добавьте предмет ..."
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value.trim()
                          ) {
                            e.preventDefault();
                            addEquipmentFromSuggestion(
                              room.id,
                              e.currentTarget.value.trim(),
                              "Другое",
                            );
                            e.currentTarget.value = "";
                          }
                        }}
                      />

                      {/* Selected Equipment List */}
                      {equipment.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Выбранное оборудование:
                          </p>
                          {equipment.map((eq) => {
                            const isDetailsExpanded = expandedEquipment.has(
                              eq.id,
                            );
                            return (
                              <div
                                key={eq.id}
                                className="border rounded-lg p-3 space-y-2 bg-white"
                              >
                                {/* Compact view */}
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={eq.name}
                                    onChange={(e) =>
                                      updateEquipment(
                                        room.id,
                                        eq.id,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Название"
                                    className="flex-1 bg-transparent outline-none shadow-none border-none font-medium text-zinc-900"
                                  />
                                  <div className="w-px h-6 bg-zinc-200" />
                                  <Input
                                    type="number"
                                    value={eq.quantity || 1}
                                    onChange={(e) =>
                                      updateEquipment(
                                        room.id,
                                        eq.id,
                                        "quantity",
                                        parseInt(e.target.value) || 1,
                                      )
                                    }
                                    placeholder="Кол-во"
                                    min="1"
                                    className="w-12 text-center bg-transparent font-medium text-zinc-900 text-sm outline-none shadow-none border-none"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleEquipmentDetails(eq.id)
                                    }
                                  >
                                    <ChevronRight
                                      size={16}
                                      className={`transition-transform ${
                                        isDetailsExpanded ? "rotate-90" : ""
                                      }`}
                                    />
                                  </Button>
                                  <DeleteIconButton
                                    onClick={() =>
                                      removeEquipment(room.id, eq.id)
                                    }
                                  />
                                </div>

                                {/* Expandable details */}
                                {isDetailsExpanded && (
                                  <div className="space-y-4 pt-4 border-t">
                                    <div className="flex gap-4">
                                      <Input
                                        value={eq.manufacturer || ""}
                                        onChange={(e) =>
                                          updateEquipment(
                                            room.id,
                                            eq.id,
                                            "manufacturer",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Производитель (необязательно)"
                                      />
                                      <Input
                                        value={eq.url || ""}
                                        onChange={(e) =>
                                          updateEquipment(
                                            room.id,
                                            eq.id,
                                            "url",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Ссылка на товар (необязательно)"
                                      />
                                    </div>
                                    <Textarea
                                      value={eq.description || ""}
                                      onChange={(e) =>
                                        updateEquipment(
                                          room.id,
                                          eq.id,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Комментарий (необязательно)"
                                      rows={2}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SubBlockCard>
            );
          })}
        </div>
        <FormSubmitButton
          isLoading={form.formState.isSubmitting}
          onActionSelect={setAction}
        />
      </form>
    </Form>
  );
}
