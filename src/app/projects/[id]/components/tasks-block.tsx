import { Task } from "@/types";
import BlockHeader from "./block-header";
import { KanbanBoard } from "./kanban-board";

const TasksBlock = ({ tasks, id }: { tasks: Task[]; id: string }) => {
  return (
    <>
      <BlockHeader
        title="Задачи"
        href={`/projects/${id}/tasks/new`}
        buttontext="Добавить задачу"
      />
      <div className="h-[calc(100vh-250px)] min-h-[600px]">
        <KanbanBoard initialTasks={tasks} />
      </div>
    </>
  );
};

export default TasksBlock;
