import { Clock, FileEdit, CheckCircle, AlertCircle, Plus, Trash2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils/utils";

// Action → icon + color mapping (Apple HIG palette)
export const ACTION_STYLES: Record<
  string,
  { icon: any; bg: string; text: string; label: string }
> = {
  created: {
    icon: Plus,
    bg: "bg-green-50",
    text: "text-green-500",
    label: "Создана",
  },
  status_changed: {
    icon: RefreshCw,
    bg: "bg-blue-50",
    text: "text-blue-500",
    label: "Статус изменён",
  },
  updated: {
    icon: FileEdit,
    bg: "bg-amber-50",
    text: "text-amber-600",
    label: "Обновлена",
  },
  completed: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-500",
    label: "Завершена",
  },
  deleted: {
    icon: Trash2,
    bg: "bg-red-50",
    text: "text-red-500",
    label: "Удалена",
  },
};

export const DEFAULT_ACTION_STYLE = {
  icon: AlertCircle,
  bg: "bg-zinc-50",
  text: "text-zinc-500",
  label: "Изменение",
};

/** Build a human-readable description from action + details */
export function describeAction(action: string, details?: Record<string, unknown>): string {
  if (!details || Object.keys(details).length === 0) {
    return ACTION_STYLES[action]?.label ?? "Изменение";
  }

  if (action === "status_changed" && details.status) {
    const statusLabels: Record<string, string> = {
      TODO: "К выполнению",
      IN_PROGRESS: "В процессе",
      REVIEW: "На проверке",
      DONE: "Выполнена",
    };
    return `Статус → ${statusLabels[details.status as string] || details.status}`;
  }

  if (details.priority) return `Приоритет → ${details.priority}`;
  if (details.checklist_completed) return `✓ ${details.checklist_completed}`;
  if (details.checklist_uncompleted) return `○ ${details.checklist_uncompleted}`;
  if (details.checklist_item_added) return `+ ${details.checklist_item_added}`;
  if (details.checklist_item_removed) return `− ${details.checklist_item_removed}`;
  if (details.checklist_renamed) return `Чек-лист: ${details.checklist_renamed}`;
  if (details.checklist_removed) return `Удалён чек-лист: ${details.checklist_removed}`;
  if (details.description_changed) return "Описание обновлено";
  if (details.due_date) return `Срок → ${formatDate(details.due_date as string)}`;
  if (details.assignee_changed) return "Исполнитель изменён";

  return ACTION_STYLES[action]?.label ?? "Изменение";
}

/** Format relative time (e.g. "5 мин назад", "2 ч назад", "вчера") */
export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  return formatDate(dateStr);
}
