import { TaskStatus, TaskPriority, TASK_STATUS_LABELS } from "@/types";

export const getTaskPriorityColor = (priority?: string): string => {
  const priorityMap: Record<string, string> = {
    [TaskPriority.HIGH]: "bg-red-100 text-red-700 border-red-200",
    high: "bg-red-100 text-red-700 border-red-200",
    высокий: "bg-red-100 text-red-700 border-red-200",
    [TaskPriority.MEDIUM]: "bg-amber-100 text-amber-700 border-amber-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    средний: "bg-amber-100 text-amber-700 border-amber-200",
    [TaskPriority.LOW]: "bg-zinc-100 text-zinc-600 border-zinc-200",
    low: "bg-zinc-100 text-zinc-600 border-zinc-200",
    низкий: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    priorityMap[priority || ""] || "bg-zinc-100 text-zinc-600 border-zinc-200"
  );
};
export const getTaskStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    [TaskStatus.TODO]: "bg-zinc-100 text-zinc-600",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700",
    [TaskStatus.REVIEW]: "bg-purple-100 text-purple-700",
    [TaskStatus.DONE]: "bg-green-100 text-green-700",
  };

  return statusMap[status] || "bg-zinc-100 text-zinc-600";
};
export const getTaskStatusLabel = (status: string): string => {
  return TASK_STATUS_LABELS[status as TaskStatus] || status;
};
