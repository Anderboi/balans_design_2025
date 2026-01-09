"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CommonDataSchema,
  type CommonFormValues,
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
import SubBlockCard from "@/components/ui/sub-block-card";
import { toast } from "sonner";
import { projectsService } from "@/lib/services/projects";
import { contactsService } from "@/lib/services/contacts";
import { useRouter } from "next/navigation";
import FormSubmitButton from './form-submit-button';

interface CommonInfoFormProps {
  projectId: string;
  initialData: CommonFormValues;
  contactId?: string;
  clientId?: string;
  onNext?: (data: CommonFormValues) => void;
}

export function CommonInfoForm({
  projectId,
  initialData,
  contactId,
  clientId,
  onNext,
}: CommonInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CommonFormValues>({
    resolver: zodResolver(CommonDataSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: CommonFormValues) => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      setIsLoading(true);
      console.log(data);
      // 1. Update Project Data
      await projectsService.updateProject(projectId, {
        address: data.address,
        area: data.area,
      });

      // 1.1 Update Brief General Info
      await projectsService.updateProjectBrief(projectId, {
        general_info: {
          contractNumber: data.contractNumber,
          startDate: data.startDate,
          finalDate: data.finalDate,
        },
      });

      // 2. Update Contact Data
      if (contactId) {
        const fullName = `${data.clientName} ${data.clientSurname}`.trim();
        await contactsService.updateContact(contactId, {
          name: fullName,
          email: data.email,
          phone: data.phone,
        });
      } else if (clientId) {
        // If client_id exists but contact fetch failed, we might need a way to find contact by client_id?
        // This logic remains similar to before but using props
      }

      // 3. Mark stage item as completed
      // Using 'preproject' stage and 'object_info' item based on config
      await projectsService.toggleProjectStageItem(
        projectId,
        "preproject",
        "object_info",
        true
      );

      // Update store - RESERVED for future if needed
      // setCommonData(data);

      toast.success("Общая информация сохранена");

      router.refresh(); // Refresh to update progress/status UI

      if (onNext) {
        onNext(data);
      }
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
        <SubBlockCard title="Клиент">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Иван" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSurname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Иванов"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@mail.com"
                      disabled={isLoading}
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
                    <Input
                      {...field}
                      placeholder="+7 (999) 000-00-00"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SubBlockCard>
        <SubBlockCard title="Объект">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес объекта</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Площадь (м²)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      min="0"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер договора</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="№ 123-45"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата начала</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="finalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата завершения</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SubBlockCard>
        <FormSubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
}
