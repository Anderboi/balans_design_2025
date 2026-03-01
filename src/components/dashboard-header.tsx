import { Search, UserCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/login/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/notifications-popover";

import Link from "next/link";

export default async function DashboardHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-900 bg-white transition-all" />
        <div className="relative w-full max-w-md hidden md:flex items-center">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск по системе..."
            className="w-full bg-gray-50 border-none pl-9 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all">
              <Avatar className="h-8 w-8 bg-gray-100 hover:bg-gray-200 transition-colors">
                <AvatarFallback className="bg-transparent">
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border-gray-100 shadow-xl shadow-black/5"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-zinc-900">
                  Пользователь
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {user?.email || "Email не указан"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-gray-50 focus:text-zinc-900 rounded-lg"
            >
              <Link href="/settings/profile">Профиль</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-gray-50 focus:text-zinc-900 rounded-lg"
            >
              <Link href="/settings">Настройки</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem asChild className="p-0">
              <form action={signout} className="w-full">
                <button
                  type="submit"
                  className="w-full text-left px-2 py-1.5 text-sm cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg transition-colors"
                >
                  Выйти
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
