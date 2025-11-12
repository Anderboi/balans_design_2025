import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import { tasksService } from "@/lib/services/tasks";
import { materialsService } from "@/lib/services/materials";
import ProjectHeader from "../components/project-header";
import RoomsBlock from "./components/rooms-block";
import ProjectInfoBlock from "./components/project-info-block";
import TasksBlock from "./components/tasks-block";
import SchedulesBlock from "./components/schedules-block";
import ProjectChatBlock from "./components/project-chat-block";
import PageContainer from "@/components/ui/page-container";

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
  const project = await projectsService.getProjectById(id);
  const rooms = await projectsService.getRooms(id);
  const tasks = await tasksService.getTasks(); //TODO: фильтровать по project_id
  const specifications = await materialsService.getSpecifications(id);

  return (
    <PageContainer>
      <ProjectHeader id={id} project={project} />
      <ProjectInfoBlock project={project} />
      <Tabs defaultValue="rooms">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms">Помещения</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="specifications">Спецификации</TabsTrigger>
          <TabsTrigger value="info">Чат</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4 mt-4">
          <RoomsBlock id={id} rooms={rooms} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <TasksBlock id={id} tasks={tasks} />
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4 mt-4">
          <SchedulesBlock id={id} specifications={specifications} />
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4">
          <ProjectChatBlock />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
