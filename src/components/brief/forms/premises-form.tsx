"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  PremisesFormValues,
  PremisesSchema,
  RoomType,
} from "@/lib/schemas/brief-schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import StyledSelect from "@/components/ui/styled-select";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { roomsService } from "@/lib/services/rooms";
import { toast } from "sonner";

interface PremisesFormProps {
  projectId?: string;
  initialData?: PremisesFormValues;
  onSave?: (data: PremisesFormValues) => Promise<void>;
}

export type Option = {
  value: string;
  label: string;
  group?: string;
};

export const roomList: Option[] = [
  {
    value: "Прихожая",
    label: "Прихожая",
  },
  {
    value: "Гостиная",
    label: "Гостиная",
  },
  {
    value: "Кухня",
    label: "Кухня",
  },
  {
    value: "Столовая",
    label: "Столовая",
  },
  {
    value: "Спальня",
    label: "Спальня",
  },
  {
    value: "Детская",
    label: "Детская",
  },
  {
    value: "Гардеробная",
    label: "Гардеробная",
  },
  {
    value: "Ванная комната",
    label: "Ванная комната",
  },
  {
    value: "Санузел",
    label: "Санузел",
  },
  {
    value: "Постирочная",
    label: "Постирочная",
  },
];

export function PremisesForm({
  projectId,
  initialData,
  onSave,
}: PremisesFormProps) {
  const [options, setOptions] = useState(roomList);

  const form = useForm<PremisesFormValues>({
    resolver: zodResolver(PremisesSchema),
    defaultValues: {
      rooms:
        initialData && initialData.rooms && initialData.rooms.length > 0
          ? initialData.rooms
          : [{ name: "", order: 1, type: undefined }],
    },
  });

  const {
    fields: roomFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  //? Функция автоматического определения типа помещения
  const autoDetectRoomType = (roomName: string): RoomType | undefined => {
    const name = roomName.toLowerCase().trim();

    // Жилые помещения
    if (
      name.includes("спальн") ||
      name.includes("гостин") ||
      name.includes("кабинет") ||
      name.includes("детск") ||
      name.includes("зал")
    ) {
      return "living";
    }

    // Мокрые зоны
    if (
      name.includes("кухн") ||
      name.includes("ванн") ||
      name.includes("санузел") ||
      name.includes("с/у") ||
      name.includes("сан") ||
      name.includes("туалет") ||
      name.includes("душ")
    ) {
      return "wet";
    }

    // Хозяйственные
    if (
      name.includes("гард") ||
      name.includes("клад") ||
      name.includes("постир") ||
      name.includes("кладов") ||
      name.includes("гардероб") ||
      name.includes("прачеч")
    ) {
      return "utility";
    }

    // Технические
    if (
      name.includes("котельн") ||
      name.includes("электрощит") ||
      name.includes("венткамер")
    ) {
      return "technical";
    }

    return undefined;
  };

  //? Создание новой опции если такой нет в списке
  const handleCreateOption = (inputValue: string, index: number) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    form.setValue(`rooms.${index}.name`, inputValue);

    // Автоматически определяем тип
    const detectedType = autoDetectRoomType(inputValue);
    if (detectedType) {
      form.setValue(`rooms.${index}.type`, detectedType);
    }
  };

  const handleRoomNameChange = (value: string | null, index: number) => {
    if (!value) return;

    form.setValue(`rooms.${index}.name`, value);

    // Автоматически определяем тип при изменении названия
    const detectedType = autoDetectRoomType(value);
    if (detectedType) {
      form.setValue(`rooms.${index}.type`, detectedType);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      if (!projectId) return;

      setIsLoading(true);
      try {
        const rooms = await roomsService.getRoomsByProjectId(projectId);
        if (rooms.length > 0) {
          // 1. Подготавливаем данные для формы
          const formRooms = rooms.map((r) => ({
            name: r.name,
            order: r.order,
            type: r.type,
            area: r.area,
          }));

          // 2. Находим кастомные комнаты (которых нет в стандартном списке)
          const customOptions = rooms
            .filter((r) => !roomList.some((opt) => opt.value === r.name))
            .map((r) => ({ value: r.name, label: r.name }));

          // 3. Обновляем список опций, добавляя кастомные
          if (customOptions.length > 0) {
            setOptions((prev) => {
              const existingValues = new Set(prev.map((p) => p.value));
              const newUniqueOptions = customOptions.filter(
                (o) => !existingValues.has(o.value)
              );
              return [...prev, ...newUniqueOptions];
            });
          }

          form.reset({
            rooms: formRooms,
          });
        }
      } catch (error) {
        console.error("Failed to load rooms:", error);
        toast.error("Не удалось загрузить помещения");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [projectId, form]);

  const handleSubmit = async (data: PremisesFormValues) => {
    if (!projectId) {
      toast.error("ID проекта не найден");
      return;
    }

    setIsSaving(true);
    try {
      await roomsService.bulkUpsertRooms(projectId, data.rooms);
      toast.success("Помещения успешно сохранены");
      if (onSave) await onSave(data);
    } catch (error) {
      console.error("Failed to save rooms:", error);
      toast.error("Ошибка при сохранении помещений");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Загрузка...</div>
          ) : (
            roomFields.map((room, index) => {
              return (
                <article
                  key={index}
                  className="flex items-center gap-2 pb-4 border-b last:border-b-0"
                >
                  <span className="px-2">{room.order}</span>
                  <FormField
                    control={form.control}
                    name={`rooms.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <FormControl>
                          <StyledSelect
                            options={options}
                            value={
                              options.find(
                                (option) => option.value === field.value
                              ) || null
                            }
                            onChange={(val) => handleRoomNameChange(val, index)}
                            placeholder="Помещение..."
                            onCreateOption={(inputValue) =>
                              handleCreateOption(inputValue, index)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    size="sm"
                  >
                    <Trash2Icon size={20} />
                  </Button>
                </article>
              );
            })
          )}
        </div>
        <div className="pt-4">
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={() =>
              append({
                name: "",
                order: roomFields.length + 1,
                type: undefined,
              })
            }
          >
            Добавить помещение
          </Button>

          {/* Скрытая кнопка для сабмита формы из родительского компонента */}
          <button type="submit" className="hidden" />
        </div>
      </form>
    </Form>
  );
}
