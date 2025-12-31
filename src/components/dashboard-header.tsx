import { Bell, Search, UserCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="-ml-1" />
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
        <button className="text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <UserCircle className="h-8 w-8 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
