import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { NotificationsPopover } from "@/components/notifications-popover";
import { UserMenu } from "@/components/user-menu";
import { notificationsService } from "@/lib/services/notifications";
import { cache, Suspense } from "react";
import { getUser } from "@/lib/supabase/getuser";

const getCachedNotifications = cache(
  async (userId: string) => {
    const supabase = await createClient();
    return notificationsService.getNotifications(
      userId,
      { limit: 50 },
      supabase,
    );
  }
);

export default async function DashboardHeader() {
  const user = await getUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background backdrop-blur-md sticky top-0 z-30 px-6">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-zinc-900 bg-white transition-all" />
        {/* <div className="relative w-full max-w-md hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск по системе..."
            className="w-full bg-zinc-50 border-zinc-100 pl-10 rounded-xl focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-2">
        <Suspense fallback={<BellFallback />}>
          <NotificationsServer userId={user?.id ?? ""} />
        </Suspense>
        <div className="h-8 w-px bg-gray-100 mx-1" />

        <UserMenu userEmail={user?.email ?? null} />
      </div>
    </header>
  );
}

async function NotificationsServer({ userId }: { userId: string | null }) {
  if (!userId)
    return <BellFallback />;

  const notifications = await getCachedNotifications(userId);
  return (
    <NotificationsPopover
      initialNotifications={notifications}
      userId={userId}
    />
  );
}

function BellFallback() {
  return (
    <button className="relative p-2 text-gray-500 rounded-full">
      <Bell className="size-5" />
    </button>
  );
}
