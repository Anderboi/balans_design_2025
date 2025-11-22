import { contactsService } from '@/lib/services/contacts';
import { ContactsPageClient } from "./components/contacts-page-client";
import { companiesService } from '@/lib/services/companies';

export default async function ContactsPage() {
  // Параллельная загрузка данных на сервере
  const [companies, clients] = await Promise.all([
    companiesService.getCompanies(),
    contactsService.getContacts(),
  ]);

  return (
    <ContactsPageClient initialCompanies={companies} initialClients={clients} />
  );
}


