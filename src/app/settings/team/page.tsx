import { createClient } from "@/lib/supabase/server";
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";
import { redirect } from "next/navigation";
import { TeamMembersList } from "./team-members-list";

const TeamSettingsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current user's profile to check role
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Fetch all team members
  const { data: teamMembers, error } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  if (error) {
    console.error("Error fetching team members:", error);
  }

  const isAdmin = currentUserProfile?.role === "admin";

  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Команда" />
      <TeamMembersList
        members={teamMembers || []}
        currentUserId={user.id}
        isAdmin={isAdmin}
      />
    </MainBlockCard>
  );
};

export default TeamSettingsPage;
