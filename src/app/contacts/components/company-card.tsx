"use client";

import { Company, Contact } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CompanyType } from "@/types";
import { useEffect, useState } from "react";
import { contactsService } from "@/lib/services/contacts";


interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const companyContacts = await contactsService.getContactsByCompany(
        company.id
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
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-2xl justify-between border p-6"
    >
      <section>
        {/* <div className="flex items-start justify-between"> */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg bg-sky-600 text-white flex items-center justify-center">
            <AvatarFallback className="bg-transparent text-2xl font-bold">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 ">
            <div className="text-xl font-bold leading-6 line-clamp-2">
              {company.name}
            </div>
            {/* <p className="text-base text-gray-500">
                {company.address || "Москва"}
              </p> */}
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
          {contacts.length > 0 ? (
            contacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.position}</p>
                </div>
              </div>
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
