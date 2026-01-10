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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Heart, PawPrint } from "lucide-react";
import SubBlockCard from "@/components/ui/sub-block-card";
import DeleteIconButton from "@/components/ui/delete-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import FormSubmitButton from "./form-submit-button";
import { useState } from "react";
import { projectsService } from "@/lib/services/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddItemButton from "@/components/ui/add-item-button";

interface ResidentsFormProps {
  projectId?: string;
  initialData?: Partial<ResidentsFormValues>;
}

export function ResidentsForm({ projectId, initialData }: ResidentsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }

    try {
      setIsLoading(true);

      await projectsService.updateProjectBrief(projectId, {
        residents: data,
      });

      toast.success("Данные о проживающих сохранены");
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
        <SubBlockCard title="Взрослые">
          {/* Взрослые */}
          <div className="space-y-5">
            {adultsFields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-end animate-fade-in"
              >
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
                    <FormItem className="flex-1">
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
                  <DeleteIconButton onClick={() => removeAdult(index)} />
                )}
              </div>
            ))}
            <AddItemButton
              onClick={() => appendAdult({ height: 170, gender: "male" })}
            >
              Добавить взрослого
            </AddItemButton>
          </div>
        </SubBlockCard>

        <SubBlockCard title="Дети">
          {/* Дети */}
          <div className="space-y-5">
            {childrenFields.length === 0 && (
              <p className="text-sm text-zinc-400 mb-2">Нет детей</p>
            )}
            {childrenFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
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

                {childrenFields.length > 0 && (
                  <DeleteIconButton onClick={() => removeChild(index)} />
                )}
              </div>
            ))}
            <AddItemButton onClick={() => appendChild({ age: 5 })}>
              Добавить ребенка
            </AddItemButton>
          </div>
        </SubBlockCard>
        <SubBlockCard title="Образ жизни">
          {/* Хобби */}
          <FormField
            control={form.control}
            name="hobbies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Увлечения</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Heart className="size-5" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="Что необходимо предусмотреть для хобби (хранение лыж, мольберт, библиотека)?"
                      {...field}
                    />
                  </InputGroup>
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
                <FormLabel>Ограничения по здоровью</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Activity className="size-5" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="Аллергии, необходимость безбарьерной среды и т.д."
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SubBlockCard>
        <SubBlockCard title="Питомцы">
          {/* Питомцы */}
          <FormField
            control={form.control}
            name="petDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание питомцев</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <PawPrint className="size-5" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="Вид, порода, где спят, где едят, нужно ли мыть лапы?"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SubBlockCard>
        <FormSubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
}
