import { Participant, Task } from "@/types";
import { KanbanBoard } from "./kanban-board";

interface TasksBlockProps {
  tasks: Task[];
  id: string;
  members: Participant[];
}

const TasksBlock = ({ tasks, id, members }: TasksBlockProps) => {
  return (
    <div className="h-[calc(100vh-250px)] min-h-[600px]">
      <KanbanBoard initialTasks={tasks} projectId={id} members={members} />
    </div>
  );
};

export default TasksBlock;
