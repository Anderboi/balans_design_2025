"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { visualizationVariantsService } from "@/lib/services/visualization-variants";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Введите название варианта"),
  description: z.string().optional(),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Выберите файл"),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Выберите изображение"),
});

interface UploadVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  roomId: string;
  roomName: string;
}

export function UploadVariantDialog({
  open,
  onOpenChange,
  projectId,
  roomId,
  roomName,
}: UploadVariantDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const file = values.file[0];
      const image = values.image[0];

      // Upload file
      const { fullUrl: fileUrl } =
        await visualizationVariantsService.uploadFile(
          file,
          `${projectId}/${roomId}/files`,
          supabase,
        );

      // Upload image
      const { fullUrl: imageUrl } =
        await visualizationVariantsService.uploadFile(
          image,
          `${projectId}/${roomId}/images`,
          supabase,
        );

      // Create variant record
      await visualizationVariantsService.createVisualizationVariant(
        {
          project_id: projectId,
          room_id: roomId,
          title: values.title,
          description: values.description || "",
          file_url: fileUrl,
          image_url: imageUrl,
          file_size: file.size,
          file_name: file.name,
        },
        supabase,
      );

      form.reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error uploading visualization variant:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Загрузить визуализацию — {roomName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Вариант 1: Основной ракурс"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Краткое описание визуализации"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Изображение (превью)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Файл (PDF, JPG, PNG)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Загрузить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
