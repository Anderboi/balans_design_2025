import { Task } from "@/types";
import { TaskLabelsPopover } from "./task-labels-popover";
import { TaskDatesPopover } from "./task-dates-popover";

interface TaskActionsProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskActions({ task, onUpdateTask }: TaskActionsProps) {
  return (
    <div className="flex items-center gap-1.5 capitalize mb-6 mt-4">
      <div className="flex items-center gap-2">
        <TaskLabelsPopover task={task} onUpdateTask={onUpdateTask} />
        <TaskDatesPopover task={task} onUpdateTask={onUpdateTask} />
      </div>
    </div>
  );
}
