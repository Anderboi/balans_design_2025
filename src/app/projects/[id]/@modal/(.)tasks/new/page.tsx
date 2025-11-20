"use client";

import { useRouter } from "next/navigation";
import { TaskForm } from "../../../components/task-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { use } from "react";

export default function NewTaskModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
        </DialogHeader>
        <TaskForm projectId={id} onSuccess={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
}
