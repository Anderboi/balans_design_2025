import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

const SecuritySettingsPage = () => {
  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Безопасность" />
      <div className="w-full p-4">
        <p className="text-zinc-500">Настройки безопасности (в разработке)</p>
      </div>
    </MainBlockCard>
  );
};

export default SecuritySettingsPage;
