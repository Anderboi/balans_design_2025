import { z } from "zod";
import { ContactType } from "@/types";

export const EditContactSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  type: z.nativeEnum(ContactType),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
  company_id: z.string().uuid().optional().nullable(),
});

export type EditContactFormValues = z.infer<typeof EditContactSchema>;
