import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import { tasksService } from "@/lib/services/tasks";
import { materialsService } from "@/lib/services/materials";
import Link from "next/link";

export const revalidate = 0; // Отключаем кэширование для этой страницы

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Получаем данные проекта из Supabase
  let project;
  let rooms = [];
  let tasks: any[] = [];
  let specifications: any[] = [];
  
  try {
    project = await projectsService.getProjectById(id);
    
    if (project) {
      rooms = await projectsService.getRooms(id);
      tasks = await tasksService.getTasks(id);
      specifications = await materialsService.getSpecifications(id);
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных проекта:", error);
    
    // Если не удалось загрузить проект, используем демо-данные
    project = {
      id: id,
      name: id === "1" ? "Квартира на Ленинском проспекте" : "Загородный дом в Подмосковье",
      address: id === "1" ? "г. Москва, Ленинский проспект, д. 100" : "Московская обл., Одинцовский р-н",
      area: id === "1" ? 120 : 250,
      stage: id === "1" ? "Концепция" : "Рабочая",
      client_id: null,
      residents: "Семья из 4 человек",
      demolition_info: "Демонтаж перегородок в гостиной",
      construction_info: "Возведение новых перегородок в спальне",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    rooms = [
      { id: "1", project_id: id, name: "Гостиная", area: 30, preferred_finishes: "Паркет, обои", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "2", project_id: id, name: "Спальня", area: 20, preferred_finishes: "Паркет, краска", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "3", project_id: id, name: "Кухня", area: 15, preferred_finishes: "Плитка, краска", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    
    tasks = [
      { id: "1", project_id: id, title: "Подготовить планировочное решение", description: "", status: "В процессе", priority: "Высокий", due_date: "2023-06-15", assigned_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "2", project_id: id, title: "Согласовать отделочные материалы", description: "", status: "К выполнению", priority: "Средний", due_date: "2023-06-20", assigned_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "3", project_id: id, title: "Встреча с клиентом", description: "", status: "К выполнению", priority: "Высокий", due_date: "2023-06-25", assigned_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    
    specifications = [
      { id: "1", project_id: id, material_id: "1", room_id: "1", quantity: 50, unit: "м²", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), materials: { name: "Паркетная доска", type: "Отделка" }, rooms: { name: "Гостиная" } },
      { id: "2", project_id: id, material_id: "2", room_id: "2", quantity: 10, unit: "рулон", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), materials: { name: "Обои", type: "Отделка" }, rooms: { name: "Спальня" } },
      { id: "3", project_id: id, material_id: "3", room_id: "3", quantity: 1, unit: "шт.", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), materials: { name: "Диван", type: "Мебель" }, rooms: { name: "Кухня" } }
    ];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {project ? project.name : "Проект не найден"}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/edit`}>Редактировать</Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/projects/${id}/delete`}>Удалить</Link>
          </Button>
        </div>
      </div>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Информация о проекте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">Адрес:</span>{" "}
                {project?.address || "Не указано"}
              </p>
              <p>
                <span className="text-muted-foreground">Площадь:</span>{" "}
                {project?.area || "Не указано"} м²
              </p>
              <p>
                <span className="text-muted-foreground">Стадия:</span>{" "}
                {project?.stage}
              </p>
            </div>
            <div>
              {project?.contacts && (
                <p>
                  <span className="font-medium">Клиент:</span>{" "}
                  {project.contacts.length > 0
                    ? project.contacts[0].name
                    : "Не указано"}
                </p>
              )}
              <p className='text-sm'>
                <span className="text-muted-foreground">Проживающие:</span>{" "}
                {project?.residents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rooms">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms">Помещения</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="specifications">Спецификации</TabsTrigger>
          <TabsTrigger value="info">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Помещения</h2>
            <Button asChild>
              <Link href={`/projects/${id}/rooms/new`}>Добавить помещение</Link>
            </Button>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <span className="font-medium">Площадь:</span> {room.area}{" "}
                      м²
                    </p>
                    <p>
                      <span className="font-medium">Отделка:</span>{" "}
                      {room.preferred_finishes}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Нет добавленных помещений</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Задачи</h2>
            <Button asChild>
              <Link href={`/projects/${id}/tasks/new`}>Добавить задачу</Link>
            </Button>
          </div>

          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p>
                          <span className="font-medium">Статус:</span>{" "}
                          {task.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>
                          <span className="font-medium">Срок:</span>{" "}
                          {new Date(task.due_date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Приоритет:</span>{" "}
                          {task.priority}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Нет добавленных задач</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Спецификации</h2>
            <Button asChild>
              <Link href={`/projects/${id}/specifications/new`}>
                Добавить материал
              </Link>
            </Button>
          </div>

          {specifications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {specifications.map((spec) => (
                <Card key={spec.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {spec.materials?.name || "Материал"}
                        </h3>
                        <p>
                          <span className="font-medium">Помещение:</span>{" "}
                          {spec.rooms?.name || "Не указано"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>
                          <span className="font-medium">Количество:</span>{" "}
                          {spec.quantity} {spec.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Нет добавленных спецификаций
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Информация о демонтаже</h3>
                  <p>{project?.demolition_info || "Не указано"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Информация о строительстве</h3>
                  <p>{project?.construction_info || "Не указано"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}