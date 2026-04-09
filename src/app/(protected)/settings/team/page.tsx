import { createClient } from "@/lib/supabase/server";
import MainBlockCard from "@/components/ui/main-block-card";
import { redirect } from "next/navigation";
import { TeamMembersList } from "./team-members-list";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BackLink from "@/components/back-link";

// Скелетон для списка команды
const TeamSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50"
      >
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3 rounded-lg" />
          <Skeleton className="h-3 w-1/4 rounded-lg opacity-50" />
        </div>
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    ))}
  </div>
);

// Компонент для загрузки данных команды
const TeamContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Параллельная загрузка профиля и списка членов (ускоряем!)
  const [profileRes, membersRes] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("profiles").select("*").order("full_name"),
  ]);

  const isAdmin = profileRes.data?.role === "admin";
  const teamMembers = membersRes.data || [];

  return (
    <TeamMembersList
      members={teamMembers}
      currentUserId={user.id}
      isAdmin={isAdmin}
    />
  );
};

const TeamSettingsPage = () => {
  return (
    <article className="space-y-4">
      <BackLink href="/settings" className="sm:hidden"/>
      <MainBlockCard className="space-y-8 p-6 md:p-8">
        <PageHeader title="Управление командой">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 cursor-pointer"
          >
            <UserPlus className="size-4" />
            Пригласить
          </Button>
        </PageHeader>
        <Suspense fallback={<TeamSkeleton />}>
          <TeamContent />
        </Suspense>
      </MainBlockCard>
    </article>
  );
};

export default TeamSettingsPage;
