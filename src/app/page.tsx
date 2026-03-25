import { HeroCard } from "@/components/dashboard/hero-card";
import { TasksWidget } from "@/components/dashboard/tasks-widget";
import { DeliveryWidget } from "@/components/dashboard/delivery-widget";
import { HistoryWidget } from "@/components/dashboard/history-widget";
import { getUser } from '@/lib/supabase/getuser';
import { createClient } from '@/lib/supabase/server';
import PageContainer from '@/components/ui/page-container';

export default async function Home() {
  const user = await getUser()
  let userName = "Пользователь";

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      let firstName = "";
      if (profile.full_name) {
        firstName = profile.full_name.split(" ")[0] || "";
      }
      userName = 
        profile.first_name || 
        firstName || 
        user.user_metadata?.full_name || 
        user.email?.split("@")[0] || 
        "Пользователь";
    } else {
      userName = 
        user.user_metadata?.full_name || 
        user.email?.split("@")[0] || 
        "Пользователь";
    }
  }

  return (
    <PageContainer>
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
            
            {/* Align with widgets that have headers */}
            <DeliveryWidget />
          </div>
        </div>
        <div className="md:col-span-4">
          <HistoryWidget />
        </div>
      </section>
    </PageContainer>
  );
}
