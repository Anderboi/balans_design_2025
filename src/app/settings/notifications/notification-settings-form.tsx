"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateNotificationSettings } from "./actions";

interface NotificationSettings {
  notifications_new_tasks: boolean;
  notifications_comments: boolean;
  notifications_project_statuses: boolean;
  notifications_file_uploads: boolean;
  notifications_marketing: boolean;
}

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
}

export function NotificationSettingsForm({
  initialSettings,
}: NotificationSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (key: string, value: boolean) => {
    startTransition(async () => {
      const newSettings = { ...initialSettings, [key]: value };
      const result = await updateNotificationSettings(newSettings);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Настройки обновлены");
      }
    });
  };

  const settings = [
    {
      id: "notifications_new_tasks",
      title: "Новые задачи",
      description: "Уведомлять о назначении новых задач",
    },
    {
      id: "notifications_comments",
      title: "Комментарии",
      description: "Уведомлять о новых комментариях в обсуждениях",
    },
    {
      id: "notifications_project_statuses",
      title: "Статусы проектов",
      description: "Уведомлять при смене этапа или статуса проекта",
    },
    {
      id: "notifications_file_uploads",
      title: "Загрузка файлов",
      description: "Уведомлять когда клиент загружает новые документы",
    },
    {
      id: "notifications_marketing",
      title: "Маркетинг и новости",
      description: "Получать новости об обновлениях платформы",
    },
  ];

  return (
    <div className="divide-y divide-zinc-100">
      {settings.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-6 first:pt-0 last:pb-0"
        >
          <div className="space-y-1">
            <Label
              htmlFor={item.id}
              className="text-base font-semibold cursor-pointer"
            >
              {item.title}
            </Label>
            <p className="text-sm text-zinc-500">{item.description}</p>
          </div>
          <Switch
          
            id={item.id}
            checked={
              initialSettings[item.id as keyof NotificationSettings] ?? false
            }
            onCheckedChange={(checked) => handleToggle(item.id, checked)}
            disabled={isPending}
          />
        </div>
      ))}
    </div>
  );
}
