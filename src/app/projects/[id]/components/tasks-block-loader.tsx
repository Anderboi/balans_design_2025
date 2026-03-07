import { tasksService } from "@/lib/services/tasks";
import TasksBlock from "./tasks-block";

export default async function TasksBlockLoader({ id }: { id: string }) {
  const tasks = await tasksService.getTasks(id);
  return <TasksBlock id={id} tasks={tasks} />;
}
