"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";

interface KanbanBoardProps {
  initialTasks: Task[];
}

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: TaskStatus.TODO, title: "К выполнению" },
  { status: TaskStatus.IN_PROGRESS, title: "В процессе" },
  { status: TaskStatus.REVIEW, title: "На проверке" },
  { status: TaskStatus.DONE, title: "Выполнено" },
];

export const KanbanBoard = ({ initialTasks }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;

    // Optimistic update
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId ? { ...task, status: newStatus } : task
    );

    setTasks(updatedTasks);

    try {
      await tasksService.updateTask(draggableId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Не удалось обновить статус задачи");
      setTasks(tasks); // Revert on error
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
