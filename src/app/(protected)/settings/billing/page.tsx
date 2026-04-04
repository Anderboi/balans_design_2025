import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

const BillingSettingsPage = () => {
  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Тариф и Оплата" />
      <div className="w-full p-4">
        <p className="text-zinc-500">
          Информация о тарифе и оплате (в разработке)
        </p>
      </div>
    </MainBlockCard>
  );
};

export default BillingSettingsPage;
