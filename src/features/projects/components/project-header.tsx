"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProjectHeader = ({ id, project }: { id: string; project: any }) => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <Button variant={"ghost"} size={"icon-sm"} asChild onClick={back}>
          <ChevronLeft />
        </Button>
        <h1 className="text-3xl font-bold">
          {project ? project.name : "Проект не найден"}
        </h1>
      </div>
      <div className="space-x-2">
        <Button variant="outline" asChild size={"icon"}>
          <Link href={`/projects/${id}/edit`}>
            <Pen />
          </Link>
        </Button>
        <Button variant="destructive" asChild size={"icon"}>
          <Link href={`/projects/${id}/delete`}>
            <Trash />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
