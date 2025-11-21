"use client";

import { useRouter } from "next/navigation";
import { TaskDetails } from "../../../components/task-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { use, useEffect, useState } from "react";
import { Task } from "@/types";
import { tasksService } from "@/lib/services/tasks";

export default function TaskModal({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const router = useRouter();
  const { taskId } = use(params);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await tasksService.getTaskById(taskId);
        setTask(data);
      } catch (error) {
        console.error("Failed to fetch task", error);
      }
    };
    fetchTask();
  }, [taskId]);

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Детали задачи</DialogTitle>
        </DialogHeader>
        {task ? (
          <TaskDetails task={task} />
        ) : (
          <div className="flex justify-center py-8">Загрузка...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
