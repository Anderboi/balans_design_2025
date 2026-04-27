"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaterialType } from "@/types";
import { useRouter } from "next/navigation";

export function AddSpecificationDialog({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const materialTypes = Object.values(MaterialType);

  const handleCreate = (type: string) => {
    router.push(`/projects/${projectId}/specifications/new?type=${type}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выберите тип спецификации</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {materialTypes.map((type) => (
            <Button
              key={type}
              variant="outline"
              onClick={() => handleCreate(type)}
            >
              {type}
            </Button>
          ))}
          <Button
            variant="default"
            className="col-span-2"
            onClick={() => handleCreate("all")}
          >
            Создать на все типы
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
