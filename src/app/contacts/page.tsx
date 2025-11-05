"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Company, CompanyType } from "@/types";
import { companiesService } from "@/lib/services/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, X } from "lucide-react";
import { CompanyCard } from "./components/company-card";
import { toast } from "sonner";
import { AddCompanyDialog } from './components/add-company-dialog';
import PageErrorBoundary from "@/components/page-error-boundary";


function ContactsPageContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error("Ошибка при загрузке компаний:", error);
      // Не показываем тост, так как ошибка будет обработана error boundary
      // toast.error("Не удалось загрузить компании");
      throw error; // Бросаем ошибку для обработки error boundary
    }
 };

  useEffect(() => {
    filterCompanies();
  }, [searchQuery, activeTab, companies]);

  const filterCompanies = () => {
    let filtered = [...companies];

    // Фильтрация по типу
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (company) => company.type === (activeTab as CompanyType)
      );
    }

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          (company.email && company.email.toLowerCase().includes(query)) ||
          (company.phone && company.phone.toLowerCase().includes(query))
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleAddCompany = async (
    company: Omit<Company, "id" | "created_at" | "updated_at">
  ) => {
    try {
      await companiesService.createCompany(company);
      toast.success("Компания успешно добавлена");
      loadCompanies();
      setIsAddCompanyOpen(false);
    } catch (error) {
      console.error("Ошибка при добавлении компании:", error);
      toast.error("Не удалось добавить компанию");
      // Оставляем тост, так как это действие пользователя, а не загрузка данных
    }
  };

  const handleCompanyClick = (id: string) => {
    router.push(`/contacts/${id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (type: CompanyType) => {
    switch (type) {
      case CompanyType.CLIENT:
        return "bg-blue-500";
      case CompanyType.SUPPLIER:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Адресная книга</h1>
        <Button onClick={() => setIsAddCompanyOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить новый
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск компаний..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value={CompanyType.CLIENT}>Клиенты</TabsTrigger>
          <TabsTrigger value={CompanyType.SUPPLIER}>Поставщики</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard company={company}></CompanyCard>
            ))}
            {filteredCompanies.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">
                  Компании не найдены. Попробуйте изменить параметры поиска или добавьте новую компанию.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value={CompanyType.CLIENT} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">
                  Клиенты не найдены. Попробуйте изменить параметры поиска или добавьте нового клиента.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value={CompanyType.SUPPLIER} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddCompanyDialog
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
        onAddCompany={handleAddCompany}
      />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <PageErrorBoundary pageName="Страница контактов">
      <ContactsPageContent />
    </PageErrorBoundary>
  );
}
