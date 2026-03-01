"use client";

import { Contact } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ContactListItemProps {
  contact: Contact;
  onClick: () => void;
}

export function ContactListItem({ contact, onClick }: ContactListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      tabIndex={0}
      className="flex items-center gap-4 py-3 px-4 hover:bg-zinc-100 cursor-pointer transition-colors border-b border-zinc-100 last:border-0"
    >
      <Avatar className="size-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center">
        <AvatarFallback className="bg-transparent text-sm font-semibold">
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-[#1D1D1F] truncate">
          {contact.name}
        </div>
        <div className="flex text-xs text-muted-foreground gap-2 truncate">
          {contact.position && <span>{contact.position}</span>}
          {contact.email && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{contact.email}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
