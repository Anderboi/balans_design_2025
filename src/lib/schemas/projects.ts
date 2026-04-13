import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Название проекта обязательно"),
  client_name: z.string().optional(),
  area: z.string().optional(),
  address: z.string().optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;
