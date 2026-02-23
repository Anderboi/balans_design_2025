"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2, ImageIcon, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisualizationVariant } from "@/types/visualizations";

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
  onSuccess?: (variant: VisualizationVariant) => void;
}

export function UploadVariantDialog({
  open,
  onOpenChange,
  projectId,
  roomId,
  roomName,
  nextIndex,
  onSuccess,
}: UploadVariantDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    } else {
      // Clear files when closing
      setSelectedFiles([]);
      form.reset();
    }
  }, [open, nextIndex, roomName, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedFiles.length === 0) return;

    try {
      setIsLoading(true);

      const uploadedImages = [];
      for (const file of selectedFiles) {
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
          type: file.type,
        });
      }

      // Find the first image to use as a cover (legacy support)
      const firstImage = uploadedImages.find((f) =>
        f.type?.startsWith("image/"),
      );
      const firstFile = uploadedImages[0];

      // Create variant record
      const newVariant =
        await visualizationVariantsService.createVisualizationVariant(
          {
            project_id: projectId,
            room_id: roomId,
            title: values.title,
            description: values.description || null,
            images: uploadedImages,
            // Legacy fields support
            image_url: firstImage?.url || undefined,
            file_url: firstFile?.url || undefined,
            file_name: firstFile?.name || undefined,
            file_size: firstFile?.size || undefined,
          },
          supabase,
        );

      form.reset();
      setSelectedFiles([]);
      onOpenChange(false);
      onSuccess?.(newVariant);
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

            <div className="space-y-3">
              <FormLabel>Файлы (изображения или PDF)</FormLabel>
              <div
                className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <Upload className="size-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Нажмите для загрузки</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Изображения или PDF до 20MB
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100 italic"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="size-4 text-zinc-400 shrink-0" />
                        ) : (
                          <Upload className="size-4 text-zinc-400 shrink-0" />
                        )}
                        <span className="text-xs text-zinc-600 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || selectedFiles.length === 0}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Загрузка..." : "Создать вариант"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
