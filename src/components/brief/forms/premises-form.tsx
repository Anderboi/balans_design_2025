"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PremisesFormValues, PremisesSchema } from "@/lib/schemas/brief-schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import StyledSelect from "@/components/ui/styled-select";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface PremisesFormProps {
  projectId?: string;
  initialData?: any;
  onSave?: (data: any) => Promise<void>;
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

  return (
    <Form {...form}>
      <form onSubmit={() => {}}>
        <div className="space-y-4">
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
                >
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    size="sm"
                  >
                    <Trash2Icon size={20} />
                  </Button>{" "}
                </FormField>
              </article>
            );
          })}
        </div>
        <div>
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
        </div>
      </form>
    </Form>
  );
}
