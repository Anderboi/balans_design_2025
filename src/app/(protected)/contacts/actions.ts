"use server";

import { companiesService } from "@/lib/services/companies";
import { contactsService } from "@/lib/services/contacts";
import { getUser } from "@/lib/supabase/getuser";
import { Company, Contact, ContactType } from "@/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getCompanies() {
  try {
    const supabase = await createClient();
    return await companiesService.getCompanies(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке компаний:", error);
    throw error;
  }
}

export async function getContacts() {
  try {
    const supabase = await createClient();
    return await contactsService.getContacts(supabase);
  } catch (error) {
    console.error("Ошибка при загрузке контактов:", error);
    throw error;
  }
}

export async function getClients() {
  try {
    const supabase = await createClient();
    return await contactsService.getContactsByType(
      ContactType.CLIENT,
      supabase,
    );
  } catch (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    throw error;
  }
}

export async function createCompany(
  company: Omit<Company, "id" | "created_at" | "updated_at">,
) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    const result = await companiesService.createCompany(
      {
        ...company,
        user_id: user?.id,
      },
      supabase,
    );
    revalidatePath("/contacts");
    return { success: true, data: result };
  } catch (error) {
    console.error("Ошибка при добавлении компании:", error);
    return { success: false, error: "Не удалось добавить компанию" };
  }
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  try {
    const supabase = await createClient();
    await contactsService.updateContact(id, updates, supabase);
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении контакта:", error);
    return { success: false, error: "Не удалось обновить контакт" };
  }
}

export async function createContact(
  contact: Omit<Contact, "id" | "created_at" | "updated_at">,
) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    const data = await contactsService.createContact(
      {
        ...contact,
        user_id: user?.id,
      },
      supabase,
    );
    revalidatePath("/contacts");
    return { success: true, data };
  } catch (error) {
    console.error("Ошибка при создании контакта:", error);
    return { success: false, error: "Не удалось создать контакт" };
  }
}
export async function deleteContact(id: string) {
  try {
    const supabase = await createClient();
    await contactsService.deleteContact(id, supabase);
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении контакта:", error);
    return { success: false, error: "Не удалось удалить контакт" };
  }
}

export async function deleteCompany(id: string) {
  try {
    const supabase = await createClient();
    await companiesService.deleteCompany(id, supabase);
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении компании:", error);
    return { success: false, error: "Не удалось удалить компанию" };
  }
}
