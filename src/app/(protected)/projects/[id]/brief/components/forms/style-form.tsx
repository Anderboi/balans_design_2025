"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSubmitButton from "./form-submit-button";
import { updateProjectBriefAction } from "@/lib/actions/brief";
import { completeBriefSectionAction } from "@/lib/actions/stages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubBlockCard from "@/components/ui/sub-block-card";
import { StyleSchema, StyleFormValues } from "@/lib/schemas/brief-schema";
import { Palette, Link as LinkIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface StyleFormProps {
  projectId: string;
  initialData?: StyleFormValues;
}

export function StyleForm({ projectId, initialData }: StyleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"save" | "complete">("save");

  const form = useForm<StyleFormValues>({
    resolver: zodResolver(StyleSchema),
    defaultValues: initialData || {
      preferences: "",
      pinterestLink: "",
    },
  });

  const handleSubmit = (data: StyleFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateProjectBriefAction(projectId, {
          style: data,
        });

        if (!result.success) {
          throw new Error(result.error as string);
        }

        if (action === "complete") {
          await completeBriefSectionAction(projectId, "style", true);
          toast.success("Раздел завершен");
          router.push(`/projects/${projectId}/brief`);
          return;
        }

        toast.success("Стилевые предпочтения сохранены");
      } catch (error) {
        console.error(error);
        toast.error("Ошибка при сохранении данных");
      }
    });
  };
  const isFormDisabled = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <SubBlockCard>
          <FormField
            control={form.control}
            name="preferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание предпочтений</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Palette className="size-5" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="Опишите желаемый стиль, цвета, материалы..."
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <FormField
              control={form.control}
              name="pinterestLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на Pinterest / Moodboard</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <LinkIcon className="size-5 text-zinc-500" />
                      <Input
                        placeholder="https://ru.pinterest.com/..."
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SubBlockCard>
        <FormSubmitButton
          isLoading={isFormDisabled}
          onActionSelect={setAction}
        />
      </form>
    </Form>
  );
}
