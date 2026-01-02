"use client";

import { useState } from "react";
import { Task } from "@/types";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskDescription({ task, onUpdateTask }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description || "");

  const handleSave = async () => {
    try {
      // Optimistic update
      onUpdateTask(task.id, { description });
      setIsEditing(false);

      await tasksService.updateTask(task.id, { description });
      toast.success("Описание обновлено");
    } catch (error) {
      console.error("Failed to update description:", error);
      toast.error("Не удалось обновить описание");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-900">Описание</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            onClick={() => setIsEditing(true)}
          >
            Изменить
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте более подробное описание..."
            className="min-h-[120px] text-sm bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all resize-none p-4 rounded-xl leading-relaxed"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} className="rounded-lg px-4">
              Сохранить
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setDescription(task.description || "");
              }}
              className="rounded-lg px-4 text-zinc-500"
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
          {description || (
            <span className="text-zinc-400 italic">Описание отсутствует.</span>
          )}
        </p>
      )}
    </div>
  );
}
