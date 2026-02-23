"use client";

import { useState, useEffect } from "react";
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
import { Loader2, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Введите название варианта"),
  description: z.string().optional(),
});

interface UploadVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  roomId: string;
  roomName: string;
  nextIndex: number;
  files: File[];
  onSuccess?: () => void;
}

export function UploadVariantDialog({
  open,
  onOpenChange,
  projectId,
  roomId,
  roomName,
  nextIndex,
  files: initialFiles,
  onSuccess,
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

  // Set automatic title when dialog opens or nextIndex/roomName changes
  useEffect(() => {
    if (open) {
      const currentTitle = form.getValues("title");
      // Only set if title is empty or was previously auto-generated
      if (!currentTitle || currentTitle.startsWith("Вариант")) {
        form.setValue("title", `Вариант ${nextIndex}. ${roomName}`);
      }
    }
  }, [open, nextIndex, roomName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialFiles.length === 0) return;

    try {
      setIsLoading(true);

      const uploadedImages = [];
      for (const file of initialFiles) {
        const { fullUrl } = await visualizationVariantsService.uploadFile(
          file,
          `${projectId}/${roomId}/visualizations`,
          supabase,
        );
        uploadedImages.push({
          id: crypto.randomUUID(),
          url: fullUrl,
          name: file.name,
          size: file.size,
        });
      }

      // Create variant record
      await visualizationVariantsService.createVisualizationVariant(
        {
          project_id: projectId,
          room_id: roomId,
          title: values.title,
          description: values.description || null,
          images: uploadedImages,
        },
        supabase,
      );

      form.reset();
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Error creating visualization variant:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новый вариант — {roomName}</DialogTitle>
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
                    <Input placeholder="Напр. Вариант 1. Гостиная" {...field} />
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
                      placeholder="Краткое описание (необязательно)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>
                Выбранные изображения ({initialFiles.length})
              </FormLabel>
              <div className="grid grid-cols-4 gap-2">
                {initialFiles.map((file, i) => (
                  <div
                    key={i}
                    className="aspect-square relative rounded-md bg-zinc-100 flex items-center justify-center overflow-hidden border"
                  >
                    <ImageIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Создать вариант
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
