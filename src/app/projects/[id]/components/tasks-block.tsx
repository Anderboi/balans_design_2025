import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types";
import BlockHeader from "./block-header";

const TasksBlock = ({ tasks, id }: { tasks: Task[]; id: string }) => {
  return (
    <>
      <BlockHeader title="Задачи" href={`/projects/${id}/tasks/new`} />

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p>
                      <span className="font-medium">Статус:</span> {task.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <span className="font-medium">Срок:</span>{" "}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Приоритет:</span>{" "}
                      {task.status} //TODO: добавить приоритет задаче
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Нет добавленных задач</p>
        </div>
      )}
    </>
  );
};

export default TasksBlock;
