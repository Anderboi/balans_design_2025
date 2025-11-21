import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import { tasksService } from "@/lib/services/tasks";
import RoomsBlock from "./components/rooms-block";
import ProjectInfoBlock from "./components/project-info-block";
import TasksBlock from "./components/tasks-block";
import SchedulesBlock from "./components/schedules-block";
import ProjectChatBlock from "./components/project-chat-block";
import { materialsService } from "@/lib/services/materials";
import { Suspense } from "react";
import ProjectHeader from '../components/project-header';

export const revalidate = 0; // Отключаем кэширование для этой страницы

const tabs = [
  // { value: "rooms", name: "Помещения" },
  { value: "tasks", name: "Задачи" },
  { value: "specifications", name: "Спецификации" },
  { value: "chat", name: "Чат" },
];

  async function getProjectData(id: string) {
    return await projectsService.getProjectById(id);
  }

  async function getProjectDetails(id: string) {
    const [rooms, tasks, schedules] = await Promise.all([
      projectsService.getRooms(id),
      tasksService.getTasks(), // TODO: добавить фильтрацию по project_id
      materialsService.getSpecifications(id),
    ]);

    return { rooms, tasks, schedules };
  }

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Параллельная загрузка данных
  const [project, projectDetails] = await Promise.all([
    getProjectData(id),
    getProjectDetails(id),
  ]);

   const { rooms, tasks, schedules } = projectDetails;

  // // Получаем данные проекта из Supabase
  // const project = await projectsService.getProjectById(id);
  // const rooms = await projectsService.getRooms(id);
  // const tasks = await tasksService.getTasks(); //TODO: фильтровать по project_id
  // const shedules = await materialsService.getSpecifications(id);

  // Выносим тяжелые запросы в отдельные функции для параллельной загрузки

  return (
    <>
      {/* Передаем проект в header */}
      <ProjectHeader id={id} project={project} />
      <ProjectInfoBlock project={project} />
      
      <Tabs defaultValue="rooms">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="rooms" className="space-y-4 mt-4">
            <RoomsBlock id={id} rooms={rooms} />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <TasksBlock id={id} tasks={tasks} />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="specifications" className="space-y-4 mt-4">
            <SchedulesBlock id={id} />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="info" className="space-y-4 mt-4">
            <ProjectChatBlock />
          </TabsContent>
        </Suspense>
      </Tabs>
    </>
  );
}
