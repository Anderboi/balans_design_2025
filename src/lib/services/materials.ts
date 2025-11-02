import { supabase } from '@/lib/supabase';
import { Material, Specification } from '@/types';

export const materialsService = {
  // Получение всех материалов
  async getMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');

    if (error) {
      console.error('Ошибка при получении материалов:', error);
      throw error;
    }

    return data || [];
  },

  // Получение спецификаций для проекта
  async getSpecifications(projectId: string): Promise<Specification[]> {
    const { data, error } = await supabase
      .from('specifications')
      .select('*, materials(*), rooms(name)')
      .eq('project_id', projectId);

    if (error) {
      console.error(`Ошибка при получении спецификаций для проекта ${projectId}:`, error);
      throw error;
    }

    return data || [];
  },

  // Добавление спецификации
  async addSpecification(spec: Omit<Specification, 'id' | 'created_at' | 'updated_at'>): Promise<Specification> {
    const { data, error } = await supabase
      .from('specifications')
      .insert(spec)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при добавлении спецификации:', error);
      throw error;
    }

    return data;
  }
};