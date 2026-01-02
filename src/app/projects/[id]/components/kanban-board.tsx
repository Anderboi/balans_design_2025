"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus, TASK_STATUS_LABELS } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { tasksService } from "@/lib/services/tasks";
import { profilesService } from "@/lib/services/profiles";
import { toast } from "sonner";
import { useEffect } from "react";
import { Participant } from "@/types";

interface KanbanBoardProps {
  initialTasks: Task[];
  projectId: string;
}

const COLUMNS = [
  {
    id: "TODO",
    status: TaskStatus.TODO,
    title: TASK_STATUS_LABELS[TaskStatus.TODO],
  },
  {
    id: "IN_PROGRESS",
    status: TaskStatus.IN_PROGRESS,
    title: TASK_STATUS_LABELS[TaskStatus.IN_PROGRESS],
  },
  {
    id: "REVIEW",
    status: TaskStatus.REVIEW,
    title: TASK_STATUS_LABELS[TaskStatus.REVIEW],
  },
  {
    id: "DONE",
    status: TaskStatus.DONE,
    title: TASK_STATUS_LABELS[TaskStatus.DONE],
  },
];

export const KanbanBoard = ({ initialTasks, projectId }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [members, setMembers] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await profilesService.getProfiles();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch profiles", error);
      }
    };
    fetchMembers();
  }, []);

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

    // Optimistic update
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId ? { ...task, status: newStatus } : task
    );

    setTasks(updatedTasks);

    try {
      await tasksService.updateTask(draggableId, { status: newStatus });
      toast.success("Статус обновлен");
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
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.status)}
            projectId={projectId}
            onTaskCreated={onTaskCreated}
            members={members}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
