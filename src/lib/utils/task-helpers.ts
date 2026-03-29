import { TaskStatus, TASK_STATUS_LABELS, TASK_PRIORITY_STYLES, DEFAULT_PRIORITY_STYLE } from "@/types";

export const getTaskPriorityColor = (priority?: string): string => {
  if (!priority) return `${DEFAULT_PRIORITY_STYLE.bg} ${DEFAULT_PRIORITY_STYLE.text}`;
  
  // Normalize priority to match enum case/Russian labels
  const style = TASK_PRIORITY_STYLES[priority] || 
                TASK_PRIORITY_STYLES[priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()] ||
                DEFAULT_PRIORITY_STYLE;

  return `${style.bg} ${style.text}`;
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
