"use client";

import { useState, useMemo } from "react";
import { Company, Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, X } from "lucide-react";
import { CompanyCard } from "./company-card";
import { toast } from "sonner";
import { AddCompanyDialog } from "./add-company-dialog";
import AddContactDialog from "./add-contact-dialog";
import { ContactCard } from "./contact-card";
import { EditContactDrawer } from "./edit-contact-drawer";
import {
  createCompany,
  createContact,
  getClients,
  getCompanies,
} from "../actions";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";

interface ContactsPageClientProps {
  initialCompanies: Company[];
  initialClients: Contact[];
}

export function ContactsPageClient({
  initialCompanies,
  initialClients,
}: ContactsPageClientProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [clients, setClients] = useState<Contact[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        (company.email && company.email.toLowerCase().includes(query)) ||
        (company.phone && company.phone.toLowerCase().includes(query)),
    );
  }, [companies, searchQuery]);

  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        (client.email && client.email.toLowerCase().includes(query)) ||
        (client.phone && client.phone.toLowerCase().includes(query)),
    );
  }, [clients, searchQuery]);

  const filteredAll = useMemo(() => {
    return [...filteredCompanies, ...filteredClients];
  }, [filteredCompanies, filteredClients]);

  const [activeTab, setActiveTab] = useState("all");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadContacts = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Ошибка при загрузке контактов:", error);
      toast.error("Не удалось загрузить контакты");
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Ошибка при загрузке компаний:", error);
      toast.error("Не удалось загрузить компании");
    }
  };

  const handleAddCompany = async (
    company: Omit<Company, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const result = await createCompany(company);
      if (result.success) {
        toast.success("Компания успешно добавлена");
        await loadCompanies();
        setIsAddCompanyOpen(false);
      } else {
        toast.error(result.error || "Не удалось добавить компанию");
      }
    } catch (error) {
      console.error("Ошибка при добавлении компании:", error);
      toast.error("Не удалось добавить компанию");
    }
  };

  const handleAddContact = async (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const result = await createContact(contact);
      if (result.success) {
        toast.success("Контакт успешно добавлен");
        await loadContacts();
        setIsAddContactOpen(false);
      } else {
        toast.error(result.error || "Не удалось добавить контакт");
      }
    } catch (error) {
      console.error("Ошибка при добавлении контакта:", error);
      toast.error("Не удалось добавить контакт");
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleContactUpdated = () => {
    loadContacts();
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-start">
        <PageHeader
          title="Адресная книга"
          description="Управление контактами"
        />
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={() => setIsAddCompanyOpen(true)}>
            <PlusCircle className="mr-2 size-4" />
            Добавить компанию
          </Button> */}
          <Button onClick={() => setIsAddContactOpen(true)}>
            <PlusCircle className="mr-2 size-4" />
            Добавить контакт
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between bg-background p-2 rounded-2xl shadow-lg shadow-zinc-300/50">
          <div className="relative w-full //md:w-96 group">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск..."
            className="pl-8 w-full"
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
              <X className="size-4" />
            </Button>
          )}
          </div>
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
                <ContactCard
                  key={item.id}
                  contact={item}
                  onClick={() => handleContactClick(item)}
                />
              ) : (
                <CompanyCard key={item.id} company={item} />
              ),
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
              <CompanyCard key={company.id} company={company} />
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
              <ContactCard
                key={client.id}
                contact={client}
                onClick={() => handleContactClick(client)}
              />
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

      <AddContactDialog
        isOpen={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onSubmit={handleAddContact}
      />

      <EditContactDrawer
        contact={selectedContact}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onContactUpdated={handleContactUpdated}
      />
    </PageContainer>
  );
}
