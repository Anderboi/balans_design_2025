"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DemolitionSchema,
  type DemolitionType,
} from "@/lib/schemas/brief-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SubBlockCard from "@/components/ui/sub-block-card";
import { DoorOpen, Grid2x2, Hammer, Sofa } from "lucide-react";
import FormSubmitButton from "./form-submit-button";
import { updateProjectBriefAction } from "@/lib/actions/brief";
import { toast } from "sonner";
import { completeBriefSectionAction } from "@/lib/actions/stages";

interface DemolitionFormProps {
  projectId: string;
  initialData?: Partial<DemolitionType>;
}

export function DemolitionForm({
  projectId,
  initialData,
}: DemolitionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"save" | "complete">("save");

  const form = useForm<DemolitionType>({
    resolver: zodResolver(DemolitionSchema),
    defaultValues: initialData || {
      projectId: projectId,
      planChange: false,
      planChangeInfo: "",
      entranceDoorChange: false,
      enteranceDoorType: "",
      windowsChange: false,
      windowsType: "",
      furnitureDemolition: false,
      furnitureToDemolish: "",
    },
  });

  const handleSubmit = async (data: DemolitionType) => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      setIsLoading(true);

      const result = await updateProjectBriefAction(projectId, {
        demolition: data,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      if (action === "complete") {
        await completeBriefSectionAction(projectId, "demolition", true);
        toast.success("Раздел завершен");
        router.push(`/projects/${projectId}/brief`);
        return;
      }

      toast.success("Данные по демонтажу сохранены");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при сохранении данных");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SubBlockCard>
          <FormField
            control={form.control}
            name="planChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <Hammer className="size-5 text-zinc-600" />
                  <label
                    className="text-zinc-800 font-semibold "
                    htmlFor="planChange"
                  >
                    Демонтаж перегородок
                  </label>
                </div>
                <FormControl>
                  <Switch
                    id="planChange"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("planChange") && (
            <FormField
              control={form.control}
              name="planChangeInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание работ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Подробная информация по необходимому демонтажу стен и перегородок..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </SubBlockCard>

        <SubBlockCard>
          <FormField
            control={form.control}
            name="entranceDoorChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between ">
                <div className="gap-2 flex items-center">
                  <DoorOpen className="size-5 text-zinc-600" />
                  <label
                    className="text-zinc-800 font-semibold"
                    htmlFor="entranceDoorChange"
                  >
                    Замена входной двери
                  </label>
                </div>
                <FormControl>
                  <Switch
                    id="entranceDoorChange"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("entranceDoorChange") && (
            <FormField
              control={form.control}
              name="enteranceDoorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип двери</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Предпочтительный тип входной двери, требования к безопасности и дизайну..."
                      {...field}
                    ></Textarea>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </SubBlockCard>

        <SubBlockCard>
          <FormField
            control={form.control}
            name="windowsChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <Grid2x2 className="size-5 text-zinc-600" />
                  <label
                    className="text-zinc-800 font-semibold"
                    htmlFor="windowsChange"
                  >
                    Замена окон
                  </label>
                </div>
                <FormControl>
                  <Switch
                    id="windowsChange"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("windowsChange") && (
            <FormField
              control={form.control}
              name="windowsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип остекления</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Материал профиля (алюминий/дерево/пластик), цвет, количество камер..."
                      {...field}
                    ></Textarea>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </SubBlockCard>

        <SubBlockCard>
          <FormField
            control={form.control}
            name="furnitureDemolition"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sofa className="size-5 text-zinc-600" />
                  <label
                    className="text-zinc-800 font-semibold"
                    htmlFor="furnitureDemolition"
                  >
                    Демонтаж мебели
                  </label>
                </div>
                <FormControl>
                  <Switch
                    id="furnitureDemolition"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("furnitureDemolition") && (
            <FormField
              control={form.control}
              name="furnitureToDemolish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Что демонтируем?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Шкафы, антресоли, кухни, которые необходимо разобрать..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </SubBlockCard>
        <FormSubmitButton isLoading={isLoading} onActionSelect={setAction} />
      </form>
    </Form>
  );
}
