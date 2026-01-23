import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

const NotificationsSettingsPage = () => {
  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Уведомления" />
      <div className="w-full p-4">
        <p className="text-zinc-500">Настройки уведомлений (в разработке)</p>
      </div>
    </MainBlockCard>
  );
};

export default NotificationsSettingsPage;
