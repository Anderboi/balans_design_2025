import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BriefcaseBusiness, LayoutList, Package } from "lucide-react";
import { projectsService } from "@/lib/services/projects";
import { materialsService } from '@/lib/services/materials';
import PageContainer from '@/components/ui/page-container';

export default async function Home() {
  const projects = await projectsService.getProjects();
  const materials = await materialsService.getMaterials();

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold">Добро пожаловать, UserName!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <BriefcaseBusiness size={32} strokeWidth={1.5} />
            <CardTitle>Проекты</CardTitle>
            <CardDescription>Всего проектов: {projects.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button size={"sm"} className="w-full">
                Перейти к проектам
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <LayoutList size={32} strokeWidth={1.5} />
            <CardTitle>Задачи</CardTitle>
            <CardDescription>Активных задач: 12</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tasks">
              <Button size={"sm"} className="w-full">
                Перейти к задачам
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Package size={32} strokeWidth={1.5} />
            <CardTitle>Материалы</CardTitle>
            <CardDescription>
              Всего материалов: {materials.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/materials">
              <Button size={"sm"} className="w-full">
                Перейти к материалам
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние проекты</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <li className="p-2 hover:bg-gray-100 rounded-md">
                    {project.name}
                  </li>
                </Link>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ближайшие задачи</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded-md">
                Подготовить планировочное решение
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-md">
                Согласовать отделочные материалы
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-md">
                Встреча с клиентом
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
