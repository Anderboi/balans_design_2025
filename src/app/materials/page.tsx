import {
  getMaterials,
  getCategories,
  getProjects,
  getSuppliers,
  getSupplierCompanies,
} from "./actions";
import PageErrorBoundary from "@/components/page-error-boundary";
import { MaterialsPageClient } from "./components/materials-page-client";

async function MaterialsPageContent() {
  // Параллельная загрузка данных на сервере
  const [materials, categories, projects, suppliers, supplierCompanies] =
    await Promise.all([
      getMaterials(),
      getCategories(),
      getProjects(),
      getSuppliers(),
      getSupplierCompanies(),
    ]);

  return (
    <MaterialsPageClient
      initialMaterials={materials}
      initialCategories={categories}
      initialProjects={projects}
      initialSuppliers={suppliers}
      initialSupplierCompanies={supplierCompanies}
    />
  );
}

export default function MaterialsPage() {
  return (
    <PageErrorBoundary pageName="страница материалов">
      <MaterialsPageContent />
    </PageErrorBoundary>
  );
}
