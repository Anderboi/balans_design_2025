import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

export const projectsService = {
  // Получение всех проектов
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, contacts(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка при получении проектов:', error);
      throw error;
    }

    return data || [];
  },

  // Получение проекта по ID
  async getProjectById(id: string): Promise<Project | null> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error('Попытка получить проект с пустым ID');
      return null;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, contacts(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error);
      throw error;
    }

    return data;
  },

  // Создание нового проекта
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании проекта:', error);
      throw error;
    }

    return data;
  },

  // Обновление проекта
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error('Попытка обновить проект с пустым ID');
      throw new Error('ID проекта не может быть пустым');
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Ошибка при обновлении проекта с ID ${id}:`, error);
      throw error;
    }

    return data;
  },

  // Удаление проекта
  async deleteProject(id: string): Promise<void> {
    // Проверка на undefined или пустой ID
    if (!id) {
      console.error('Попытка удалить проект с пустым ID');
      throw new Error('ID проекта не может быть пустым');
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Ошибка при удалении проекта с ID ${id}:`, error);
      throw error;
    }
  },

  // Получение помещений проекта
  async getRooms(projectId: string) {
    // Проверка на undefined или пустой ID
    if (!projectId) {
      console.error('Попытка получить помещения проекта с пустым ID');
      return [];
    }
    
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId)
      .order('name');

    if (error) {
      console.error(`Ошибка при получении помещений для проекта ${projectId}:`, error);
      throw error;
    }

    return data || [];
  }
};