import { supabase } from '@/lib/supabase';
import { Contact } from '@/types';

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
  }
};