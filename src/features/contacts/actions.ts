"use server";

import { companiesService } from "@/lib/services/companies";
import { contactsService } from "@/lib/services/contacts";
import { createClient } from "@/lib/supabase/server";
import { Company, Contact, ContactType } from "@/types";
import { revalidateTag } from "next/cache";
import { cache } from "react";

// Эта функция избавляет от дублирования try/catch и проверок авторизации
export async function withAuth<T>(
  action: (userId: string, supabase: any) => Promise<T>,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Не авторизован" };
    }

    const result = await action(user.id, supabase);
    return { success: true, data: result };
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Внутренняя ошибка сервера",
    };
  }
}

export const getCompanies = cache(async () => {
  const supabase = await createClient();
  return companiesService.getCompanies(supabase);
});

export const getContacts = cache(async () => {
  const supabase = await createClient();
  return contactsService.getContacts(supabase);
});

export const getClients = cache(async () => {
  const supabase = await createClient();
  return await contactsService.getContactsByType(ContactType.CLIENT, supabase);
});

//? mutations

export async function createCompany(
  company: Omit<Company, "id" | "created_at" | "updated_at">,
) {
  return withAuth(async (userId, supabase) => {
    const result = await companiesService.createCompany(
      { ...company, user_id: userId },
      supabase,
    );
    revalidateTag("companies", "max");
    return result;
  });
}

export async function deleteCompany(id: string) {
  return withAuth(async (_, supabase) => {
    await companiesService.deleteCompany(id, supabase);
    revalidateTag("companies", "max");
    return true;
  });
}

export async function updateCompany(id: string, updates: Partial<Company>) {
  return withAuth(async (_, supabase) => {
    const result = await companiesService.updateCompany(id, updates, supabase);
    revalidateTag("companies", "max");
    return result;
  });
}

export async function createContact(
  contact: Omit<Contact, "id" | "created_at" | "updated_at">,
) {
  return withAuth(async (userId, supabase) => {
    const result = await contactsService.createContact(
      { ...contact, user_id: userId },
      supabase,
    );

    revalidateTag("contacts", "max");
    return result;
  });
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  return withAuth(async (_, supabase) => {
    const result = await contactsService.updateContact(id, updates, supabase);
    revalidateTag("contacts", "max");
    return result;
  });
}

export async function deleteContact(id: string) {
  return withAuth(async (_, supabase) => {
    await contactsService.deleteContact(id, supabase);
    revalidateTag("contacts", "max");
    return true;
  });
}
