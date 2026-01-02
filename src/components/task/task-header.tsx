import { Task } from "@/types";
// import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
// import { Calendar, Plus as PlusIcon, Tag, CheckSquare } from "lucide-react";

interface TaskHeaderProps {
  task: Task;
  getPriorityColor: (priority?: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function TaskHeader({
  task,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
}: TaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {task.priority && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getStatusColor(
                task.status
              )}`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>
        </div>

        <DialogTitle className="text-2xl font-semibold text-zinc-900 leading-tight">
          {task.title}
        </DialogTitle>
      </div>
    </div>
  );
}
