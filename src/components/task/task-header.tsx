import { Task } from "@/types";
import { DialogTitle } from "@/components/ui/dialog";
import {
  getTaskPriorityColor,
  getTaskStatusColor,
  getTaskStatusLabel,
} from "@/lib/utils/task-helpers";

interface TaskHeaderProps {
  task: Task;
}

export function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {task.priority && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getTaskPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getTaskStatusColor(
                task.status
              )}`}
            >
              {getTaskStatusLabel(task.status)}
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
