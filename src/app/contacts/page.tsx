import { contactsService } from "@/lib/services/contacts";
import { ContactsPageClient } from "./components/contacts-page-client";
import { companiesService } from "@/lib/services/companies";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function ContactsPage() {
  const supabase = await createClient();

  // Параллельная загрузка данных на сервере
  const [companies, clients] = await Promise.all([
    companiesService.getCompanies(supabase),
    contactsService.getContacts(supabase),
  ]);

  return (
    <ContactsPageClient initialCompanies={companies} initialClients={clients} />
  );
}
