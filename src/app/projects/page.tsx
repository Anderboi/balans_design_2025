import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ProjectsPage() {
  // Демо-данные для проектов
  const projects = [
    {
      id: "1",
      name: "Квартира на Ленинском проспекте",
      address: "г. Москва, Ленинский проспект, д. 100",
      area: 120,
      stage: "Концепция",
      client: "Иванов И.И."
    },
    {
      id: "2",
      name: "Загородный дом в Подмосковье",
      address: "Московская обл., Одинцовский р-н",
      area: 250,
      stage: "Рабочая",
      client: "Петров П.П."
    },
    {
      id: "3",
      name: "Офис IT-компании",
      address: "г. Москва, ул. Тверская, д. 15",
      area: 180,
      stage: "Предпроектная",
      client: "ООО 'ИТ Решения'"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Проекты</h1>
        <Button>Создать проект</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Адрес:</span> {project.address}</p>
                  <p><span className="font-medium">Площадь:</span> {project.area} м²</p>
                  <p><span className="font-medium">Стадия:</span> {project.stage}</p>
                  <p><span className="font-medium">Клиент:</span> {project.client}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}