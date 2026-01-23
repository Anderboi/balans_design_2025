"use client";

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
import { usePathname } from "next/navigation";
import { signout } from "@/app/login/actions";
import { Separator } from '@/components/ui/separator';

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

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2 flex flex-col items-start w-full //flex-1">
      {menuItems.map((menuItem, index) => {
        const Icon = menuItem.icon;
        const isActive = pathname === menuItem.href;
        return (
          <Link key={index} href={menuItem.href} className="w-full" passHref>
            <Button
              size={"lg"}
              variant={isActive ? "outline" : "ghost"}
              className="cursor-pointer w-full items-center justify-start hover:bg-zinc-200"
            >
              <Icon className="size-[18px]" />
              {menuItem.label}
            </Button>
          </Link>
        );
      })}
      <form action={signout} className="w-full mt-6">
        <Separator />
        <Button
          variant={"ghost"}
          size={"lg"}
          className="mt-6 cursor-pointer w-full items-center justify-start text-red-500 hover:text-red-600 hover:bg-red-100 bg-red-50"
          type="submit"
        >
          <LogOut className="size-[18px]" />
          Выйти
        </Button>
      </form>
    </nav>
  );
}
