import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Project } from "@/types";
import DataLabelValue from "@/components/ui/data-label-value";
import { getStageBadgeClass, formatDate } from "@/lib/utils/utils";
import PageContainer from "@/components/ui/page-container";

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({
  initialProjects = [],
}: ProjectsListProps) {
  return (
    <PageContainer>
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
              <Card className="h-full py-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge
                    variant={"outline"}
                    className={getStageBadgeClass(project.stage)}
                  >
                    {project.stage}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <DataLabelValue label="Адрес">
                      {project.address}
                    </DataLabelValue>
                    <DataLabelValue label="Площадь">{`${project.area} м²`}</DataLabelValue>
                    {/* <DataLabelValue label="Стадия">
                      <span className="border py-1 px-2 rounded-full bg-amber-50 border-amber-300 text-amber-500">
                        {project.stage}
                      </span>
                    </DataLabelValue> */}
                    <DataLabelValue label="Клиент">
                      {project.client_id
                        ? "Загружается на странице проекта"
                        : "—"}
                    </DataLabelValue>
                    <DataLabelValue label="Создано">
                      {formatDate(project.created_at)}
                    </DataLabelValue>
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
    </PageContainer>
  );
}
