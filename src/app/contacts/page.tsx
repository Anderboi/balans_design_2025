// app/contacts/page.tsx
import { getCompanies, getClients } from "./actions";
import { ContactsPageClient } from "./components/contacts-page-client";
import PageErrorBoundary from "@/components/page-error-boundary";

async function ContactsPageContent() {
  // Параллельная загрузка данных на сервере
  const [companies, clients] = await Promise.all([
    getCompanies(),
    getClients(),
  ]);

  return (
    <ContactsPageClient initialCompanies={companies} initialClients={clients} />
  );
}

export default function ContactsPage() {
  return (
    <PageErrorBoundary pageName="Страница контактов">
      <ContactsPageContent />
    </PageErrorBoundary>
  );
}
