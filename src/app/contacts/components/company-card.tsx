"use client";

import { Company } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight } from 'lucide-react';

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
      className="cursor-pointer pb-1 hover:shadow-md transition-shadow min-h-66 min-w-66 justify-between"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{company.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {company.type}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Placeholder for future content */}
      </CardContent>
      
      <CardFooter className='border-t !pt-1 px-0'>
        <Button variant="ghost" size="sm" className="my-auto w-full text-center text-foreground/50">
          Посмотреть все контакты
          <ChevronRight/>
        </Button>
      </CardFooter>
    </Card>
  );
}