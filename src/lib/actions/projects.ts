"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateProjectFormData {
  name: string;
  address?: string;
  area?: number;
  client_id: string | null;
  stage: string;
  residents?: string;
  demolition_info?: string;
  construction_info?: string;
}

export async function createProjectAction(formData: CreateProjectFormData) {
  const supabase = await createClient();

  try {
    // Вызвать функцию PostgreSQL
    const { data, error } = await supabase.rpc("create_project_with_owner", {
      p_name: formData.name,
      p_address: formData.address || "",
      p_area: formData.area || 0,
      p_client_id: formData.client_id || null,
      p_stage: formData.stage,
      p_residents: formData.residents || "",
      p_demolition_info: formData.demolition_info || "",
      p_construction_info: formData.construction_info || "",
    });

    if (error) {
      console.error("Error creating project:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/projects");
    return { success: true, projectId: data.id };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Произошла непредвиденная ошибка" };
  }
}
