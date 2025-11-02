import { supabase } from '@/lib/supabase';
import { Company, CompanyType, Contact } from '@/types';

export const companiesService = {
  // Получение всех компаний
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Ошибка при получении компаний:', error);
      throw error;
    }

    return data || [];
  },
  
  // Получение компаний по типу
  async getCompaniesByType(type: CompanyType): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) {
      console.error(`Ошибка при получении компаний типа ${type}:`, error);
      throw error;
    }

    return data || [];
  },
  
  // Получение компании по ID
  async getCompanyById(id: string): Promise<Company | null> {
    if (!id) {
      console.error('ID компании не указан');
      return null;
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Ошибка при получении компании:', error);
      return null;
    }

    return data;
  },
  
  // Получение контактов компании
  async getCompanyContacts(companyId: string): Promise<Contact[]> {
    if (!companyId) {
      console.error('ID компании не указан');
      return [];
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)
      .order('name');

    if (error) {
      console.error('Ошибка при получении контактов компании:', error);
      return [];
    }

    return data || [];
  },
  
  // Создание новой компании
  async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([{
        ...company,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании компании:', error);
      throw error;
    }

    return data;
  },
  
  // Обновление компании
  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...company,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении компании:', error);
      throw error;
    }

    return data;
  },
  
  // Удаление компании
  async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ошибка при удалении компании:', error);
      throw error;
    }
  }
};