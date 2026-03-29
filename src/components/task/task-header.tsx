"use client";

import { Task, TaskPriority, TASK_PRIORITY_STYLES } from "@/types";
import { DialogTitle } from "@/components/ui/dialog";
import {
  getTaskPriorityColor,
  getTaskStatusColor,
  getTaskStatusLabel,
} from "@/lib/utils/task-helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TaskHeaderProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskHeader({ task, onUpdateTask }: TaskHeaderProps) {
  const priorities = Object.entries(TASK_PRIORITY_STYLES).map(([value, style]) => ({
    value: value as TaskPriority,
    label: style.label,
  }));

  const handlePriorityChange = (priority: TaskPriority) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { priority });
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-colors outline-none ${getTaskPriorityColor(
                    task.priority,
                  )} hover:brightness-95`}
                >
                  {task.priority ? (TASK_PRIORITY_STYLES[task.priority] || { label: task.priority }).label : "Без приоритета"}
                  <ChevronDown size={10} className="opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[120px]">
                {priorities.map((p) => (
                  <DropdownMenuItem
                    key={p.value}
                    onClick={() => handlePriorityChange(p.value)}
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        getTaskPriorityColor(p.value).split(" ")[0]
                      }`}
                    />
                    {p.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getTaskStatusColor(
                task.status,
              )}`}
            >
              {getTaskStatusLabel(task.status)}
            </span>
          </div>
        </div>

        <DialogTitle className="text-2xl font-semibold text-zinc-900 leading-tight">
          {task.title}
        </DialogTitle>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {task.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 rounded-full bg-zinc-100 text-[11px] text-zinc-600 font-medium border border-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
