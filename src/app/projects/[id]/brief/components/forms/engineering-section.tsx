"use client";

import { useFieldArray, Control } from "react-hook-form";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Thermometer,
  Fan,
  Droplets,
  Zap,
} from "lucide-react";
import { EngineeringSystemsType } from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
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
import { Button } from "@/components/ui/button";
import SubBlockCard from "@/components/ui/sub-block-card";
import DeleteIconButton from "@/components/ui/delete-button";
import AddItemButton from "@/components/ui/add-item-button";
import { cn } from "@/lib/utils";

const ICONS = {
  thermometer: Thermometer,
  fan: Fan,
  droplets: Droplets,
  zap: Zap,
} as const;

interface EngineeringSectionProps {
  category: keyof EngineeringSystemsType;
  title: string;
  icon: keyof typeof ICONS;
  options: string[];
  control: Control<EngineeringSystemsType>;
  roomList: Room[];
  expanded: boolean;
  onToggleExpanded: () => void;
  itemCount: number;
}

export function EngineeringSection({
  category,
  title,
  icon,
  options,
  control,
  roomList = [],
  expanded,
  onToggleExpanded,
  itemCount,
}: EngineeringSectionProps) {
  const Icon = ICONS[icon];

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: category,
  });

  const toggleRoom = (sectionIndex: number, roomId: string) => {
    const field = fields[sectionIndex];
    if (!field) return; 

    const currentRooms = field.rooms || [];

    const updatedRooms = currentRooms.includes(roomId)
      ? currentRooms.filter((r) => r !== roomId)
      : [...currentRooms, roomId];

    update(sectionIndex, { ...field, rooms: updatedRooms });
  };

  const selectAllRooms = (sectionIndex: number) => {
    const field = fields[sectionIndex];
    if (!field || !roomList.length) return; 

    const allRoomIds = roomList.map((room) => room.id);
    const currentRooms = field.rooms || [];
    const allSelected = allRoomIds.every((id) => currentRooms.includes(id));

    update(sectionIndex, {
      ...field,
      rooms: allSelected ? [] : allRoomIds,
    });
  };

  // ✅ Вычисляем количество выбранных уникальных комнат
  const getTotalSelectedRooms = () => {
    const uniqueRooms = new Set<string>();
    fields.forEach((field) => {
      field.rooms?.forEach((roomId) => uniqueRooms.add(roomId));
    });
    return uniqueRooms.size;
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
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <Icon size={20} className="text-zinc-600" />
            </div>
            <span className="font-bold text-lg group-hover:text-zinc-900 transition-colors">
              {title}
            </span>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-bold rounded-full">
                {itemCount}
              </span>
            )}
            {/* ✅ Показываем статистику комнат */}
            {fields.length > 0 && roomList.length > 0 && (
              <span className="text-xs text-zinc-400">
                ({getTotalSelectedRooms()} / {roomList.length})
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
          <div className="space-y-6 animate-fade-in">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="pb-6 border-b border-zinc-100 last:border-0 last:pb-0"
              >
                {/* System Select */}
                <div className="flex gap-4 items-start mb-4">
                  <FormField
                    control={control}
                    name={`${category}.${index}.system`}
                    render={({ field: formField }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Выберите систему" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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

                {/* Room Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Помещения
                      {field.rooms && field.rooms.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded">
                          {field.rooms.length}
                        </span>
                      )}
                    </FormLabel>
                    {roomList.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllRooms(index)}
                        className="text-[10px] cursor-pointer h-6 font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-wide"
                      >
                        {field.rooms?.length === roomList.length
                          ? "Снять все"
                          : `Выбрать все (${roomList.length})`}
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {roomList.length > 0 ? (
                      roomList.map((room) => {
                        const isSelected =
                          field.rooms?.includes(room.id) || false;
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => toggleRoom(index, room.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                            )}
                          >
                            {room.order && (
                              <span className="opacity-60 mr-1">
                                {room.order}.
                              </span>
                            )}
                            {room.name || `Помещение ${room.id}`}
                          </button>
                        );
                      })
                    ) : (
                      <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800 italic">
                          ⚠️{" "}
                          {`Сначала добавьте помещения в разделе "Состав
                          помещений"`}
                        </p>
                      </div>
                    )}
                  </div>

                  <FormMessage />
                </div>
              </div>
            ))}

            <AddItemButton
              onClick={() =>
                append({
                  system: "",
                  rooms: [],
                })
              }
            >
              Добавить систему
            </AddItemButton>
          </div>
        )}
      </div>
    </SubBlockCard>
  );
}
