"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResponsiblePersonSchema,
  type ResponsiblePersonFormValues,
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
import { Button } from "@/components/ui/button";
import MainBlockCard from "@/components/ui/main-block-card";
import { Separator } from "@/components/ui/separator";
import { User, Phone } from "lucide-react";
import { toast } from "sonner";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";
import { formatPhoneNumber } from "@/lib/utils/utils";

interface ResponsiblePersonSectionProps {
  projectId: string;
  initialData: ResponsiblePersonFormValues;
}

export function ResponsiblePersonSection({
  projectId,
  initialData,
}: ResponsiblePersonSectionProps) {
  const router = useRouter();

  const form = useForm<ResponsiblePersonFormValues>({
    resolver: zodResolver(ResponsiblePersonSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: ResponsiblePersonFormValues) => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      // Update object_info in project_briefs
      await projectsService.updateProjectBrief(projectId, {
        object_info: {
          responsiblePerson: data,
        },
      });

      toast.success("Ответственное лицо сохранено");
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
              <User className="size-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ответственное лицо</h3>
              <p className="text-sm text-gray-500">
                Контакт для служб доставки и подрядчиков
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО Ответственного</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Иванов Петр Петрович"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Должность</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Должность"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+7 (999) 999 99 99"
                        className="pl-10"
                        disabled={form.formState.isSubmitting}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
