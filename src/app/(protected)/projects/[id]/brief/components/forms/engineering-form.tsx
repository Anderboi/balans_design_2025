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
import { EngineeringSection } from "./engineering-section";
import { ENGINEERING_OPTIONS } from "../../constants/engineering-options";
import { completeBriefSectionAction } from "@/lib/actions/stages";
import { updateProjectBriefAction } from "@/lib/actions/brief";

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
    ]),
  );
  const [action, setAction] = useState<"save" | "complete">("save");

  const form = useForm<EngineeringSystemsType>({
    resolver: zodResolver(EngineeringSystemsSchema),
    defaultValues: {
      heatingSystem: initialData?.heatingSystem || [{ system: "", rooms: [] }],
      warmFloorRooms: initialData?.warmFloorRooms || [
        { system: "", rooms: [] },
      ],
      conditioningSystem: initialData?.conditioningSystem || [
        { system: "", rooms: [] },
      ],
      purificationSystem: initialData?.purificationSystem || [
        { system: "", rooms: [] },
      ],
      electricSystem: initialData?.electricSystem || [
        { system: "", rooms: [] },
      ],
    },
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getCategoryItemCount = (
    category: keyof EngineeringSystemsType,
  ): number => {
    const sections = form.watch(category);
    return sections?.filter((s) => s?.system).length || 0;
  };

  const handleSubmit = (data: EngineeringSystemsType) =>{
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

        const result = await updateProjectBriefAction(projectId, {
          engineering: cleanedData,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        if (action === "complete") {
          await completeBriefSectionAction(projectId, "engineering", true);
          toast.success("Раздел завершен");
          router.push(`/projects/${projectId}/brief`);
          return;
        }

        toast.success("Инженерные системы сохранены");
        router.push(`/projects/${projectId}/brief`);
        
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
      (error) => error?.message,
    )?.message;

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    } else {
      toast.error("Проверьте правильность заполнения формы");
    }
  }

  const isFormDisabled = isPending || form.formState.isSubmitting;
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onError)}
        className="space-y-4 sm:space-y-6"
      >
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

        <FormSubmitButton
          isLoading={isFormDisabled}
          onActionSelect={setAction}
        />
      </form>
    </Form>
  );
}
