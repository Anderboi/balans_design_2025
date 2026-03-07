"use client";

import { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

interface TaskDatesPopoverProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  trigger?: React.ReactNode;
}

export function TaskDatesPopover({
  task,
  onUpdateTask,
  trigger,
}: TaskDatesPopoverProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(task.start_date?.split("T")[0] || "");
  const [dueDate, setDueDate] = useState(task.due_date?.split("T")[0] || "");

  const handleSave = () => {
    if (onUpdateTask) {
      onUpdateTask(task.id, {
        start_date: startDate ? new Date(startDate).toISOString() : null,
        due_date: dueDate ? new Date(dueDate).toISOString() : task.due_date,
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
          >
            <Calendar size={14} /> Даты
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <h4 className="font-semibold mb-4">Даты</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Дата начала
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Срок выполнения
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              className="w-full h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
