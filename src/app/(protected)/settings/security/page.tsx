import BackLink from '@/components/back-link';
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

const SecuritySettingsPage = () => {
  return (<article className="space-y-4">
      <BackLink href="/settings" className="sm:hidden"/>
    <MainBlockCard className="space-y-6 p-6 md:p-8">
      <PageHeader title="Безопасность" />
      <div className="w-full p-4">
        <p className="text-zinc-500">Настройки безопасности (в разработке)</p>
      </div>
    </MainBlockCard>
    </article>
  );
};

export default SecuritySettingsPage;
