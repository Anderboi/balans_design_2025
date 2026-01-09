"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResidentsSchema,
  type ResidentsFormValues,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface ResidentsFormProps {
  projectId?: string;
  initialData?: Partial<ResidentsFormValues>;
  onSave?: (data: ResidentsFormValues) => Promise<void>;
}

export function ResidentsForm({
  projectId,
  initialData,
  onSave,
}: ResidentsFormProps) {
  const form = useForm<ResidentsFormValues>({
    resolver: zodResolver(ResidentsSchema),
    defaultValues: initialData || {
      adults: [{ height: 170, gender: "male" }],
      children: [],
      hobbies: "",
      healthIssues: "",
      hasPets: false,
      petDetails: "",
    },
  });

  

  const {
    fields: adultsFields,
    append: appendAdult,
    remove: removeAdult,
  } = useFieldArray({
    control: form.control,
    name: "adults",
  });

  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: "children",
  });


  const handleSubmit = async (data: ResidentsFormValues) => {
    if (onSave) {
      await onSave(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Взрослые */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Взрослые</h3>
          </div>

          {adultsFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name={`adults.${index}.height`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Рост (см)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Рост (см)"
                        min={80}
                        max={280}
                        {...field}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`adults.${index}.gender`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Пол</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {adultsFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdult(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => appendAdult({ height: 170, gender: "male" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>

        {/* Дети */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Дети</h3>
          </div>

          {childrenFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name={`children.${index}.age`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Возраст</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Возраст"
                        {...field}
                        min={1}
                        max={18}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeChild(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => appendChild({ age: 5 })}
          >
            <Plus className="size-4 mr-2 " />
            Добавить
          </Button>
        </div>

        {/* Хобби */}
        <FormField
          control={form.control}
          name="hobbies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Хобби и увлечения</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите хобби и увлечения жильцов..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Проблемы со здоровьем */}
        <FormField
          control={form.control}
          name="healthIssues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Проблемы со здоровьем</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Укажите особые требования по здоровью..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Питомцы */}
        <FormField
          control={form.control}
          name="hasPets"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Есть питомцы?</FormLabel>
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

        {form.watch("hasPets") && (
          <FormField
            control={form.control}
            name="petDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Информация о питомцах</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Укажите вид, породу, особенности..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
