import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import DataLabelValue from "@/components/ui/data-label-value";
import { contactsService } from "@/lib/services/contacts";
import { Project } from "@/types";
import { ChevronRight } from 'lucide-react';
import Link from "next/link";

const briefBlocks = [
  {title: "Общая информация", progress: 50},
  {title: "Информация о проживающих", progress: 50},
  {title:"Информация по демонтажу", progress: 50},
  {title:"Информация по монтажу", progress: 50},
  {title:"Состав помещений", progress: 50},
  {title:"Инженерные системы", progress: 50},
]

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
      <CardFooter className="flex flex-col gap-2 items-start">
        <h3>Информация о проекте</h3>
        <Carousel orientation='horizontal'
          opts={{
            align: "start",
          }}
          className="/flex gap-2 bg-secondary py-2  rounded-lg /border w-full /overflow-scroll /no-scrollbar "
        >
          <CarouselContent className='-ml-2 px-2'>
            {briefBlocks.map((block, index) => (
              <CarouselItem
                key={index}
                className="flex items-center md:basis-1/3 lg:basis-1/4 gap-2 ml-2 p-2 rounded-md bg-white w-60 min-w-60"
              >
                <div className='flex flex-col gap-2 justify-between h-full grow'>
                  <p className="text-sm">{block.title}</p>
                  <p className="text-xs text-secondary-foreground/30">Прогресс бар</p>
                </div>
                <ChevronRight className='size-4 text-secondary-foreground/30'/>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardFooter>
    </Card>
  );
};

export default ProjectInfoBlock;
