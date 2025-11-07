import { getMaterials, getCategories } from "./actions";
import PageErrorBoundary from "@/components/page-error-boundary";
import { MaterialsPageClient } from "./components/materials-page-client";

async function MaterialsPageContent() {
  // Параллельная загрузка данных на сервере
  const [materials, categories] = await Promise.all([
    getMaterials(),
    getCategories(),
  ]);

  return (
    <MaterialsPageClient
      initialMaterials={materials}
      initialCategories={categories}
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
