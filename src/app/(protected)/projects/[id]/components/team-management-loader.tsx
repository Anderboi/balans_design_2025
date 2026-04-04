import { getProjectMembers } from "@/lib/actions/team";
import { TeamManagement } from "./team-management";

export default async function TeamManagementLoader({ id }: { id: string }) {
  const members = await getProjectMembers(id);
  return <TeamManagement projectId={id} initialMembers={members} />;
}
