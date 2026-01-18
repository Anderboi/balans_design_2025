import { z } from "zod";
import { MaterialType } from "@/types";

export const AssignMaterialSchema = z.object({
  projectId: z.string().min(1, "Необходимо выбрать проект"),
  quantity: z.coerce
    .number()
    .min(0.01, "Количество должно быть больше 0")
    .default(1),
});

export type AssignMaterialFormValues = z.infer<typeof AssignMaterialSchema>;

export const AddMaterialSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  type: z.nativeEnum(MaterialType),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  article: z.string().optional(),
  lead_time: z.coerce.number().min(0).default(0),
  product_url: z.string().url("Некорректный URL").optional().or(z.literal("")),
  size: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
  material: z.string().optional(),
  supplier: z.string().optional(),
  price: z.coerce.number().min(0).default(0),
  unit: z.string().optional(),
  image_url: z.string().optional(),
  in_stock: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

export type AddMaterialFormValues = z.infer<typeof AddMaterialSchema>;
