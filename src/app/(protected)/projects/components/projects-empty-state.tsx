import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/components/create-project-dialog";

export function ProjectsEmptyState() {
  return (
    <div className="col-span-full py-20 text-center rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Нет активных проектов
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Создайте свой первый проект, чтобы начать работу над дизайном и
        документацией.
      </p>
      <CreateProjectDialog>
        <Button className="rounded-full px-6 h-12 bg-black hover:bg-gray-800">
          Создать проект
        </Button>
      </CreateProjectDialog>
    </div>
  );
}
