import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TaskDetailsDialog } from '../task-details-dialog';
import { Badge } from '../ui/badge';
import { tasksService } from '@/lib/services/tasks';

export async function TasksWidget() {
  const tasks = await tasksService.getTasks();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Текущие задачи по всем проектам
        </h3>
        <Link
          href="/tasks"
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          Все задачи <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <TaskDetailsDialog task={tasks[0]}>
        <div className="bg-white shadow-lg shadow-zinc-300/50 rounded-4xl p-6 flex-1 cursor-pointer group text-left w-full h-full relative">
          <div className="flex justify-between items-start mb-4">
            <Badge
              variant="destructive"
              className="bg-red-50 text-red-500 hover:bg-red-50 border-0 text-[10px] px-2 py-0.5 uppercase tracking-wide"
            >
              Критично
            </Badge>
            <span className="text-xs text-gray-400">20.11.2023</span>
          </div>

          <h4 className="text-xl font-medium mb-8 group-hover:text-blue-600 transition-colors">
            Заказать образцы плитки
          </h4>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Апартаменты Хамовники
            </span>
            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
            </div>
          </div>
        </div>
      </TaskDetailsDialog>
    </div>
  );
}
