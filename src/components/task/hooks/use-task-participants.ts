"use client";

import { useState } from "react";
import { Participant, Task } from "@/types";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";

interface UseTaskParticipantsProps {
  task: Task;
  members: Participant[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const useTaskParticipants = ({
  task,
  members,
  onUpdateTask,
}: UseTaskParticipantsProps) => {
  const executor =
    (task.assigned_to && members
      ? members.find((m) => m.id === task.assigned_to)
      : null) || null;

  const observers = task.observers || [];

  const setObservers = (
    action: Participant[] | ((prev: Participant[]) => Participant[])
  ) => {
    const newObservers =
      typeof action === "function" ? action(observers) : action;
    onUpdateTask(task.id, { observers: newObservers });
  };

  const [openParticipants, setOpenParticipants] = useState(false);

  const toggleObserver = async (id: string) => {
    const isObserver = observers.some((o) => o.id === id);
    try {
      if (isObserver) {
        const newObservers = observers.filter((o) => o.id !== id);
        // setObservers(newObservers); // No longer needed with direct onUpdateTask
        await tasksService.removeParticipant(task.id, id);
        onUpdateTask(task.id, { observers: newObservers });
      } else {
        const member = members.find((m) => m.id === id);
        if (member) {
          const newObservers = [...observers, member];
          // setObservers(newObservers);
          await tasksService.addParticipant(task.id, id);
          onUpdateTask(task.id, { observers: newObservers });
        }
      }
    } catch (error) {
      console.error("Failed to update observer:", error);
      toast.error("Не удалось обновить участника");
    }
  };

  const updateExecutor = async (id: string) => {
    try {
      const updates = { assigned_to: id || null };

      // Optimistic handled by parent update
      onUpdateTask(task.id, updates);

      await tasksService.updateTask(task.id, updates);
      toast.success("Исполнитель обновлен");
    } catch (error) {
      console.error("Failed to update executor:", error);
      toast.error("Не удалось обновить исполнителя");
    }
  };

  const isSelected = (id: string) => {
    return executor?.id === id || observers.some((o) => o.id === id);
  };

  return {
    executor,
    observers,
    openParticipants,
    setOpenParticipants,
    toggleObserver,
    updateExecutor,
    isSelected,
    setObservers,
  };
};
