"use client";

import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  EngineeringSystemsSchema,
  EngineeringSystemsType,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { Form } from "@/components/ui/form";
import FormSubmitButton from "./form-submit-button";
import { projectsService } from "@/lib/services/projects";
import { EngineeringSection } from "./engineering-section";
import { ENGINEERING_OPTIONS } from "../../constants/engineering-options";

interface EngineeringFormProps {
  projectId: string;
  initialData?: Partial<EngineeringSystemsType>;
  roomList: Room[];
}

export function EngineeringForm({
  projectId,
  initialData,
  roomList = [],
}: EngineeringFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([
      "heatingSystem",
      "warmFloorRooms",
      "conditioningSystem",
      "purificationSystem",
      "electricSystem",
    ])
  );

  const form = useForm<EngineeringSystemsType>({
    resolver: zodResolver(EngineeringSystemsSchema),
    defaultValues: initialData || {
      heatingSystem: [{ system: "", rooms: [] }],
      warmFloorRooms: [{ system: "", rooms: [] }],
      conditioningSystem: [{ system: "", rooms: [] }],
      purificationSystem: [{ system: "", rooms: [] }],
      electricSystem: [{ system: "", rooms: [] }],
    },
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(section) ? newSet.delete(section) : newSet.add(section);
      return newSet;
    });
  };

  const getCategoryItemCount = (
    category: keyof EngineeringSystemsType
  ): number => {
    const sections = form.watch(category);
    return sections?.filter((s) => s?.system).length || 0;
  };

  async function onSubmit(data: EngineeringSystemsType) {
    startTransition(async () => {
      try {
        // Фильтруем пустые секции
        const cleanedData: Partial<EngineeringSystemsType> = {
          heatingSystem:
            data.heatingSystem?.filter((item) => item?.system) || [],
          warmFloorRooms:
            data.warmFloorRooms?.filter((item) => item?.system) || [],
          conditioningSystem:
            data.conditioningSystem?.filter((item) => item?.system) || [],
          purificationSystem:
            data.purificationSystem?.filter((item) => item?.system) || [],
          electricSystem:
            data.electricSystem?.filter((item) => item?.system) || [],
        };

        await projectsService.updateProjectBrief(projectId, {
          engineering: cleanedData,
        });

        toast.success("Инженерные системы сохранены");
        router.push(`/projects/${projectId}/brief`);
        router.refresh();
      } catch (error) {
        console.error("Error saving engineering data:", error);
        toast.error("Ошибка при попытке сохранения данных");
      }
    });
  }

  function onError(errors: FieldErrors<EngineeringSystemsType>) {
    console.error("Form validation errors:", errors);

    // Находим первое сообщение об ошибке
    const firstErrorMessage = Object.values(errors).find(
      (error) => error?.message
    )?.message;

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    } else {
      toast.error("Проверьте правильность заполнения формы");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex h-full w-full flex-col"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Инженерные системы</h2>
          {/* Показываем предупреждение если нет комнат */}
          {roomList.length === 0 && (
            <div className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-lg">
              Добавьте помещения
            </div>
          )}
          <EngineeringSection
            category="heatingSystem"
            title="Отопление"
            icon="thermometer"
            options={ENGINEERING_OPTIONS.heating}
            control={form.control}
            roomList={roomList}
            expanded={expandedSections.has("heatingSystem")}
            onToggleExpanded={() => toggleSection("heatingSystem")}
            itemCount={getCategoryItemCount("heatingSystem")}
          />

          <EngineeringSection
            category="warmFloorRooms"
            title="Тёплый пол"
            icon="thermometer"
            options={ENGINEERING_OPTIONS.warmFloor}
            control={form.control}
            roomList={roomList}
            expanded={expandedSections.has("warmFloorRooms")}
            onToggleExpanded={() => toggleSection("warmFloorRooms")}
            itemCount={getCategoryItemCount("warmFloorRooms")}
          />

          <EngineeringSection
            category="conditioningSystem"
            title="Кондиционирование и вентиляция"
            icon="fan"
            options={ENGINEERING_OPTIONS.conditioning}
            control={form.control}
            roomList={roomList}
            expanded={expandedSections.has("conditioningSystem")}
            onToggleExpanded={() => toggleSection("conditioningSystem")}
            itemCount={getCategoryItemCount("conditioningSystem")}
          />

          <EngineeringSection
            category="purificationSystem"
            title="Очистка воды"
            icon="droplets"
            options={ENGINEERING_OPTIONS.purification}
            control={form.control}
            roomList={roomList}
            expanded={expandedSections.has("purificationSystem")}
            onToggleExpanded={() => toggleSection("purificationSystem")}
            itemCount={getCategoryItemCount("purificationSystem")}
          />

          <EngineeringSection
            category="electricSystem"
            title="Электрика и слаботочка"
            icon="zap"
            options={ENGINEERING_OPTIONS.electric}
            control={form.control}
            roomList={roomList}
            expanded={expandedSections.has("electricSystem")}
            onToggleExpanded={() => toggleSection("electricSystem")}
            itemCount={getCategoryItemCount("electricSystem")}
          />
        </div>

        <FormSubmitButton isLoading={isPending} />
      </form>
    </Form>
  );
}
