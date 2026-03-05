// Типы уведомлений

export type NotificationType =
  | "task_assigned"
  | "task_comment"
  | "project_stage_changed"
  | "file_uploaded"
  | "variant_approved"
  | "team_member_added"
  | "general";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  task_assigned: "Назначение задачи",
  task_comment: "Комментарий",
  project_stage_changed: "Смена стадии",
  file_uploaded: "Загрузка файла",
  variant_approved: "Согласование",
  team_member_added: "Команда",
  general: "Общее",
};
