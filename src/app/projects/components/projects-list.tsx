import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({
  initialProjects = [],
}: ProjectsListProps) {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Проекты</h1>
        <Button asChild>
          <Link href="/projects/new">Создать проект</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialProjects.length > 0 ? (
          initialProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full py-6 hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="//font-medium text-muted-foreground">
                        Адрес:
                      </span>{" "}
                      {project.address}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Площадь:</span>{" "}
                      {project.area} м²
                    </p>
                    <p>
                      <span className="text-muted-foreground">Стадия:</span>{" "}
                      {project.stage}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Клиент:</span>{" "}
                      {project.client_id
                        ? "Загружается на странице проекта"
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-muted-foreground">
              Проекты не найдены. Создайте новый проект.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
