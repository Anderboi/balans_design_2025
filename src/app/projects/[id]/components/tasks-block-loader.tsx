import { tasksService } from "@/lib/services/tasks";
import TasksBlock from "./tasks-block";
import { createClient } from "@/lib/supabase/server";

export default async function TasksBlockLoader({ id }: { id: string }) {
  const supabase = await createClient();
  const tasks = await tasksService.getTasks(id, supabase);
  return <TasksBlock id={id} tasks={tasks} />;
}
