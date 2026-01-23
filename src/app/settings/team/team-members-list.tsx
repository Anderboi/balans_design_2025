"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_ROLE_LABELS, AppRole } from "@/types";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserRole } from './actions';

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface TeamMembersListProps {
  members: Profile[];
  currentUserId: string;
  isAdmin: boolean;
}

export function TeamMembersList({
  members,
  currentUserId,
  isAdmin,
}: TeamMembersListProps) {
  const router = useRouter();

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    const result = await updateUserRole(userId, newRole);

    if (result.error) {
      toast.error("Ошибка обновления роли");
    } else {
      toast.success("Роль успешно обновлена");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const initials =
          member.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "?";

        const isCurrentUser = member.id === currentUserId;

        return (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar_url || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {member.full_name || "Без имени"}
                  {isCurrentUser && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Вы)
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && !isCurrentUser ? (
                <Select
                  value={member.role}
                  onValueChange={(value) =>
                    handleRoleChange(member.id, value as AppRole)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AppRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {APP_ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <RoleBadge role={member.role as AppRole} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
