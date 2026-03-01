"use client";

import { Company, Contact } from "@/types";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CompanyType } from "@/types";
import { useEffect, useState } from "react";
import { contactsService } from "@/lib/services/contacts";

interface CompanyCardProps {
  company: Company | Contact;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const companyContacts = await contactsService.getContactsByCompany(
        company.id,
      );
      setContacts(companyContacts);
    };

    fetchContacts();
  }, [company.id]);

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
        e.key === "Enter" && router.push(`/contacts/${company.id}`)
      }
      tabIndex={0}
      onClick={() => router.push(`/contacts/${company.id}`)}
      className="cursor-pointer glass-card rounded-4xl justify-between p-6"
    >
      <section>
        <div className="flex items-start gap-4">
          <Avatar className="size-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center">
            <AvatarFallback className="bg-transparent text-2xl font-bold text-white">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 ">
            <div className="text-xl font-bold leading-6 line-clamp-2">
              {company.name}
            </div>
            <p className="text-sm text-gray-400">
              {company.type === CompanyType.SUPPLIER ? "Поставщик" : "Клиент"}
            </p>
          </div>
        </div>
        {/* <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit functionality
            }}
          >
            <Pencil className="h-5 w-5 text-gray-400" />
          </Button> */}
        {/* </div> */}
      </section>
      <div className="pt-0">
        <div className="border-t border-gray-200 my-4"></div>
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-500">Контакты</div>
          <AvatarGroup className="grayscale">
            {contacts.length > 0 ? (
              contacts.slice(0, 3).map((contact) => (
                <Avatar key={contact.id} size='lg'>
                  {/* <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  /> */}
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
              ))
            ) : (
              <p className="text-sm text-gray-500">Нет контактов</p>
            )}
            {contacts.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="my-auto w-full text-center text-foreground/50 mt-4"
                onClick={() => router.push(`/contacts/${company.id}`)}
              >
                Посмотреть все
                <ChevronRight className="size-4" />
              </Button>
            )}
            {contacts.length > 3 && (
              <AvatarGroupCount>{contacts.length - 3}</AvatarGroupCount>
            )}
          </AvatarGroup>
        </div>
      </div>
    </div>
  );
}
