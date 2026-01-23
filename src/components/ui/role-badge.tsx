"use client";

import { Badge } from "@/components/ui/badge";
import { APP_ROLE_LABELS, AppRole } from "@/types";

interface RoleBadgeProps {
  role: AppRole;
  className?: string;
}

const ROLE_COLORS: Record<AppRole, string> = {
  [AppRole.ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [AppRole.ARCHITECT]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  [AppRole.MANAGER]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [AppRole.DESIGNER]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [AppRole.CLIENT]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [AppRole.CONTRACTOR]:
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      className={`${ROLE_COLORS[role]} ${className || ""}`}
      variant="outline"
    >
      {APP_ROLE_LABELS[role]}
    </Badge>
  );
}
