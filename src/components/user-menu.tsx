"use client";

import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signout } from "@/app/login/actions";
import Link from "next/link";

interface UserMenuProps {
  userEmail: string | null;
}

export function UserMenu({ userEmail }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all group cursor-pointer">
          <Avatar className="h-8 w-8 bg-gray-100 group-hover:bg-gray-200 transition-colors border border-gray-100">
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
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-zinc-900">
              Личный кабинет
            </p>
            <p className="text-xs leading-none text-zinc-500 truncate">
              {userEmail || "Гость"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer focus:bg-gray-50 focus:text-zinc-900 rounded-lg mx-1 my-1"
        >
          <Link href="/settings/profile">Профиль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer focus:bg-gray-50 focus:text-zinc-900 rounded-lg mx-1 my-1"
        >
          <Link href="/settings">Настройки</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem asChild className="p-0 mx-1 my-1">
          <form action={signout} className="w-full">
            <button
              type="submit"
              className="w-full text-left px-2 py-1.5 text-sm cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg transition-colors outline-none"
            >
              Выйти
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
