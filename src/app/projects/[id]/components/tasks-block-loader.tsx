import { tasksService } from "@/lib/services/tasks";
import TasksBlock from "./tasks-block";

export default async function TasksBlockLoader({ id }: { id: string }) {
  // TODO: Add filtering by project_id when API supports it
  const tasks = await tasksService.getTasks();
  return <TasksBlock id={id} tasks={tasks} />;
}
