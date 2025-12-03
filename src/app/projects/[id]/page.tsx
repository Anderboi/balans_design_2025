import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsService } from "@/lib/services/projects";
import SchedulesBlock from "./components/schedules-block";
import ProjectChatBlock from "./components/project-chat-block";
import { Suspense } from "react";
import ProjectHeader from "../components/project-header";
import { notFound } from "next/navigation";
import RoomsBlockLoader from "./components/rooms-block-loader";
import TasksBlockLoader from "./components/tasks-block-loader";
import TeamManagementLoader from "./components/team-management-loader";
import ProjectInfoBlock from "./components/project-info-block";

export const revalidate = 0;

const tabs = [
  { value: "tasks", name: "Задачи" },
  // { value: "rooms", name: "Помещения" },
  { value: "specifications", name: "Спецификации" },
  { value: "chat", name: "Чат" },
  // { value: "files", name: "Файлы" },
  { value: "team", name: "Команда" },
];

async function getProjectData(id: string) {
  return await projectsService.getProjectById(id);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Получаем параметры маршрута
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Загружаем только основные данные проекта, остальное грузится в компонентах
  const project = await getProjectData(id);

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
            <RoomsBlockLoader id={id} />
          </TabsContent>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <TasksBlockLoader id={id} />
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
          <Suspense fallback={<div>Loading team...</div>}>
            <TeamManagementLoader id={id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}
