import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { projectsService } from "@/lib/services/projects";
import { Project } from "@/types";

export const revalidate = 0; // Отключаем кэширование для этой страницы

export default async function ProjectsPage() {
  // Получаем проекты из Supabase
  let projects: Project[] = [];
  
  try {
    projects = await projectsService.getProjects();
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    //? Если не удалось загрузить проекты, используем демо-данные
    // projects = [
    //   {
    //     id: "1",
    //     name: "Квартира на Ленинском проспекте",
    //     address: "г. Москва, Ленинский проспект, д. 100",
    //     area: 120,
    //     stage: "Концепция",
    //     client_id: null,
    //     residents: "Семья из 4 человек",
    //     demolition_info: "",
    //     construction_info: "",
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString()
    //   },
    //   {
    //     id: "2",
    //     name: "Загородный дом в Подмосковье",
    //     address: "Московская обл., Одинцовский р-н",
    //     area: 250,
    //     stage: "Рабочая",
    //     client_id: null,
    //     residents: "Семья из 3 человек",
    //     demolition_info: "",
    //     construction_info: "",
    //     created_at: new Date().toISOString(),
    //     updated_at: new Date().toISOString()
    //   }
    // ];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Проекты</h1>
        <Button asChild>
          <Link href="/projects/new">Создать проект</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-medium">Адрес:</span> {project.address}</p>
                    <p><span className="font-medium">Площадь:</span> {project.area} м²</p>
                    <p><span className="font-medium">Стадия:</span> {project.stage}</p>
                    {project.contacts && (
                      <p><span className="font-medium">Клиент:</span> {project.contacts[0]?.name || '—'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-muted-foreground">Проекты не найдены. Создайте новый проект.</p>
          </div>
        )}
      </div>
    </div>
  );
}