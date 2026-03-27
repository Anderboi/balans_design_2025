import { KanbanBoard } from "@/app/projects/[id]/components/kanban-board";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { tasksService } from "@/lib/services/tasks";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GlobalTasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all tasks for all projects (and organization tasks)
  const tasks = await tasksService.getTasks();

  return (
    <PageContainer>
      <PageHeader title="Все задачи" />
      <div className="h-[calc(100vh-250px)] min-h-[600px] mt-6">
        <KanbanBoard initialTasks={tasks} />
      </div>
    </PageContainer>
  );
}
