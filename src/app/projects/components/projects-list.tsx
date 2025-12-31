import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Project } from "@/types";
import ProjectCard from "./project-card";

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({
  initialProjects = [],
}: ProjectsListProps) {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-normal text-gray-900 mb-3 tracking-tight">
          Проекты
        </h1>
        <p className="text-gray-500 text-lg">
          Управление объектами и стадиями работ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {initialProjects.length > 0 ? (
          initialProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет активных проектов
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Создайте свой первый проект, чтобы начать работу над дизайном и
              документацией.
            </p>
            <Button
              asChild
              className="rounded-full px-6 h-12 bg-black hover:bg-gray-800"
            >
              <Link href="/projects/new">Создать проект</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
