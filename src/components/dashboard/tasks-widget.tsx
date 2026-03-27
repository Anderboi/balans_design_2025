import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { TaskDetailsDialog } from '../task-details-dialog';
import { Badge } from '../ui/badge';
import { tasksService } from '@/lib/services/tasks';
import { getUser } from '@/lib/supabase/getuser';
import { TaskPriority } from '@/types';
import { formatDate } from '@/lib/utils/utils';

export async function TasksWidget() {
  const user = await getUser();
  if (!user) return null;

  const allTasks = await tasksService.getTasks();
  
  // Filter for active status (matches HeroCard logic)
  const activeTasks = allTasks.filter(
    (task) => ["TODO", "IN_PROGRESS", "REVIEW"].includes(task.status)
  );

  // Sort by priority and due date
  const priorityWeight: Record<string, number> = {
    [TaskPriority.HIGH]: 3,
    [TaskPriority.MEDIUM]: 2,
    [TaskPriority.LOW]: 1,
  };

  activeTasks.sort((a, b) => {
    const pwA = priorityWeight[a.priority as string] || 0;
    const pwB = priorityWeight[b.priority as string] || 0;
    if (pwA !== pwB) {
      return pwB - pwA; // Higher first
    }
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return 0;
  });

  const topTasks = activeTasks.slice(0, 3);

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { label: "Критично", className: "bg-red-50 text-red-500 hover:bg-red-50" };
      case TaskPriority.MEDIUM:
        return { label: "Средний", className: "bg-amber-50 text-amber-600 hover:bg-amber-50" };
      case TaskPriority.LOW:
        return { label: "Низкий", className: "bg-blue-50 text-blue-600 hover:bg-blue-50" };
      default:
        return { label: priority || "ОБЫЧНЫЙ", className: "bg-zinc-50 text-zinc-500 hover:bg-zinc-50" };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg shadow-zinc-200/40 rounded-4xl p-6 border border-zinc-100/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
          Ваши текущие задачи
        </h3>
        <Link
          href="/tasks"
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          Все задачи <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        {topTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {topTasks.map((task) => {
              const priorityInfo = getPriorityInfo(task.priority as string || "");
              // @ts-expect-error - project might be populated from the query update
              const projectName = task.project?.name || "Организационная задача";
              
              return (
                <TaskDetailsDialog key={task.id} task={task}>
                  <div className="bg-white border hover:border-blue-200 hover:shadow-md border-zinc-100 rounded-2xl p-4 cursor-pointer group text-left w-full relative transition-all duration-200">
                    <div className="flex justify-between items-center mb-3">
                      <Badge
                        variant="outline"
                        className={`border-0 text-[10px] sm:text-xs px-2.5 py-0.5 font-medium uppercase tracking-wider ${priorityInfo.className}`}
                      >
                        {priorityInfo.label}
                      </Badge>
                      <span className="text-xs font-medium text-zinc-400">
                        {task.due_date ? formatDate(task.due_date) : "Без срока"}
                      </span>
                    </div>

                    <h4 className="text-[15px] sm:text-base font-medium text-zinc-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider line-clamp-1 max-w-[80%]">
                        {projectName}
                      </span>
                      <div className="h-7 w-7 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </TaskDetailsDialog>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-zinc-300" />
            </div>
            <h4 className="text-sm font-medium text-zinc-700 mb-1">Нет активных задач</h4>
            <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">У вас нет задач в работе. Отличный повод передохнуть!</p>
          </div>
        )}
      </div>
    </div>
  );
}
