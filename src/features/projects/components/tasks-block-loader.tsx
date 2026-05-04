import { tasksService } from "@/lib/services/tasks";
import TasksBlock from "./tasks-block";
import { createClient } from "@/lib/supabase/server";
import { profilesService } from "@/lib/services/profiles";

export default async function TasksBlockLoader({ id }: { id: string }) {
  const supabase = await createClient();

  const [tasks, members] = await Promise.all([
    tasksService.getTasks(id, supabase),
    profilesService.getProfiles(supabase),
  ]);
  return <TasksBlock id={id} tasks={tasks} members={members}/>;
}
