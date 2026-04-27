import { ContactsPageClient } from "../../../features/contacts/components/contacts-page-client";
import { Metadata } from "next";
import { getCompanies, getContacts } from "@/features/contacts/actions";

export const metadata: Metadata = {
  title: "Контакты | Адресная книга",
  description: "Управление списком клиентов, подрядчиков и компаний.",
};

export default async function ContactsPage() {
  // Параллельная загрузка данных на сервере
  const [companies, clients] = await Promise.all([
    getCompanies(),
    getContacts(),
  ]);

  return (
    <ContactsPageClient initialCompanies={companies} initialClients={clients} />
  );
}
