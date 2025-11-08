import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import { tasksService } from "@/lib/services/tasks";
import { materialsService } from "@/lib/services/materials";
import Link from "next/link";
import ProjectHeader from "../components/project-header";

export const revalidate = 0; // Отключаем кэширование для этой страницы

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Получаем данные проекта из Supabase

  let specifications: any[] = [];

  const project = await projectsService.getProjectById(id);
  const rooms = await projectsService.getRooms(id);
  const tasks = await tasksService.getTasks(); //TODO: фильтровать по project_id


  return (
    <div className="space-y-6">
      <ProjectHeader id={id} project={project} />
      <Card>
        <CardHeader>
          <CardTitle>Информация о проекте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <p className="grid grid-cols-4">
                <span className="text-muted-foreground col-span-1">Адрес:</span>
                <span className="col-span-3">
                  {project?.address || "Не указано"}
                </span>
              </p>
              <p className="grid grid-cols-4">
                <span className="text-muted-foreground col-span-1">
                  Площадь:
                </span>
                <span className="col-span-3">
                  {project?.area || "Не указано"} м²
                </span>
              </p>
              <p className="grid grid-cols-4">
                <span className="text-muted-foreground col-span-1">
                  Стадия:
                </span>
                <span className="col-span-3">{project?.stage}</span>
              </p>
            </div>
            <div>
              {project?.contacts && project.contacts.length > 0 ? (
                <div className="space-y-1 text-sm">
                  <p className="grid grid-cols-4">
                    <span className="text-muted-foreground col-span-1">
                      Клиент:
                    </span>

                    <Link
                      href={`/contacts/${project.contacts[0].id}`}
                      className="font-medium text-blue-600 hover:underline col-span-3"
                    >
                      {project.contacts[0].name}
                    </Link>
                  </p>
                  {project.contacts[0].phone && (
                    <p>
                      <span className="text-muted-foreground">Телефон:</span>{" "}
                      {project.contacts[0].phone}
                    </p>
                  )}
                  {project.contacts[0].email && (
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {project.contacts[0].email}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm grid grid-cols-4">
                  <span className="text-muted-foreground col-span-1">
                    Клиент:
                  </span>
                  <span className="col-span-3"> Не указано</span>
                </p>
              )}
              <p className="text-sm grid grid-cols-4">
                <span className="text-muted-foreground col-span-1">
                  Проживающие:
                </span>
                <span className="col-span-3"> {project?.residents}</span>
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
                          {task.status} //TODO: добавить приоритет задаче
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
