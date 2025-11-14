import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import { tasksService } from "@/lib/services/tasks";
import RoomsBlock from "./components/rooms-block";
import ProjectInfoBlock from "./components/project-info-block";
import TasksBlock from "./components/tasks-block";
import SchedulesBlock from "./components/schedules-block";
import ProjectChatBlock from "./components/project-chat-block";

export const revalidate = 0; // Отключаем кэширование для этой страницы

const tabs = [
  { value: "rooms", name: "Помещения" },
  { value: "tasks", name: "Задачи" },
  { value: "specifications", name: "Спецификации" },
  { value: "chat", name: "Чат" },
];

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Получаем данные проекта из Supabase
  const project = await projectsService.getProjectById(id);
  const rooms = await projectsService.getRooms(id);
  const tasks = await tasksService.getTasks(); //TODO: фильтровать по project_id

  return (
    <>
      <ProjectInfoBlock project={project} />
      <Tabs defaultValue="rooms">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="rooms" className="space-y-4 mt-4">
          <RoomsBlock id={id} rooms={rooms} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <TasksBlock id={id} tasks={tasks} />
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4 mt-4">
          <SchedulesBlock id={id} />
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4">
          <ProjectChatBlock />
        </TabsContent>
      </Tabs>
    </>
  );
}
