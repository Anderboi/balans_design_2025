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
import { updateUserRole } from "./actions";
import { ArrowRight } from "lucide-react";

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
    <div className="space-y-3">
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
            className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-base">
                  {member.full_name || "Без имени"}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && !isCurrentUser ? (
                <>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleRoleChange(member.id, value as AppRole)
                    }
                  >
                    <SelectTrigger className="w-auto text-sm border-0 shadow-none hover:bg-transparent focus:ring-0 text-muted-foreground">
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
                  <ArrowRight className="size-4 text-muted-foreground" />
                </>
              ) : (
                <span className="text-sm text-muted-foreground bg-zinc-50 px-2 py-1 rounded-lg">
                  {APP_ROLE_LABELS[member.role as AppRole]}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
