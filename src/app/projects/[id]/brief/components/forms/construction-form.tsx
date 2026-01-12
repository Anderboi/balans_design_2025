"use client";

import { Form } from "@/components/ui/form";
import {
  ConstructionFormValues,
  ConstructionInfoSchema,
} from "@/lib/schemas/brief-schema";
import { Room } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useForm,
  Path,
  FieldErrors,
} from "react-hook-form";
import { toast } from "sonner";
import FormSubmitButton from "./form-submit-button";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";
import { CONSTRUCTION_TYPES } from "../../constants/construction-options";
import { MaterialSection } from "./construction-material-section";
import { useDebounce } from "@/hooks/useDebounce";

interface ConstructionFormProps {
  projectId: string;
  initialData?: Partial<ConstructionFormValues>;
  roomList: Room[];
}

export function ConstructionForm({
  projectId,
  initialData,
  roomList,
}: ConstructionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  const getCategoryItemCount = (category: "floor" | "ceiling" | "walls") => {
    const sections = form.watch(category);
    return sections?.filter((s) => s?.type && s?.rooms?.length > 0).length || 0;
  };

  async function onSubmit(data: ConstructionFormValues) {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }
    startTransition(async () => {
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
    });
  }

  function onError(errors: FieldErrors<ConstructionFormValues>) {
    console.error("Form validation errors:", errors);

    // Находим первую ошибку с message
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
          <h2 className="text-2xl font-bold">Информация по монтажу</h2>

          <MaterialSection
            category="walls"
            title="Стены"
            types={CONSTRUCTION_TYPES.walls}
            control={form.control}
            roomList={roomList}
            expanded={expandedCategories.has("walls")}
            onToggleExpanded={() => toggleCategory("walls")}
            itemCount={getCategoryItemCount("walls")}
          />

          <MaterialSection
            category="ceiling"
            title="Потолок"
            types={CONSTRUCTION_TYPES.ceiling}
            control={form.control}
            roomList={roomList}
            expanded={expandedCategories.has("ceiling")}
            onToggleExpanded={() => toggleCategory("ceiling")}
            itemCount={getCategoryItemCount("ceiling")}
          />

          <MaterialSection
            category="floor"
            title="Напольные покрытия"
            types={CONSTRUCTION_TYPES.floor}
            control={form.control}
            roomList={roomList}
            expanded={expandedCategories.has("floor")}
            onToggleExpanded={() => toggleCategory("floor")}
            itemCount={getCategoryItemCount("floor")}
          />
        </div>
        <FormSubmitButton isLoading={isPending} />
      </form>
    </Form>
  );
}
