"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocationLogisticsSchema,
  type LocationLogisticsFormValues,
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
import MainBlockCard from "@/components/ui/main-block-card";
import { Separator } from "@/components/ui/separator";
import SubBlockCard from "@/components/ui/sub-block-card";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { projectsService } from "@/lib/services/projects";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LocationLogisticsSectionProps {
  projectId: string;
  projectAddress: string;
  initialData: LocationLogisticsFormValues;
}

export function LocationLogisticsSection({
  projectId,
  projectAddress,
  initialData,
}: LocationLogisticsSectionProps) {
  const router = useRouter();

  const form = useForm<LocationLogisticsFormValues>({
    resolver: zodResolver(LocationLogisticsSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: LocationLogisticsFormValues) => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      // Update object_info in project_briefs
      await projectsService.updateProjectBrief(projectId, {
        object_info: {
          location: data,
        },
      });

      toast.success("Локация и логистика сохранены");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при сохранении данных");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <MainBlockCard className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <MapPin className="size-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Локация и Логистика</h3>
              <p className="text-sm text-gray-500">
                Адрес, доступность и параметры для доставки материалов
              </p>
            </div>
          </div>

          <Separator />

          <div className="gap-4 flex flex-col sm:flex-row">
            <div className="flex-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Точный адрес объекта
              </label>
              <Input value={projectAddress} readOnly />
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Этаж</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="1"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        value={field.value ?? ""}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entrance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подъезд</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="1"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        value={field.value ?? ""}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="53645"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <span className="text-lg font-semibold">Лифтовое оборудование</span>

          <div className="flex gap-4 w-full flex-col md:flex-row">
            <SubBlockCard className="flex-1" title="Пассажирский лифт">
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="passengerLift.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ширина (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengerLift.depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Глубина (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengerLift.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Высота (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SubBlockCard>

            <SubBlockCard className="flex-1" title="Грузовой лифт">
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="freightLift.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ширина (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="freightLift.depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Глубина (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="freightLift.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Высота (см)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          value={field.value ?? ""}
                          className="text-center"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SubBlockCard>
          </div>

          <FormField
            control={form.control}
            name="logisticsRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Правила разгрузки / Паркинг / Часы тишины</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Опишите ограничения..."
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
