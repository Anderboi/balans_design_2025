import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationSettingsForm } from "./notification-settings-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BackLink from '@/components/back-link';

// Скелетон для настроек уведомлений
const NotificationsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48 rounded-lg" />
          <Skeleton className="h-3 w-64 rounded-lg opacity-50" />
        </div>
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>
    ))}
  </div>
);

// Компонент загрузки данных уведомлений
const NotificationsContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select(
      "notifications_new_tasks, notifications_comments, notifications_project_statuses, notifications_file_uploads, notifications_marketing",
    )
    .eq("id", user.id)
    .single()) as { data: any };

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const initialSettings = {
    notifications_new_tasks: profile.notifications_new_tasks ?? true,
    notifications_comments: profile.notifications_comments ?? true,
    notifications_project_statuses:
      profile.notifications_project_statuses ?? true,
    notifications_file_uploads: profile.notifications_file_uploads ?? true,
    notifications_marketing: profile.notifications_marketing ?? false,
  };

  return <NotificationSettingsForm initialSettings={initialSettings} />;
};

const NotificationsSettingsPage = () => {
  return (
    <article className="space-y-4">
      <BackLink href="/settings" className="sm:hidden"/>
    <MainBlockCard className="space-y-6 p-6 md:p-8">
      <PageHeader title="Настройки уведомлений" />
      <div className="w-full">
        <Suspense fallback={<NotificationsSkeleton />}>
          <NotificationsContent />
        </Suspense>
      </div>
    </MainBlockCard>
    </article>
  );
};

export default NotificationsSettingsPage;
