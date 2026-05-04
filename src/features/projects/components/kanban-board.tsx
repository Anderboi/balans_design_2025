"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";
import { Participant } from "@/types";
import { COLUMNS } from "@/config/tasks";

interface KanbanBoardProps {
  initialTasks: Task[];
  members: Participant[];
  projectId?: string;
}

export const KanbanBoard = ({
  initialTasks,
  projectId,
  members,
}: KanbanBoardProps) => {

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const onTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the column definition to get the status
    const column = COLUMNS.find((col) => col.id === destination.droppableId);
    if (!column) return;

    const newStatus = column.status;
    const previousTasks = tasks; 
    // Optimistic update
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId ? { ...task, status: newStatus } : task,
    );

    setTasks(updatedTasks);

    try {
      const updatedTask = await tasksService.updateTask(draggableId, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === draggableId ? updatedTask : t)),
      );
      toast.success("Статус обновлен");
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Не удалось обновить статус задачи");
      setTasks(previousTasks); // Revert on error
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    );

    try {
      const updatedTask = await tasksService.updateTask(taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Не удалось сохранить изменения");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.status)}
            projectId={projectId}
            onTaskCreated={onTaskCreated}
            onUpdateTask={handleUpdateTask}
            members={members}
            color={col.color}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
