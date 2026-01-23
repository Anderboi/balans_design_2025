"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateProfile, uploadAvatar } from "./actions";
import { useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { RoleBadge } from "@/components/ui/role-badge";
import { AppRole } from "@/types";
import { Database } from "@/types/supabase";

// Schema for profile validation
const profileFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Имя должно содержать минимум 2 символа.",
  }),
  last_name: z.string().min(2, {
    message: "Фамилия должна содержать минимум 2 символа.",
  }),
  email: z.string().email({
    message: "Введите корректный email.",
  }),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: {
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    avatar_url?: string;
    full_name_display?: string;
    role: Database["public"]["Enums"]["app_role"];
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      company: initialData.company,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      if (data.company) formData.append("company", data.company);

      const result = await updateProfile(formData);

      if (result.error) {
        toast.error("Ошибка обновления профиля");
      } else {
        toast.success("Профиль успешно обновлен");
      }
    });
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optimistic or loading state could be added here
    const toastId = toast.loading("Загрузка фото...");

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAvatar(formData);

    if (result.error) {
      toast.error("Ошибка загрузки фото", { id: toastId });
    } else {
      setAvatarUrl(result.avatarUrl);
      toast.success("Фото успешно обновлено", { id: toastId });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt={initialData.full_name_display} />
          <AvatarFallback>
            {initialData.first_name?.[0]}
            {initialData.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex flex-col">
          <h2 className="text-xl font-semibold">
            {initialData.full_name_display}
          </h2>
          <RoleBadge role={initialData.role as AppRole} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAvatarClick}
            disabled={isPending}
          >
            Изменить фото
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                    Имя
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                    Фамилия
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Фамилия" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                    Компания
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Название компании" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-zinc-900 text-white hover:bg-zinc-800"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить изменения
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
