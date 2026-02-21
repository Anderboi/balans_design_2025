"use server";

import { companiesService } from "@/lib/services/companies";
import { contactsService } from "@/lib/services/contacts";
import { Company, Contact, ContactType } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCompanies() {
  try {
    return await companiesService.getCompanies();
  } catch (error) {
    console.error("Ошибка при загрузке компаний:", error);
    throw error;
  }
}

export async function getClients() {
  try {
    return await contactsService.getContactsByType(ContactType.CLIENT);
  } catch (error) {
    console.error("Ошибка при загрузке контактов:", error);
    throw error;
  }
}

export async function createCompany(
  company: Omit<Company, "id" | "created_at" | "updated_at">,
) {
  try {
    const result = await companiesService.createCompany(company);
    revalidatePath("/contacts");
    return { success: true, data: result };
  } catch (error) {
    console.error("Ошибка при добавлении компании:", error);
    return { success: false, error: "Не удалось добавить компанию" };
  }
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  try {
    await contactsService.updateContact(id, updates);
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
    const data = await contactsService.createContact(contact);
    revalidatePath("/contacts");
    return { success: true, data };
  } catch (error) {
    console.error("Ошибка при создании контакта:", error);
    return { success: false, error: "Не удалось создать контакт" };
  }
}
