import BackLink from "@/components/back-link";
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

const IntegrationsSettingsPage = () => {
  return (
    <article className="space-y-4">
      <BackLink href="/settings" className="sm:hidden"/>
      <MainBlockCard className="space-y-6 p-8 md:p-12">
        <PageHeader title="Интеграции" />
        <div className="w-full p-4">
          <p className="text-zinc-500">Настройки интеграций (в разработке)</p>
        </div>
      </MainBlockCard>
    </article>
  );
};

export default IntegrationsSettingsPage;
