"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types";
import { cn } from "@/lib/utils/utils";
import { TaskDetailsDialog } from "@/components/task-details-dialog";

interface KanbanCardProps {
  task: Task;
  index: number;
  members: import("@/types").Participant[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const KanbanCard = ({
  task,
  index,
  members,
  onUpdateTask,
}: KanbanCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn("mb-3", snapshot.isDragging && "opacity-50")}
        >
          <TaskDetailsDialog
            task={task}
            members={members}
            onUpdateTask={onUpdateTask}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3 space-y-3">
                <div className="space-y-1.5">
                  <div className="font-medium text-sm leading-tight">{task.title}</div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[10px] text-zinc-600 font-medium border border-zinc-200/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                  {task.priority && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full bg-secondary",
                        task.priority === "Высокий" &&
                          "bg-red-100 text-red-700",
                        task.priority === "Средний" &&
                          "bg-yellow-100 text-yellow-700",
                        task.priority === "Низкий" &&
                          "bg-green-100 text-green-700",
                      )}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TaskDetailsDialog>
        </div>
      )}
    </Draggable>
  );
};
