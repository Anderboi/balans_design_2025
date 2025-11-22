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
import ProjectHeader from "../components/project-header";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamManagement } from "./components/team-management";
import { getProjectMembers } from "@/lib/actions/team";

export const revalidate = 0;

const tabs = [
  { value: "tasks", name: "Задачи" },
  { value: "specifications", name: "Спецификации" },
  { value: "chat", name: "Чат" },
  // { value: "files", name: "Файлы" },
  { value: "team", name: "Команда" },
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
  const [project, projectDetails, members] = await Promise.all([
    getProjectData(id),
    getProjectDetails(id),
    getProjectMembers(id),
  ]);

  const { rooms, tasks } = projectDetails;

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Передаем проект в header */}
      <ProjectHeader id={id} project={project} />
      <ProjectInfoBlock project={project} />

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsContent value="chat" className="space-y-4 mt-4">
            <ProjectChatBlock />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="files" className="space-y-4 mt-4">
            <div className="p-4 text-center text-muted-foreground">
              Раздел файлов в разработке
            </div>
          </TabsContent>
        </Suspense>

        <TabsContent value="team" className="mt-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Управление командой</CardTitle>
            </CardHeader>
            <CardContent> */}
          <TeamManagement projectId={id} initialMembers={members} />
          {/* </CardContent>
          </Card> */}
        </TabsContent>
      </Tabs>
    </>
  );
}
