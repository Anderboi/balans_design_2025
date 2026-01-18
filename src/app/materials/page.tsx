import { getMaterials, getCategories, getProjects } from "./actions";
import PageErrorBoundary from "@/components/page-error-boundary";
import { MaterialsPageClient } from "./components/materials-page-client";

async function MaterialsPageContent() {
  // Параллельная загрузка данных на сервере
  const [materials, categories, projects] = await Promise.all([
    getMaterials(),
    getCategories(),
    getProjects(),
  ]);

  return (
    <MaterialsPageClient
      initialMaterials={materials}
      initialCategories={categories}
      initialProjects={projects}
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
