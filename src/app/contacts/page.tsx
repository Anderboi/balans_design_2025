// app/contacts/page.tsx
import { contactsService } from '@/lib/services/contacts';
// import { getCompanies, getClients } from "./actions";
import { ContactsPageClient } from "./components/contacts-page-client";
import { companiesService } from '@/lib/services/companies';

export default async function ContactsPage() {
  // Параллельная загрузка данных на сервере
  const [companies, clients] = await Promise.all([
    companiesService.getCompanies(),
    contactsService.getContacts(),
    // getCompanies(),
    // getClients(),
  ]);

  return (
    <ContactsPageClient initialCompanies={companies} initialClients={clients} />
  );
}


