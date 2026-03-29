import { ArrowRight, CheckCircle2, ListTodo } from "lucide-react";
import Link from "next/link";
import { TaskDetailsDialog } from "../task-details-dialog";
import { tasksService } from "@/lib/services/tasks";
import { getUser } from "@/lib/supabase/getuser";
import { TaskPriority, TASK_PRIORITY_STYLES, DEFAULT_PRIORITY_STYLE } from "@/types";
import { formatDate } from "@/lib/utils/utils";


export async function TasksWidget() {
  const user = await getUser();
  if (!user) return null;

  const allTasks = await tasksService.getTasks();

  // Filter for active status (matches HeroCard logic)
  const activeTasks = allTasks.filter((task) =>
    ["TODO", "IN_PROGRESS", "REVIEW"].includes(task.status)
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
  const activeCount = activeTasks.length;

  return (
    <div className="flex flex-col h-full bg-white shadow-lg shadow-zinc-200/40 rounded-4xl p-6 border border-zinc-100/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 tracking-tight mb-1">
            Текущие задачи
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {activeCount > 0
              ? `${activeCount} задачи в работе`
              : "Нет активных задач"}
          </p>
        </div>
        <ListTodo className="size-5 text-gray-300" />
      </div>

      {/* Task List */}
      <div className="flex-1 flex flex-col">
        {topTasks.length > 0 ? (
          <div className="space-y-2">
            {topTasks.map((task) => {
              const priority = (task.priority as string) || "";
              const style = TASK_PRIORITY_STYLES[priority] || DEFAULT_PRIORITY_STYLE;
              // @ts-expect-error - project might be populated
              const projectName = task.project?.name || "Организационная";

              return (
                <TaskDetailsDialog key={task.id} task={task}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors cursor-pointer group">
                    {/* leading icon/placeholder */}
                    <div className={`size-11 ${style.light} rounded-xl flex items-center justify-center shrink-0`}>
                      <CheckCircle2 className={`size-5 ${style.text} opacity-60`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-zinc-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">
                        {projectName} • {task.due_date ? formatDate(task.due_date) : "Без срока"}
                      </p>
                    </div>

                    {/* Priority Badge */}
                    <div className="shrink-0">
                      <div
                        className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-lg ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </div>
                    </div>
                  </div>
                </TaskDetailsDialog>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-8 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-zinc-300" />
            </div>
            <h4 className="text-sm font-medium text-zinc-700 mb-1">
              Все задачи выполнены
            </h4>
            <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
              У вас нет активных задач в работе
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activeCount > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
          <Link
            href="/tasks"
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors inline-flex items-center gap-1"
          >
            Все задачи <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
