"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsNav } from "./_components/settings-nav";
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Если ширина экрана >= 640px (tailwind sm), перенаправляем на профиль
    const mql = window.matchMedia("(min-width: 640px)");

    const checkRedirect = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        router.replace("/settings/profile");
      }
    };

    // Первичная проверка при загрузке
    checkRedirect(mql);

    // Слушаем изменение размера экрана
    mql.addEventListener("change", checkRedirect);
    return () => mql.removeEventListener("change", checkRedirect);
  }, [router]);

  return (
    <div className="sm:hidden w-full">
      <div className=" sm:hidden flex flex-col">
        <PageHeader title="Настройки" />
        <p className="text-zinc-500 text-sm mb-6">
          Управление аккаунтом и параметрами системы.
        </p>
      </div>
      <MainBlockCard className="border-none shadow-none bg-transparent sm:bg-white">
        <SettingsNav />
      </MainBlockCard>
    </div>
  );
}
