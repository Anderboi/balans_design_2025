import { createClient } from "@/lib/supabase/server";
import MainBlockCard from "@/components/ui/main-block-card";
import PageHeader from "@/components/ui/page-header";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

const ProfileSettingsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile data.
  // If profile doesn't exist (which shouldn't happen for logged in user usually if triggers are set),
  // we might need to handle it. profilesService.getProfileById returns minimal data.
  // We need to fetch the actual columns if they exist.
  // Since profilesService.getProfileById selects *, it should return all fields.
  // WE need to check what fields are actually returned by getProfileById to match ProfileFormProps.
  // The service returns Participant which has id, name, avatar.
  // But the select * fetches everything.
  // I should probably use a direct query here or update the service return type to be generic or specific.
  // For now let's assume the service returns what we need if casted or accessed.
  // Actually, getProfileById in profiles.ts returns:
  // { id: data.id, name: data.full_name, avatar: data.avatar_url }
  // This strips other fields!
  // I should call supabase directly here or add a new method to service "getFullProfile".
  // Or just use the direct query since it's a server component.

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Handle case where profile is missing but user exists
    return <div>Profile not found</div>;
  }

  // Use DB columns if they exist, otherwise fallback or parsing
  const initialData = {
    full_name: profile.full_name || user.user_metadata?.full_name || "",
    email: profile.email || user.email || "",
    company: profile.company || "",
    avatar_url: profile.avatar_url || undefined,
    full_name_display: profile.full_name || user.email,
    role: profile.role || "client",
  };

  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <PageHeader title="Профиль" />
      <ProfileForm initialData={initialData} />
    </MainBlockCard>
  );
};

export default ProfileSettingsPage;
