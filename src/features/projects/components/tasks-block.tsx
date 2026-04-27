import { Task } from "@/types";
import { KanbanBoard } from "./kanban-board";

const TasksBlock = ({ tasks, id }: { tasks: Task[]; id: string }) => {
  return (
    
      <div className="h-[calc(100vh-250px)] min-h-[600px]">
        <KanbanBoard initialTasks={tasks} projectId={id} />
      </div>
    
  );
};

export default TasksBlock;
