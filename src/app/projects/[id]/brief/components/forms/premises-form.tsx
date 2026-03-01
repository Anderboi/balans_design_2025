"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  PremisesFormValues,
  PremisesSchema,
  RoomType,
} from "@/lib/schemas/brief-schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import StyledSelect from "@/components/ui/styled-select";
import { toast } from "sonner";
import { CreateRoomData } from "@/lib/services/rooms";
import { updateRoomsAction } from "@/lib/actions/brief";
import { completeBriefSectionAction } from "@/lib/actions/stages";
import { useRouter } from "next/navigation";
import SubBlockCard from "@/components/ui/sub-block-card";
import DeleteIconButton from "@/components/ui/delete-button";
import FormSubmitButton from "./form-submit-button";
import AddItemButton from "@/components/ui/add-item-button";

interface PremisesFormProps {
  projectId: string;
  initialData?: PremisesFormValues;
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

export function PremisesForm({ projectId, initialData }: PremisesFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [action, setAction] = useState<"save" | "complete">("save");

  // Initialize options with custom rooms from initialData
  const [options, setOptions] = useState(() => {
    if (!initialData?.rooms) return roomList;

    const customOptions = initialData.rooms
      .filter((r) => !roomList.some((opt) => opt.value === r.name))
      .map((r) => ({ value: r.name, label: r.name }));

    return customOptions.length > 0
      ? [...roomList, ...customOptions]
      : roomList;
  });

  const form = useForm<PremisesFormValues>({
    resolver: zodResolver(PremisesSchema),
    defaultValues: initialData || {
      rooms: [{ name: "", order: 1, type: undefined }],
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

  const handleSubmit = async (data: PremisesFormValues) => {
    if (!projectId) {
      toast.error("ID проекта не найден");
      return;
    }

    setIsSaving(true);
    try {
      // Mapping with ID preservation
      const roomsToSave: CreateRoomData[] = data.rooms.map((room, index) => ({
        id: (room as any).id, // Preserve ID if it exists in initialData
        name: room.name,
        order: index + 1,
        type: room.type as any,
        area: room.area,
      }));

      const result = await updateRoomsAction(projectId, roomsToSave);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      if (action === "complete") {
        await completeBriefSectionAction(projectId, "rooms", true);
        toast.success("Раздел завершен");
        router.push(`/projects/${projectId}/brief`);
        return;
      }

      toast.success("Помещения успешно сохранены");
      router.refresh();
    } catch (error) {
      console.error("Failed to save rooms:", error);
      toast.error("Ошибка при сохранении помещений");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <SubBlockCard title="Помещения">
          {roomFields.map((room, index) => {
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
                              (option) => option.value === field.value,
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
                <DeleteIconButton onClick={() => remove(index)} />
              </article>
            );
          })}
        </SubBlockCard>
        <div className="pt-4">
          <AddItemButton
            onClick={() =>
              append({
                name: "",
                order: roomFields.length + 1,
                type: undefined,
              })
            }
          >
            Добавить помещение
          </AddItemButton>
        </div>
        <FormSubmitButton isLoading={isSaving} onActionSelect={setAction} />
      </form>
    </Form>
  );
}
