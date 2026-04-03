import { supabase } from "../supabase";
import { Contact, ContactType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const contactsService = {
  // Получение всех контактов
  async getContacts(client?: SupabaseClient): Promise<Contact[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .order("name");

    if (error) {
      console.error("Ошибка при получении контактов:", error);
      throw error;
    }

    return (data as Contact[]) || [];
  },

  // Получение контактов по типу
  async getContactsByType(
    type: ContactType,
    client?: SupabaseClient,
  ): Promise<Contact[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .eq("type", type)
      .order("name");

    if (error) {
      console.error(`Ошибка при получении контактов типа ${type}:`, error);
      throw error;
    }

    return (data as Contact[]) || [];
  },

  // Получение контактов компании
  async getContactsByCompany(
    companyId: string,
    client?: SupabaseClient,
  ): Promise<Contact[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .eq("company_id", companyId)
      .order("name");

    if (error) {
      console.error("Ошибка при получении контактов компании:", error);
      throw error;
    }

    return (data as Contact[]) || [];
  },

  // Получение контакта по ID
  async getContactById(
    id: string,
    client?: SupabaseClient,
  ): Promise<Contact | null> {
    if (!id) {
      console.error("ID контакта не указан");
      return null;
    }

    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка при получении контакта:", error);
      return null;
    }

    return data as Contact;
  },

  // Создание нового контакта
  async createContact(
    contact: Omit<Contact, "id" | "created_at" | "updated_at"> & {
      user_id?: string | null;
    },
    client?: SupabaseClient,
  ): Promise<Contact> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .insert([
        {
          ...contact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Ошибка при создании контакта:", error);
      throw error;
    }

    return data as Contact;
  },

  // Обновление контакта
  async updateContact(
    id: string,
    contact: Partial<Contact>,
    client?: SupabaseClient,
  ): Promise<Contact> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("contacts")
      .update({
        ...contact,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Ошибка при обновлении контакта:", error);
      throw error;
    }

    return data as Contact;
  },

  // Удаление контакта
  async deleteContact(id: string, client?: SupabaseClient): Promise<void> {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from("contacts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Ошибка при удалении контакта:", error);
      throw error;
    }
  },
};
