"use client";

import {
  EngineeringSystemsSchema,
  EngineeringSystemsType,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface EngineeringFormProps {
  projectId: string;
  initialData?: Partial<EngineeringSystemsType>;
  roomList: Room[];
}

export function EngineeringForm({
  initialData,
  roomList,
}: EngineeringFormProps) {
  const router = useRouter();

  const form = useForm<EngineeringSystemsType>({
    resolver: zodResolver(EngineeringSystemsSchema),
    defaultValues: initialData || {
      heatingSystem: [{ id: Date.now(), system: "", rooms: [] }],
      warmFloorRooms: [{ id: Date.now() + 1, system: "", rooms: [] }],
      conditioningSystem: [{ id: Date.now() + 2, system: "", rooms: [] }],
      purificationSystem: [{ id: Date.now() + 3, system: "", rooms: [] }],
      electricSystem: [{ id: Date.now() + 4, system: "", rooms: [] }],
    },
  });

  const [expandedSections, setExpandedSections] = useState({
    heatingSystem: true,
    warmFloorRooms: false,
    conditioningSystem: false,
    purificationSystem: false,
    electricSystem: false,
  });

  type SystemKey = keyof typeof expandedSections;

  const toggleSection = (section: SystemKey) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addItem = (category: SystemKey) => {
    setData((prev: any) => ({
      ...prev,
      [category]: [
        ...prev[category],
        { id: Date.now(), system: "", rooms: [] },
      ],
    }));
  };

  const removeItem = (category: SystemKey, idx: number) => {
    setData((prev: any) => ({
      ...prev,
      [category]: prev[category].filter((_: any, i: number) => i !== idx),
    }));
  };

  const updateItem = (category: SystemKey, idx: number, value: any) => {
    setData((prev: any) => {
      const updated = [...prev[category]];
      updated[idx] = { ...updated[idx], system: value };
      return { ...prev, [category]: updated };
    });
  };

  const toggleRoom = (category: SystemKey, idx: number, roomId: string) => {
    setData((prev: any) => {
      const updated = [...prev[category]];
      const currentRooms = updated[idx].rooms || [];
      if (currentRooms.includes(roomId)) {
        updated[idx].rooms = currentRooms.filter((r: string) => r !== roomId);
      } else {
        updated[idx].rooms = [...currentRooms, roomId];
      }
      return { ...prev, [category]: updated };
    });
  };

  const selectAllRooms = (category: SystemKey, idx: number) => {
    setData((prev: any) => {
      const updated = [...prev[category]];
      updated[idx].rooms = rooms.map((r) => r.id);
      return { ...prev, [category]: updated };
    });
  };

  const renderSection = (
    category: SystemKey,
    title: string,
    typeOptions: string[],
    icon: any
  ) => {
    const items = data[category];
    const isExpanded = expandedSections[category];
    const Icon = icon;

    return (
      <FormBlock
        title={title}
        rightElement={
          <button
            onClick={() => toggleSection(category)}
            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        }
      >
        {isExpanded && (
          <div className="space-y-6">
            {items.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="pb-6 border-b border-zinc-100 last:border-0 last:pb-0 animate-fade-in"
              >
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0 mt-1">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={item.system}
                      onChange={(val) => updateItem(category, idx, val)}
                      options={typeOptions.map((t) => ({ value: t, label: t }))}
                      placeholder="Выберите систему"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(category, idx)}
                      className="p-3.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors mt-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 pl-14">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Помещения
                    </span>
                    <button
                      onClick={() => selectAllRooms(category, idx)}
                      className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wide"
                    >
                      Выбрать все
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rooms.map((room) => {
                      const isSelected = item.rooms?.includes(room.id);
                      return (
                        <button
                          key={room.id}
                          onClick={() => toggleRoom(category, idx, room.id)}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                            ${
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                            }
                          `}
                        >
                          {room.name || `Помещение ${room.id}`}
                        </button>
                      );
                    })}
                    {rooms.length === 0 && (
                      <span className="text-xs text-zinc-400 italic">
                        Сначала добавьте помещения в разделе "Состав помещений"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem(category)}
              className="w-full py-3 rounded-xl border border-dashed border-zinc-200 text-zinc-400 font-medium text-sm hover:bg-zinc-50 hover:text-zinc-600 hover:border-zinc-300 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Добавить систему
            </button>
          </div>
        )}
      </FormBlock>
    );
  };

  return (
    <BriefBlockMain title="Инженерные системы" onBack={onBack}>
      {renderSection(
        "heatingSystem",
        "Отопление",
        ENGINEERING_OPTIONS.heating,
        Thermometer
      )}
      {renderSection(
        "warmFloorRooms",
        "Тёплый пол",
        ENGINEERING_OPTIONS.warmFloor,
        Thermometer
      )}
      {renderSection(
        "conditioningSystem",
        "Кондиционирование и вентиляция",
        ENGINEERING_OPTIONS.conditioning,
        Fan
      )}
      {renderSection(
        "purificationSystem",
        "Очистка воды",
        ENGINEERING_OPTIONS.purification,
        Droplets
      )}
      {renderSection(
        "electricSystem",
        "Электрика и слаботочка",
        ENGINEERING_OPTIONS.electric,
        Zap
      )}
      <BottomButtonBlock onSave={() => onSave(data)} />
    </BriefBlockMain>
  );
}
