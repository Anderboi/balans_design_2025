"use client";

import { Button } from "@/components/ui/button";
import DeleteIconButton from "@/components/ui/delete-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import SubBlockCard from "@/components/ui/sub-block-card";
import {
  ConstructionFormValues,
  ConstructionInfoSchema,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useForm,
  Path,
} from "react-hook-form";
import { toast } from "sonner";
import FormSubmitButton from "./form-submit-button";
import AddItemButton from "@/components/ui/add-item-button";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";

interface ConstructionFormProps {
  projectId: string;
  initialData?: Partial<ConstructionFormValues>;
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
  roomList,
}: ConstructionFormProps) {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["walls", "ceiling", "floor"])
  );

  const form = useForm<ConstructionFormValues>({
    resolver: zodResolver(ConstructionInfoSchema),
    defaultValues: initialData || {
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
    if (!currentSections) return;
    const section = currentSections[sectionIndex];

    if (!section) return;

    const allRoomIds = roomList.map((room: Room) => room.id);
    const currentRooms = section.rooms || [];

    // Check if all rooms are already selected
    const allSelected = allRoomIds.every((id) => currentRooms.includes(id));

    // Toggle: if all selected, deselect all; otherwise select all
    section.rooms = allSelected ? [] : allRoomIds;

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
    if (!currentSections) return;
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

  async function onSubmit(data: ConstructionFormValues) {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

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

      await projectsService.updateProjectBrief(projectId, {
        construction: cleanedData,
      });

      toast.success("Информация по монтажу сохранена");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const renderMaterialSection = (
    category: "floor" | "ceiling" | "walls",
    title: string,
    types: string[],
    fields: FieldArrayWithId<
      ConstructionFormValues,
      "floor" | "ceiling" | "walls",
      "id"
    >[],
    append: UseFieldArrayAppend<
      ConstructionFormValues,
      "floor" | "ceiling" | "walls"
    >,
    remove: UseFieldArrayRemove
  ) => {
    const sections = form.watch(category);
    const isExpanded = expandedCategories.has(category);
    const itemCount = getCategoryItemCount(category);

    return (
      <SubBlockCard>
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
                      name={
                        `${category}.${index}.type` as Path<ConstructionFormValues>
                      }
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select
                            onValueChange={field.onChange}
                            value={(field.value as string) || ""}
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
                      <DeleteIconButton onClick={() => remove(index)} />
                    )}
                  </div>

                  {sections?.[index]?.type === "Другое" && (
                    <FormField
                      control={form.control}
                      name={
                        `${category}.${index}.material` as Path<ConstructionFormValues>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Укажите материал"
                              {...field}
                              value={(field.value as string) || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Помещения</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllRooms(category, index)}
                        className="text-xs h-7 cursor-pointer font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wide"
                      >
                        Выбрать все
                      </Button>
                      {/* <span className="text-sm font-medium">Помещения</span> */}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roomList.map((room) => {
                        const isSelected =
                          sections?.[index]?.rooms?.includes(room.id) || false;
                        return (
                          <Button
                            key={room.id}
                            type="button"
                            size="sm"
                            onClick={() => toggleRoom(category, index, room.id)}
                            className={`cursor-pointer ${
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm hover:bg-zinc-900/80"
                                : "//bg-neutral-100 border bg-white text-zinc-500 hover:bg-zinc-100 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                            }`}
                          >
                            <span className="opacity-60">{room.order}.</span>
                            {room.name}
                          </Button>
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
              <AddItemButton
                onClick={() => append({ type: "", material: "", rooms: [] })}
              >
                Добавить материал
              </AddItemButton>
            </div>
          )}
        </div>
      </SubBlockCard>
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
        <FormSubmitButton isLoading={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}
