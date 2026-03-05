"use client";

import React from "react";
import { Task, Participant } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

// New Components
import { TaskHeader } from "@/components/task/task-header";
import { TaskActions } from "@/components/task/task-actions";
import { TaskParticipants } from "@/components/task/task-participants";
import { TaskDescription } from "@/components/task/task-description";
import { TaskAttachments } from "@/components/task/task-attachments";
import { TaskActivity } from "@/components/task/task-activity";

interface TaskDetailsDialogProps {
  children?: React.ReactNode;
  task: Task;
  onOpenChange?: (open: boolean) => void;
  onAddComment?: (taskId: string, text: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  members?: Participant[];
}

export function TaskDetailsDialog({
  children,
  task,
  onOpenChange,
  onAddComment = (id, text) => console.log("Add comment:", id, text),
  onUpdateTask = (id, updates) => console.log("Update task:", id, updates),
  members = [],
}: TaskDetailsDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="w-full max-w-[1024px]! h-[85vh]! p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-[#fbfbfd] border-zinc-200 shadow-2xl sm:rounded-2xl">
        {/* Left Column: Task Details */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-zinc-200 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-4 w-full">
                {/* Title & Meta */}
                <TaskHeader task={task} onUpdateTask={onUpdateTask} />

                {/* Actions Row */}
                <TaskActions />

                {/* Participants Row */}
                <TaskParticipants
                  task={task}
                  members={members}
                  onUpdateTask={onUpdateTask}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-zinc-500 mt-6 px-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-tight mb-0.5">
                    Срок
                  </div>
                  <div className="font-medium text-zinc-900">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                        })
                      : "Не указан"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          {/* Description & Attachments */}
          <div className="p-8 pt-6 space-y-6 flex-1">
            <TaskDescription
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
            />
            <TaskAttachments task={task} />
          </div>
        </div>

        {/* Right Column: Activity (Chat & History) */}
        <TaskActivity task={task} onAddComment={onAddComment} />
      </DialogContent>
    </Dialog>
  );
}
