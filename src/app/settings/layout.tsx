import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CreditCard,
  Globe,
  LogOut,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { signout } from "@/app/login/actions";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const menuItems = [
    { id: "profile", label: "Профиль", icon: User, href: "/settings/profile" },
    {
      id: "notifications",
      label: "Уведомления",
      icon: Bell,
      href: "/settings/notifications",
    },
    { id: "team", label: "Команда", icon: Users, href: "/settings/team" },
    {
      id: "billing",
      label: "Тариф и Оплата",
      icon: CreditCard,
      href: "/settings/billing",
    },
    {
      id: "integrations",
      label: "Интеграции",
      icon: Globe,
      href: "/settings/integrations",
    },
    {
      id: "security",
      label: "Безопасность",
      icon: Shield,
      href: "/settings/security",
    },
  ];

  return (
    <div>
      <PageContainer>
        <article className="flex flex-col sm:flex-row gap-4">
          <section>
            <PageHeader title="Настройки" />
            <p className="text-zinc-500 text-sm mb-6">
              Управление аккаунтом и параметрами системы.
            </p>
            <nav className="space-y-2 flex flex-col items-start w-full //flex-1">
              {menuItems.map((menuItem, index) => {
                const Icon = menuItem.icon;
                return (
                  <Link
                    key={index}
                    href={menuItem.href}
                    className="w-full"
                    passHref
                  >
                    <Button
                      variant={"outline"}
                      className="cursor-pointer w-full items-center justify-start"
                    >
                      <Icon />
                      {menuItem.label}
                    </Button>
                  </Link>
                );
              })}
              <form action={signout} className="w-full">
                <Button
                  variant={"outline"}
                  className="cursor-pointer w-full items-center justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  type="submit"
                >
                  <LogOut />
                  Выйти
                </Button>
              </form>
            </nav>
          </section>
          <section className="w-full h-full">{children}</section>
        </article>
      </PageContainer>
    </div>
  );
};

export default SettingsLayout;
