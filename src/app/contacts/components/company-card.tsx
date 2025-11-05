"use client";

import { Company } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CompanyType } from "@/types";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCardClick = () => {
    router.push(`/contacts/${company.id}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-2xl min-h-66 min-w-66 justify-between"
      onClick={handleCardClick}
    >
      <CardHeader >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-lg bg-black text-white flex items-center justify-center">
              <AvatarFallback className="bg-transparent text-2xl font-bold">
                {getInitials(company.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">
                {company.name}
              </CardTitle>
              <CardDescription className="text-base text-gray-500">
                {company.address || "Москва"}
              </CardDescription>
              <p className="text-sm text-gray-400 mt-1">
                {company.type === CompanyType.SUPPLIER ? "Поставщик" : "Клиент"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <Pencil className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
        
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-t border-gray-200 my-4"></div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Контакты: загружаются на странице компании
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t !pt-1 px-0">
        <Button
          variant="ghost"
          size="sm"
          className="my-auto w-full text-center text-foreground/50"
        >
          Посмотреть все контакты
          <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
