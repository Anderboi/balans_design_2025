"use client";

import { Contact } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const router = useRouter();

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
      onKeyDown={(e) =>
        e.key === "Enter" && router.push(`/contacts/${contact.company_id}`)
      }
      tabIndex={0}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-2xl justify-between border p-6"
    >
      <div onClick={() => router.push(`/contacts/${contact.company_id}`)}>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg bg-teal-600 text-white flex items-center justify-center">
            <AvatarFallback className="bg-transparent text-2xl font-bold">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-xl font-bold leading-6 line-clamp-2">
              {contact.name}
            </div>
            <p className="text-sm text-gray-500">{contact.position}</p>
          </div>
        </div>
      </div>
      <div className="pt-0">
        <div className="border-t border-gray-200 my-4"></div>
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-500">
            Контактная информация
          </div>
          <p className="text-sm text-gray-500">{contact.email}</p>
          <p className="text-sm text-gray-500">{contact.phone}</p>
        </div>
      </div>
    </div>
  );
}
