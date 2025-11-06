"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Company, CompanyType, Contact, ContactType } from "@/types";
import { companiesService } from "@/lib/services/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, X } from "lucide-react";
import { CompanyCard } from "./components/company-card";
import { toast } from "sonner";
import { AddCompanyDialog } from "./components/add-company-dialog";
import PageErrorBoundary from "@/components/page-error-boundary";
import { contactsService } from "@/lib/services/contacts";
import { ContactCard } from "./components/contact-card";

function ContactsPageContent() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [clients, setClients] = useState<Contact[]>([]);

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  const [filteredClients, setFilteredClients] = useState<Contact[]>([]);

  const [filteredAll, setFilteredAll] = useState<(Company | Contact)[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("all");

  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadCompanies();

    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactsService.getContactsByType(ContactType.CLIENT);

      setClients(data);

      setFilteredClients(data);
    } catch (error) {
      console.error("Ошибка при загрузке контактов:", error);

      throw error;
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getCompanies();

      setCompanies(data);

      setFilteredCompanies(data);
    } catch (error) {
      console.error("Ошибка при загрузке компаний:", error);

      throw error;
    }
  };

  useEffect(() => {
    filterData();
  }, [searchQuery, companies, clients]);

  useEffect(() => {
    setFilteredAll([...filteredCompanies, ...filteredClients]);
  }, [filteredCompanies, filteredClients]);

  const filterData = () => {
    const query = searchQuery.toLowerCase();

    const filteredCompanies = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        (company.email && company.email.toLowerCase().includes(query)) ||
        (company.phone && company.phone.toLowerCase().includes(query))
    );

    setFilteredCompanies(filteredCompanies);

    const filteredClients = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        (client.email && client.email.toLowerCase().includes(query)) ||
        (client.phone && client.phone.toLowerCase().includes(query))
    );

    setFilteredClients(filteredClients);
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
            placeholder="Поиск..."
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

          <TabsTrigger value="companies">Компании</TabsTrigger>

          <TabsTrigger value="clients">Клиенты</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAll.map((item) =>
              "company_id" in item ? (
                <ContactCard key={item.id} contact={item} />
              ) : (
                <CompanyCard key={item.id} company={item} />
              )
            )}

            {filteredAll.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Ничего не найдено.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company}></CompanyCard>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Компании не найдены.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <ContactCard key={client.id} contact={client} />
            ))}

            {filteredClients.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Клиенты не найдены.</p>
              </div>
            )}
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
