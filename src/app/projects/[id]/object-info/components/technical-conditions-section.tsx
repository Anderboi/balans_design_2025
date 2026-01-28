"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TechnicalConditionsSchema,
  type TechnicalConditionsFormValues,
} from "@/lib/schemas/brief-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainBlockCard from "@/components/ui/main-block-card";
import { Separator } from "@/components/ui/separator";
import { Wrench } from "lucide-react";
import { toast } from "sonner";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";

interface TechnicalConditionsSectionProps {
  projectId: string;
  initialData: TechnicalConditionsFormValues;
}

export function TechnicalConditionsSection({
  projectId,
  initialData,
}: TechnicalConditionsSectionProps) {
  const router = useRouter();

  const form = useForm<TechnicalConditionsFormValues>({
    resolver: zodResolver(TechnicalConditionsSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: TechnicalConditionsFormValues) => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      // Update object_info in project_briefs
      await projectsService.updateProjectBrief(projectId, {
        object_info: {
          technicalConditions: data,
        },
      });

      toast.success("Технические условия сохранены");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при сохранении данных");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <MainBlockCard className="space-y-6 p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Wrench className="size-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Технические условия (ТУ)
              </h3>
              <p className="text-sm text-gray-500">
                Выделенная мощность и ограничения от управляющей компании
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="voltageCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Выделенная мощность</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="15 кВт"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coolingCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мощность охлаждения</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="2.2 кВт"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Рекомендации по инженерным сетям</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Необходимо дополнительно закладывать силовой кабель..."
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium mb-2 block">
                Можете прикрепить техусловия
              </label>
              <Input
                type="file"
                className="w-full"
                disabled={form.formState.isSubmitting}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </MainBlockCard>
      </form>
    </Form>
  );
}
