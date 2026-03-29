import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ACTION_STYLES, DEFAULT_ACTION_STYLE, describeAction, relativeTime } from "./history-utils";
import { HistorySheetClient } from "./history-sheet-client";

export async function HistoryWidget() {
  const supabase = await createClient();

  // Fetch recent history entries across ALL projects, joining task + project + user
  const { data: historyItems } = await supabase
    .from("task_history" as any)
    .select("id, action, details, created_at, task:tasks(id, title, project:projects(name)), user:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(20)
    .returns<any[]>();

  const items = (historyItems ?? []).slice(0, 4);
  const totalCount = historyItems?.length ?? 0;

  return (
    <div className="flex flex-col h-full bg-white shadow-lg shadow-zinc-200/40 rounded-4xl p-6 border border-zinc-100/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 tracking-tight mb-1">
            Последние изменения
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {totalCount > 0
              ? `${totalCount} событий за сутки`
              : "Нет изменений"}
          </p>
        </div>
        <Clock className="size-5 text-gray-300" />
      </div>

      {/* History List */}
      <div className="flex-1 flex flex-col">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item: any) => {
              const actionStyle = ACTION_STYLES[item.action] || DEFAULT_ACTION_STYLE;
              const Icon = actionStyle.icon;
              const taskTitle = item.task?.title || "Задача";
              const projectName = item.task?.project?.name || "";
              const userName = item.user?.full_name || "";
              const description = describeAction(item.action, item.details);

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors cursor-default"
                >
                  {/* Leading Icon */}
                  <div className={`size-11 ${actionStyle.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`size-5 ${actionStyle.text} opacity-60`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-zinc-900 truncate leading-tight">
                      {description}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate">
                      {[taskTitle, projectName, userName].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  {/* Time Badge */}
                  <div className="shrink-0">
                    <div className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                      {relativeTime(item.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-8 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-zinc-300" />
            </div>
            <h4 className="text-sm font-medium text-zinc-700 mb-1">
              Нет изменений
            </h4>
            <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
              История изменений по проектам пока пуста
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {totalCount > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
          <HistorySheetClient items={historyItems || []} totalCount={totalCount} />
        </div>
      )}
    </div>
  );
}
