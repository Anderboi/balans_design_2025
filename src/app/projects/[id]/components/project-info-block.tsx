import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <p className="grid grid-cols-4">
              <span className="text-muted-foreground col-span-1">Адрес:</span>
              <span className="col-span-3">
                {project?.address || "Не указано"}
              </span>
            </p>
            <p className="grid grid-cols-4">
              <span className="text-muted-foreground col-span-1">Площадь:</span>
              <span className="col-span-3">
                {project?.area || "Не указано"} м²
              </span>
            </p>
            <p className="grid grid-cols-4">
              <span className="text-muted-foreground col-span-1">Стадия:</span>
              <span className="col-span-3">{project?.stage}</span>
            </p>
          </div>
          <div>
            {client ? (
              <div className="space-y-1 text-sm">
                <p className="grid grid-cols-4">
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
              <p className="text-sm grid grid-cols-4">
                <span className="text-muted-foreground col-span-1">
                  Клиент:
                </span>
                <span className="col-span-3"> Не указано</span>
              </p>
            )}
            <p className="text-sm grid grid-cols-4">
              <span className="text-muted-foreground col-span-1">
                Проживающие:
              </span>
              <span className="col-span-3"> {project?.residents}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoBlock;
