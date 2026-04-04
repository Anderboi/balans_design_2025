// src/features/brief/components/construction-material-section.tsx
"use client";

import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ConstructionFormValues } from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SubBlockCard from "@/components/ui/sub-block-card";
import DeleteIconButton from "@/components/ui/delete-button";
import AddItemButton from "@/components/ui/add-item-button";
import { OTHER_TYPE } from "../../constants/construction-options";
import { cn } from "@/lib/utils";

interface MaterialSectionProps {
  category: "floor" | "ceiling" | "walls";
  title: string;
  types: string[];
  control: Control<ConstructionFormValues>;
  roomList: Room[];
  expanded: boolean;
  onToggleExpanded: () => void;
  itemCount: number;
}

export function MaterialSection({
  category,
  title,
  types,
  control,
  roomList,
  expanded,
  onToggleExpanded,
  itemCount,
}: MaterialSectionProps) {
  const { getValues } = useFormContext<ConstructionFormValues>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: category,
  });

  const toggleRoom = (sectionIndex: number, roomId: string) => {
    const currentValues = getValues(category);
    if (!currentValues || !currentValues[sectionIndex]) return;

    const currentItem = currentValues[sectionIndex];
    const currentRooms = currentItem.rooms || [];

    const updatedRooms = currentRooms.includes(roomId)
      ? currentRooms.filter((r) => r !== roomId)
      : [...currentRooms, roomId];

    update(sectionIndex, {
      ...currentItem,
      rooms: updatedRooms,
    });
  };

  const selectAllRooms = (sectionIndex: number) => {
    const currentValues = getValues(category);
    if (!currentValues || !currentValues[sectionIndex] || !roomList.length)
      return;

    const currentItem = currentValues[sectionIndex];
    const allRoomIds = roomList.map((room) => room.id);
    const currentRooms = currentItem.rooms || [];
    const allSelected = allRoomIds.every((id) => currentRooms.includes(id));

    update(sectionIndex, {
      ...currentItem,
      rooms: allSelected ? [] : allRoomIds,
    });
  };

  return (
    <SubBlockCard>
      <div className="space-y-4">
        {/* Header */}
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg group-hover:text-zinc-900 transition-colors">
              {title}
            </span>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-bold rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          {expanded ? (
            <ChevronUp size={20} className="text-zinc-400" />
          ) : (
            <ChevronDown size={20} className="text-zinc-400" />
          )}
        </button>

        {/* Content */}
        {expanded && (
          <div className="space-y-4 animate-fade-in">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 pb-4 border-b border-zinc-100 last:border-b-0 last:pb-0"
              >
                {/* Type Select */}
                <div className="flex gap-2 items-start">
                  <FormField
                    control={control}
                    name={`${category}.${index}.type`}
                    render={({ field: formField }) => (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value || ""}
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

                {/* Custom Material Input (for "Другое") */}
                {field.type === OTHER_TYPE && (
                  <FormField
                    control={control}
                    name={`${category}.${index}.material`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Укажите материал"
                            {...formField}
                            value={formField.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Room Selection */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Помещения</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllRooms(index)}
                      className={cn(
                        "text-xs h-7 font-bold ",
                        field.rooms?.length === roomList.length
                          ? "text-zinc-900 hover:text-zinc-700"
                          : "text-zinc-400 hover:text-zinc-900",
                      )}
                    >
                      {field.rooms?.length === roomList.length
                        ? "Снять все"
                        : `Выбрать все (${roomList.length})`}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {roomList.length > 0 ? (
                      roomList.map((room) => {
                        const isSelected =
                          field.rooms?.includes(room.id) || false;
                        return (
                          <Button
                            key={room.id}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => toggleRoom(index, room.id)}
                            className="cursor-pointer"
                          >
                            <span className="opacity-60 mr-1">
                              {room.order}.
                            </span>
                            {room.name}
                          </Button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-zinc-400 italic">
                        {`Сначала добавьте помещения в разделе "Состав помещений"`}
                      </p>
                    )}
                  </div>

                  <FormMessage />
                </div>
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
}
