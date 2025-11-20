import { TaskForm } from "../../components/task-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Новая задача</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm projectId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
