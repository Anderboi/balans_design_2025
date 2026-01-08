"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout, User, MapPin, Image as ImageIcon, Square } from "lucide-react";
import { createProjectAction } from "@/lib/actions/projects";

interface CreateProjectDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
  children,
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    client_name: "", // Will be part of data even if not in DB yet (for mock)
    area: "",
    address: "",
    cover_url: "",
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form on close if needed, for now keep state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert area to number
      const areaNumber = parseFloat(formData.area) || 0;

      const result = await createProjectAction({
        name: formData.name,
        address: formData.address || "", // Fix undefined vs null mismatch
        area: areaNumber,
        client_id: null,
        stage: "PREPROJECT",
        residents: "",
        demolition_info: "",
        construction_info: "",
      });

      if (result.success) {
        setIsOpen(false);
        router.refresh();
        router.push(`/projects/${result.projectId}`);
      } else {
        console.error("Failed to create project:", result.error);
        // Show toast error here
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-gray-100 shadow-2xl rounded-3xl">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Новый проект
            </DialogTitle>
            {/* Close button is automatic in DialogContent usually, but we can customize or let it be */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1"
                >
                  Название проекта
                </Label>
                <div className="relative group">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Апартаменты на набережной" // Placeholder from screenshot
                    required
                    className="pl-9 h-12 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="client"
                    className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1"
                  >
                    Заказчик
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <Input
                      id="client"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_name: e.target.value,
                        })
                      }
                      placeholder="Имя Фамилия"
                      className="pl-9 h-12 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="area"
                    className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1"
                  >
                    Площадь (м²)
                  </Label>
                  <div className="relative group">
                    <Square className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="100"
                      required // Assuming area is required
                      className="pl-9 h-12 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1"
                >
                  Адрес
                </Label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Москва, Пресненская наб."
                    className="pl-9 h-12 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cover"
                  className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold pl-1"
                >
                  Обложка (URL)
                </Label>
                <div className="relative group">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <Input
                    id="cover"
                    value={formData.cover_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="pl-9 h-12 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 pb-6 mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="h-12 w-32 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-40 rounded-xl bg-black hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? "Создание..." : "+ Создать"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
