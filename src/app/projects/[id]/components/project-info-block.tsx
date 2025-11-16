import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataLabelValue from "@/components/ui/data-label-value";
import { contactsService } from "@/lib/services/contacts";
import { Project } from "@/types";
import Link from "next/link";

const ProjectInfoBlock = async ({ project }: { project: Project | null }) => {
  const client = await contactsService.getContactById(project?.client_id || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Информация о проекте</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-sm space-y-4">
            <DataLabelValue label="Адрес">
              {project?.address || "Не указано"}
            </DataLabelValue>
            <DataLabelValue label="Площадь">
              {project?.area || "Не указано"} м²
            </DataLabelValue>
            <DataLabelValue label="Стадия">{project?.stage}</DataLabelValue>
          </div>
          <div className="text-sm  space-y-4">
            {client ? (
              <div className="space-y-1 text-sm">
                <p className="grid grid-cols-4    ">
                  <span className="text-muted-foreground col-span-1">
                    Клиент:
                  </span>

                  <Link
                    href={`/contacts/${client.id}`}
                    className="font-medium text-blue-600 hover:underline col-span-3"
                  >
                    {client.name}
                  </Link>
                </p>
                {/* {client.phone && (
                  <p className="grid grid-cols-4">
                    <span className="text-muted-foreground col-span-1">
                      Телефон:
                    </span>
                    <span className="col-span-3">{client.phone}</span>
                  </p>
                )}
                {client.email && (
                  <p className="grid grid-cols-4">
                    <span className="text-muted-foreground col-span-1">
                      Email:
                    </span>
                    <span className="col-span-3">{client.email}</span>
                  </p>
                )} */}
              </div>
            ) : (
              <DataLabelValue label="Клиент">
                <Button variant={"ghost"}>Добавить клиента</Button>
              </DataLabelValue>
            )}
            <DataLabelValue label="Проживающие">
              {project?.residents}
            </DataLabelValue>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoBlock;
