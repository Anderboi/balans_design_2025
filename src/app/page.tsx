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
  let activeTasksCount = 0;
  let activeProjectsCount = 0;
  let totalTasksCount = 0;

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

    // Fetch active task count for current user (TODO, IN_PROGRESS, REVIEW)
    const { count: focusTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .in("status", ["TODO", "IN_PROGRESS", "REVIEW"]);
      
    activeTasksCount = focusTasks || 0;

    // Fetch total active projects count
    const { count: projectsCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .neq("stage", "Комплектация"); // Or any other logic; if stage isn't Completation, it's active

    activeProjectsCount = projectsCount || 0;

    // Fetch total tasks count
    const { count: totalTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    totalTasksCount = totalTasks || 0;
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <section>
        <HeroCard 
          userName={userName} 
          activeTasksCount={activeTasksCount} 
          activeProjectsCount={activeProjectsCount}
          totalTasksCount={totalTasksCount}
        />
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
