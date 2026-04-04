import React from "react";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { SettingsNav } from "./_components/settings-nav";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageContainer>
      <article className="flex flex-col sm:flex-row gap-4">
        <section>
          <PageHeader title="Настройки" />
          <p className="text-zinc-500 text-sm mb-6">
            Управление аккаунтом и параметрами системы.
          </p>
          <SettingsNav />
        </section>
        <section className="w-full h-full">{children}</section>
      </article>
    </PageContainer>
  );
};

export default SettingsLayout;
