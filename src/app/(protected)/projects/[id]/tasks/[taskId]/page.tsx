import { tasksService } from "@/lib/services/tasks";
import { TaskDetails } from "../../../../../../features/projects/components/task-details";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface TaskPageProps {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id, taskId } = await params;
  const task = await tasksService.getTaskById(taskId);

  if (!task) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="pl-0 hover:pl-2 transition-all"
        >
          <Link href={`/projects/${id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад к проекту
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <TaskDetails task={task} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
