// Импорты UI компонентов
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Импорты иконок (lucide-react)
import {
  FileSpreadsheet,
  Info,
  SquareKanban,
  Sparkles,
  ChevronLeft,
  Users,
} from "lucide-react";

// Импорты внутренней логики и компонентов
import { projectsService } from "@/lib/services/projects";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectStages } from "../components/project-stages";

// Загрузчики и блоки
import SchedulesBlock from "./components/schedules-block";
// import ProjectChatBlock from "./components/project-chat-block";
// import RoomsBlockLoader from "./components/rooms-block-loader";
import TasksBlockLoader from "./components/tasks-block-loader";
import TeamManagementLoader from "./components/team-management-loader";
// import ProjectInfoBlock from "./components/project-info-block";
import BriefCarousel from "./components/brief-carousel";

export const revalidate = 0;

const tabs = [
  { value: "overview", name: "Обзор", icon: Info },
  { value: "tasks", name: "Задачи", icon: SquareKanban },
  { value: "specifications", name: "Спецификации", icon: FileSpreadsheet },
  { value: "team", name: "Команда", icon: Users },
];

async function getProjectData(id: string) {
  return await projectsService.getProjectById(id);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  // Get client name directly from the joined contact
  // Since we use a foreign key relation, 'contacts' is a single object here.
  const clientName = project.contacts?.name || "Клиент не указан";
  const address = project.address || "Адрес не указан";

  return (
    <div className=" px-6 py-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Назад к списку
        </Link>

        {/* Title Area */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Проект
            </span>
            <h1 className="text-3xl md:text-5xl text-zinc-900 mb-2 tracking-tight">
              {project.name}
            </h1>
            <p className="text-base text-zinc-500">
              {address} <span className="mx-2 text-zinc-500">•</span>{" "}
              {clientName}
            </p>
          </div>

          <Button className="rounded-full h-12 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-200/50 transition-all font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Спросить Aura AI
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="border-b border-gray-100">
          <TabsList className="h-auto p-0 bg-transparent gap-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none text-gray-500 hover:text-gray-800 transition-colors bg-transparent font-medium"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent
          value="overview"
          className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <ProjectStages />

          {/* Brief Carousel or other blocks can participate here if needed, 
               but for now Stages is the main overview */}
          {/* <BriefCarousel /> */}
        </TabsContent>

        <TabsContent
          value="tasks"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TasksBlockLoader id={id} />
          </Suspense>
        </TabsContent>

        <TabsContent
          value="specifications"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Suspense fallback={<div>Loading specs...</div>}>
            <SchedulesBlock id={id} />
          </Suspense>
        </TabsContent>

        <TabsContent
          value="team"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Suspense fallback={<div>Loading team...</div>}>
            <TeamManagementLoader id={id} />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Kept BriefCarousel component, might need to be inside stages or Overview */}
      <div className="hidden">
        <BriefCarousel />
      </div>
    </div>
  );
}
