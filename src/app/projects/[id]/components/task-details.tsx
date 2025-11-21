import { Task, TASK_STATUS_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{TASK_STATUS_LABELS[task.status]}</Badge>
          <Badge variant="outline">{task.priority}</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>Срок: {new Date(task.due_date).toLocaleDateString()}</span>
        </div>
        {task.assigned_to && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>Исполнитель: {task.assigned_to}</span>
          </div>
        )}
      </div>

      {task.description && (
        <div className="space-y-2">
          <h3 className="font-semibold">Описание</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </p>
        </div>
      )}
    </div>
  );
};
