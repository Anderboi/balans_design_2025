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
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { DRAWING_CATEGORIES, DrawingCategory } from "@/types/drawings";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Введите название"),
  description: z.string().optional(),
  category: z.string().min(1, "Выберите раздел"),
});

interface UploadDrawingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function UploadDrawingDialog({
  open,
  onOpenChange,
  projectId,
}: UploadDrawingDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Допускаются только PDF-файлы");
      return;
    }
    setSelectedFile(file);
    // Auto-fill title from filename if empty
    if (!form.getValues("title")) {
      const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
      form.setValue("title", nameWithoutExt);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast.error("Выберите PDF-файл");
      return;
    }

    try {
      setIsLoading(true);

      const { fullUrl: fileUrl } = await drawingSetsService.uploadFile(
        selectedFile,
        `${projectId}/drawings`,
        supabase,
      );

      await drawingSetsService.createDrawingSet(
        {
          project_id: projectId,
          title: values.title,
          description: values.description || null,
          category: values.category as DrawingCategory,
          file_url: fileUrl,
          file_size: selectedFile.size,
          file_name: selectedFile.name,
        },
        supabase,
      );

      form.reset();
      setSelectedFile(null);
      onOpenChange(false);
      toast.success("Чертёж загружен");
      router.refresh();
    } catch (error) {
      console.error("Error uploading drawing:", error);
      toast.error("Ошибка при загрузке файла");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
          setSelectedFile(null);
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Загрузить чертёж</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Загрузите PDF-файл рабочей документации
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-2"
          >
            {/* Drop Zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                dragOver
                  ? "border-black bg-zinc-50"
                  : selectedFile
                    ? "border-green-300 bg-green-50/50"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
            >
              {selectedFile ? (
                <div className="flex items-center gap-3 justify-center">
                  <div className="size-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <FileText className="size-5 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-800 truncate max-w-[300px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB ·
                      Нажмите для замены
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="size-8 text-zinc-300" />
                  <p className="text-sm text-zinc-500">
                    Перетащите PDF или{" "}
                    <span className="text-black font-medium">
                      выберите файл
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400">Только .pdf, до 50 MB</p>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Демонтажный план" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Раздел</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите раздел" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DRAWING_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Описание{" "}
                    <span className="text-zinc-400 font-normal">
                      (необязательно)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Краткое описание содержания документа"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-black hover:bg-zinc-800"
              disabled={isLoading || !selectedFile}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Загрузить документ
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
