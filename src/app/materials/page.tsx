import {
  getMaterials,
  getCategories,
  getProjects,
  getSuppliers,
  getSupplierCompanies,
} from "./actions";
import PageErrorBoundary from "@/components/page-error-boundary";
import { MaterialsPageClient } from "./components/materials-page-client";
import { getUser } from "@/lib/supabase/getuser";
import { Material } from "@/types";

export const revalidate = 0;

// Demo Materials for unauthenticated users
const DEMO_MATERIALS: Material[] = [
  {
    id: "demo-1",
    name: "Итальянский керамогранит",
    category_id: "demo-cat",
    supplier_id: null,
    cost: 4500,
    price: 5200,
    unit: "кв.м.",
    article: "IT-KER-01",
    url: "https://example.com/material-1",
    notes: "Отличный выбор для ванной комнаты.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo"
  },
  {
    id: "demo-2",
    name: "Краска Benjamin Moore",
    category_id: "demo-cat",
    supplier_id: null,
    cost: 15000,
    price: 18000,
    unit: "шт",
    article: "BM-Aura-Matte",
    url: "https://example.com/material-2",
    notes: "Цвет: Сashmere 27, матовая.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo"
  },
  {
    id: "demo-3",
    name: "Светильник подвесной Flos",
    category_id: "demo-cat",
    supplier_id: null,
    cost: 32000,
    price: 45000,
    unit: "шт",
    article: "FLOS-IC-S1",
    url: "https://example.com/material-3",
    notes: "Латунь. Идеально над обеденным столом.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo"
  },
  {
    id: "demo-4",
    name: "Инженерная доска Finex",
    category_id: "demo-cat",
    supplier_id: null,
    cost: 7500,
    price: 9000,
    unit: "кв.м.",
    article: "FX-OAK-NAT",
    url: "https://example.com/material-4",
    notes: "Дуб натуральный, селект.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo"
  }
];

async function MaterialsPageContent() {
  const user = await getUser();

  if (!user) {
    // Rendring demo showcase for unauthenticated users
    return (
      <div className="space-y-4">
        <div className="p-4 bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] shadow-sm rounded-2xl flex items-center justify-between mb-4 mt-2 max-w-7xl mx-auto">
          <p className="text-sm font-medium">✨ Это демо-витрина. Зарегистрируйтесь, чтобы создать свою базу материалов и добавлять их в проекты.</p>
        </div>
        <MaterialsPageClient
          initialMaterials={DEMO_MATERIALS}
          initialCategories={[{ id: "demo-cat", name: "Демо Категория", user_id: "demo", created_at: "", updated_at: "" }]}
          initialProjects={[]}
          initialSuppliers={[]}
          initialSupplierCompanies={[]}
          isGuest={true}
        />
      </div>
    );
  }

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
      isGuest={false}
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
