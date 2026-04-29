import { KanbanBoard } from "@/features/projects/components/kanban-board";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { tasksService } from "@/lib/services/tasks";
import { profilesService } from '@/lib/services/profiles';

export default async function GlobalTasksPage({ params }: { params: { id: string } }) {
  const [tasks, members] = await Promise.all([
    tasksService.getTasks(params.id),
    profilesService.getProfiles(), // Получаем участников здесь
  ]);

  return (
    <PageContainer>
      <PageHeader title="Все задачи" />
      <div className="h-[calc(100vh-250px)] min-h-[600px] mt-6">
        <KanbanBoard initialTasks={tasks} members={members}/>
      </div>
    </PageContainer>
  );
}
