import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationSettingsForm } from "./notification-settings-form";

const NotificationsSettingsPage = async () => {
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

  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Настройки уведомлений" />
      <div className="w-full">
        <NotificationSettingsForm initialSettings={initialSettings} />
      </div>
    </MainBlockCard>
  );
};

export default NotificationsSettingsPage;
