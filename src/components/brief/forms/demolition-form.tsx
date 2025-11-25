"use client";

import { useForm } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DemolitionFormProps {
  projectId?: string;
  initialData?: Partial<DemolitionType>;
  onSave?: (data: DemolitionType) => Promise<void>;
}

export function DemolitionForm({
  projectId,
  initialData,
  onSave,
}: DemolitionFormProps) {
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
    if (onSave) {
      await onSave(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Изменение планировки */}
        <article className="rounded-lg border p-4 space-y-6">
          <FormField
            control={form.control}
            name="planChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Изменение планировки
                  </FormLabel>
                  <FormDescription>
                    Требуется ли перепланировка помещения?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
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
                  <FormLabel>Описание изменений планировки</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите планируемые изменения..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </article>

        {/* Входная дверь */}
        <article className="rounded-lg border p-4 space-y-6">
          <FormField
            control={form.control}
            name="entranceDoorChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Замена входной двери
                  </FormLabel>
                  <FormDescription>
                    Планируется ли замена входной двери?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
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
                  <FormLabel>Тип входной двери</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип двери" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="metal">Металлическая</SelectItem>
                      <SelectItem value="wood">Деревянная</SelectItem>
                      <SelectItem value="mdf">МДФ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </article>

        {/* Окна */}
        <article className="rounded-lg border p-4 space-y-6">
          <FormField
            control={form.control}
            name="windowsChange"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Замена окон</FormLabel>
                  <FormDescription>
                    Планируется ли замена оконных блоков?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
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
                  <FormLabel>Тип окон</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип окон" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pvc">ПВХ</SelectItem>
                      <SelectItem value="wood">Деревянные</SelectItem>
                      <SelectItem value="aluminum">Алюминиевые</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </article>

        {/* Демонтаж мебели */}
        <article className="rounded-lg border p-4 space-y-6">
          <FormField
            control={form.control}
            name="furnitureDemolition"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Демонтаж мебели</FormLabel>
                  <FormDescription>
                    Требуется ли демонтаж существующей мебели?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
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
                  <FormLabel>Мебель для демонтажа</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Перечислите мебель, подлежащую демонтажу..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </article>
      </form>
    </Form>
  );
}
