import { createClient } from "@/lib/supabase/server";
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BackLink from "@/components/back-link";

// Скелетон для формы профиля
const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-10 w-full rounded-2xl" />
      <Skeleton className="h-10 w-full rounded-2xl" />
      <Skeleton className="h-10 w-full rounded-2xl" />
    </div>
    <Skeleton className="h-12 w-[150px] rounded-2xl" />
  </div>
);

// Компонент для загрузки данных профиля
const ProfileContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const initialData = {
    full_name: profile.full_name || user.user_metadata?.full_name || "",
    email: profile.email || user.email || "",
    company: profile.company || "",
    avatar_url: profile.avatar_url || undefined,
    full_name_display: profile.full_name || user.email,
    role: profile.role || "client",
  };

  return <ProfileForm initialData={initialData} />;
};

const ProfileSettingsPage = () => {
  return (
    <article className="space-y-4">
      <BackLink href="/settings" className="sm:hidden"/>
      <MainBlockCard className="space-y-6 p-6 md:p-8">
        <PageHeader title="Профиль" />
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </MainBlockCard>
    </article>
  );
};

export default ProfileSettingsPage;
