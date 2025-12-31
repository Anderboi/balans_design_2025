import { createClient } from "@/lib/supabase/server";
import { HeroCard } from "@/components/dashboard/hero-card";
import { TasksWidget } from "@/components/dashboard/tasks-widget";
import { DeliveryWidget } from "@/components/dashboard/delivery-widget";
import { HistoryWidget } from "@/components/dashboard/history-widget";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Пользователь";

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Hero Section */}
      <section>
        <HeroCard userName={userName} />
      </section>

      {/* Widgets Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-4">
          <TasksWidget />
        </div>
        <div className="md:col-span-4">
          <div className="h-full pt-[44px]">
            {" "}
            {/* Align with widgets that have headers */}
            <DeliveryWidget />
          </div>
        </div>
        <div className="md:col-span-4">
          <HistoryWidget />
        </div>
      </section>
    </div>
  );
}
