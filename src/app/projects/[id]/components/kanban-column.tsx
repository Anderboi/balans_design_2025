import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectId: string;
  onTaskCreated: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  members: import("@/types").Participant[];
}

export const KanbanColumn = ({
  id,
  title,
  tasks,
  projectId,
  onTaskCreated,
  onUpdateTask,
  members,
}: KanbanColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const newTask = await tasksService.createTask({
        title: newTaskTitle,
        project_id: projectId,
        status: id as TaskStatus,
        priority: TaskPriority.MEDIUM,
        due_date: new Date().toISOString(),
        description: "",
        assigned_to: null,
      });

      onTaskCreated(newTask);
      setNewTaskTitle("");
      setIsAdding(false);
      toast.success("Задача создана");
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Не удалось создать задачу");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="mb-3 font-semibold text-sm text-muted-foreground flex items-center justify-between">
        <span>{title}</span>
        <span className="bg-secondary px-2 py-0.5 rounded-full text-xs text-foreground">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 bg-secondary rounded-2xl p-3 min-h-[500px]
              ${snapshot.isDraggingOver ? "bg-secondary/50" : ""}
            `}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                members={members}
                onUpdateTask={onUpdateTask}
              />
            ))}
            {provided.placeholder}

            {isAdding ? (
              <form onSubmit={handleCreateTask} className="mt-2">
                <Input
                  autoFocus
                  placeholder="Название задачи..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mb-2 bg-background"
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" type="submit" disabled={isSubmitting}>
                    Добавить
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => setIsAdding(false)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                className="w-full mt-2 justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить задачу
              </Button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
