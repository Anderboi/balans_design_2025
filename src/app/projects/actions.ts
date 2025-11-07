import { projectsService } from '@/lib/services/projects';

export async function getProjects() {
  try {
      return await projectsService.getProjects();
    } catch (error) {
      console.error("Ошибка при загрузке проектов:", error);
      throw error;
    }
}