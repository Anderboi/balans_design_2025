"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { materialsService } from "@/lib/services/materials";
import { Material, Project } from "@/types";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AssignMaterialSchema,
  AssignMaterialFormValues,
} from "@/lib/schemas/materials";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface AssignMaterialDialogProps {
  material: Material;
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialAssigned: () => void;
}

export function AssignMaterialDialog({
  material,
  projects,
  open,
  onOpenChange,
  onMaterialAssigned,
}: AssignMaterialDialogProps) {
  const form = useForm<AssignMaterialFormValues>({
    resolver: zodResolver(
      AssignMaterialSchema
    ) as Resolver<AssignMaterialFormValues>,
    defaultValues: {
      projectId: "",
      quantity: 1,
    },
  });

  const onSubmit = async (values: AssignMaterialFormValues) => {
    try {
      await materialsService.addSpecification({
        project_id: values.projectId,
        material_id: material.id,
        quantity: values.quantity,
        name: material.name,
        description: material.description,
        manufacturer: material.manufacturer,
        article: material.article,
        lead_time: material.lead_time,
        product_url: material.product_url,
        size: material.size,
        color: material.color,
        finish: material.finish,
        material: material.material,
        type: material.type,
        supplier: material.supplier,
        price: material.price,
        unit: material.unit,
        image_url: material.image_url,
        notes: "",
      });

      onMaterialAssigned();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Ошибка при присвоении материала:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Присвоить материал проекту</DialogTitle>
          <DialogDescription>
            Выберите проект для материала &quot;{material.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Выбор проекта */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Проект *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите проект" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Количество */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество *</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          min={material.unit === "шт" ? 1 : 0.01}
                          step={material.unit === "шт" ? 1 : 0.01}
                          placeholder="1"
                          className="flex-1"
                          {...field}
                          onFocus={(e) => e.target.select()}
                        />
                        <InputGroupAddon align="inline-end">
                          {material.unit}
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Информация о материале */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div>
                  <strong>Материал:</strong> {material.name}
                </div>
                <div>
                  <strong>Тип:</strong> {material.type}
                </div>
                <div>
                  <strong>Производитель:</strong> {material.manufacturer}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Присваивание..."
                  : "Присвоить материал"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
