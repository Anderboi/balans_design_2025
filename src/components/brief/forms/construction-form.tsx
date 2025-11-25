"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConstructionFormValues,
  ConstructionInfoSchema,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ConstructionFormProps {
  projectId?: string;
  initialData?: any;
  onSave?: (data: any) => Promise<void>;
  roomList: Room[];
}

// Material types for each category
const floorTypes = [
  "Керамогранит",
  "Ламинат",
  "Паркет",
  "Инженерная доска",
  "Линолеум",
  "Другое",
];
const ceilingTypes = [
  "Натяжной потолок",
  "Покраска",
  "Гипсокартонный потолок",
  "Другое",
];
const wallTypes = [
  "Покраска",
  "Обои",
  "Декоративная штукатурка",
  "Плитка",
  "Другое",
];

export function ConstructionForm({
  projectId,
  initialData,
  onSave,
  roomList,
}: ConstructionFormProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["walls", "ceiling", "floor"])
  );

  const form = useForm<ConstructionFormValues>({
    resolver: zodResolver(ConstructionInfoSchema),
    defaultValues: {
      floor: [{ type: "", material: "", rooms: [] }],
      ceiling: [{ type: "", material: "", rooms: [] }],
      walls: [{ type: "", material: "", rooms: [] }],
    },
  });

  const selectAllRooms = (
    category: "floor" | "ceiling" | "walls",
    sectionIndex: number
  ) => {
    const currentSections = form.getValues(category);
    const section = currentSections[sectionIndex];

    if (!section) return;

    const allRoomIds = roomList.map((room: Room) => room.id);
    section.rooms = allRoomIds;

    form.setValue(category, currentSections, { shouldValidate: true });
  };

  const {
    fields: floorFields,
    append: appendFloor,
    remove: removeFloor,
  } = useFieldArray({
    control: form.control,
    name: "floor",
  });

  const {
    fields: ceilingFields,
    append: appendCeiling,
    remove: removeCeiling,
  } = useFieldArray({
    control: form.control,
    name: "ceiling",
  });

  const {
    fields: wallsFields,
    append: appendWalls,
    remove: removeWalls,
  } = useFieldArray({
    control: form.control,
    name: "walls",
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleRoom = (
    category: "floor" | "ceiling" | "walls",
    sectionIndex: number,
    roomId: string
  ) => {
    const currentSections = form.getValues(category);
    const section = currentSections[sectionIndex];

    if (!section) return;

    const currentRooms = section.rooms || [];

    if (currentRooms.includes(roomId)) {
      section.rooms = currentRooms.filter((r) => r !== roomId);
    } else {
      section.rooms = [...currentRooms, roomId];
    }

    form.setValue(category, currentSections, { shouldValidate: true });
  };

  const getCategoryItemCount = (category: "floor" | "ceiling" | "walls") => {
    const sections = form.watch(category);
    return (
      sections?.filter((s) => s && s.type && s.rooms && s.rooms.length > 0)
        .length || 0
    );
  };

  function onSubmit(data: ConstructionFormValues) {
    try {
      // Filter out empty sections
      const cleanedData = {
        floor:
          data.floor?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
        ceiling:
          data.ceiling?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
        walls:
          data.walls?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
      };

      localStorage.setItem("constructionData", JSON.stringify(cleanedData));
      toast.success("Информация по монтажу сохранена");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const renderMaterialSection = (
    category: "floor" | "ceiling" | "walls",
    title: string,
    types: string[],
    fields: any[],
    append: any,
    remove: any
  ) => {
    const sections = form.watch(category);
    const isExpanded = expandedCategories.has(category);
    const itemCount = getCategoryItemCount(category);

    return (
      <section className="p-4 space-y-4 rounded-xl shadow-xl bg-background dark:border dark:shadow-none">
        <h3 className="font-bold text-lg">Информация по монтажу</h3>
        <div className="space-y-4">
          {/* Category Header */}
          <button
            type="button"
            onClick={() => toggleCategory(category)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{title}</span>
              {itemCount > 0 && (
                <span className="text-sm text-gray-500">({itemCount})</span>
              )}
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Category Content */}
          {isExpanded && (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 pb-4 border-b last:border-b-0"
                >
                  <div className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`${category}.${index}.type` as any}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="default"
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon size={20} />
                      </Button>
                    )}
                  </div>

                  {sections[index]?.type === "Другое" && (
                    <FormField
                      control={form.control}
                      name={`${category}.${index}.material` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Укажите материал"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Помещения:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllRooms(category, index)}
                        className="text-xs h-7"
                      >
                        Все комнаты
                      </Button>
                      {roomList.map((room) => {
                        const isSelected =
                          sections[index]?.rooms?.includes(room.id) || false;
                        return (
                          <Toggle
                            key={room.id}
                            type="button"
                            size="sm"
                            onClick={() => toggleRoom(category, index, room.id)}
                            className={`${
                              isSelected
                                ? "bg-black text-white hover:bg-black/80"
                                : "bg-neutral-100 text-black border border-gray-300"
                            }`}
                          >
                            <span className="opacity-60">{room.order}.</span>
                            {room.name}
                          </Toggle>
                        );
                      })}
                    </div>
                  </div>

                  {form.formState.errors[category]?.[index]?.rooms && (
                    <p className="text-sm text-red-500">
                      Выберите хотя бы одно помещение
                    </p>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="default"
                onClick={() => append({ type: "", material: "", rooms: [] })}
                className="w-full"
              >
                Добавить материал
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Информация по монтажу</h2>
          {renderMaterialSection(
            "walls",
            "Стены",
            wallTypes,
            wallsFields,
            appendWalls,
            removeWalls
          )}
          {renderMaterialSection(
            "ceiling",
            "Потолок",
            ceilingTypes,
            ceilingFields,
            appendCeiling,
            removeCeiling
          )}
          {renderMaterialSection(
            "floor",
            "Напольные покрытия",
            floorTypes,
            floorFields,
            appendFloor,
            removeFloor
          )}
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            variant="default"
            className="w-full"
            
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
