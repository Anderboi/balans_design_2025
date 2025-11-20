import { Droppable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export const KanbanColumn = ({ id, title, tasks }: KanbanColumnProps) => {
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
              flex-1 bg-secondary/30 rounded-lg p-3 min-h-[500px]
              ${snapshot.isDraggingOver ? "bg-secondary/50" : ""}
            `}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
