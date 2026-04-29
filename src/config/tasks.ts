import { TASK_STATUS_LABELS, TaskStatus } from '@/types';

export const COLUMNS = [
  {
    id: "TODO",
    status: TaskStatus.TODO,
    title: TASK_STATUS_LABELS[TaskStatus.TODO],
    color: "bg-zinc-100",
  },
  {
    id: "IN_PROGRESS",
    status: TaskStatus.IN_PROGRESS,
    title: TASK_STATUS_LABELS[TaskStatus.IN_PROGRESS],
    color: "bg-blue-50/50",
  },
  {
    id: "REVIEW",
    status: TaskStatus.REVIEW,
    title: TASK_STATUS_LABELS[TaskStatus.REVIEW],
    color: "bg-purple-50/50",
  },
  {
    id: "DONE",
    status: TaskStatus.DONE,
    title: TASK_STATUS_LABELS[TaskStatus.DONE],
    color: "bg-green-50/50",
  },
];
