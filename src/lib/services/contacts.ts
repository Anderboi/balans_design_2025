import { supabase } from '@/lib/supabase';
import { Contact, ContactType } from '@/types';

export const contactsService = {
  // Получение всех контактов
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name');

    if (error) {
      console.error('Ошибка при получении контактов:', error);
      throw error;
    }

    return data || [];
  },
  
  // Получение контактов по типу
  async getContactsByType(type: ContactType): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) {
      console.error(`Ошибка при получении контактов типа ${type}:`, error);
      throw error;
    }

    return data || [];
  },
  
  // Получение контактов компании
  async getContactsByCompany(companyId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)
      .order('name');

    if (error) {
      console.error('Ошибка при получении контактов компании:', error);
      throw error;
    }

    return data || [];
  },
  
  // Получение контакта по ID
  async getContactById(id: string): Promise<Contact | null> {
    if (!id) {
      console.error('ID контакта не указан');
      return null;
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Ошибка при получении контакта:', error);
      return null;
    }

    return data;
  },
  
  // Создание нового контакта
  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        ...contact,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании контакта:', error);
      throw error;
    }

    return data;
  },
  
  // Обновление контакта
  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({
        ...contact,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении контакта:', error);
      throw error;
    }

    return data;
  },
  
  // Удаление контакта
  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ошибка при удалении контакта:', error);
      throw error;
    }
  }
};