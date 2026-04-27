
import { getMaterials, getProjects, getSupplierCompanies, getSuppliers } from '@/features/materials/actions';
import { MaterialsPageClient } from '@/features/materials/components/materials-page-client';
import DEMO_MATERIALS from '@/features/materials/constants/demo-data';
import { getUser } from "@/lib/supabase/getuser";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Материалы | База данных",
  description: "Каталог материалов, оборудования и мебели для проектов.",
};

export default async function MaterialsPageContent() {
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
          initialProjects={[]}
          initialSuppliers={[]}
          initialSupplierCompanies={[]}
          isGuest={true}
        />
      </div>
    );
  }

  // Параллельная загрузка данных на сервере
  const [materials, projects, suppliers, supplierCompanies] =
    await Promise.all([
      getMaterials(),
      getProjects(),
      getSuppliers(),
      getSupplierCompanies(),
    ]);

  return (
    <MaterialsPageClient
      initialMaterials={materials}
      initialProjects={projects}
      initialSuppliers={suppliers}
      initialSupplierCompanies={supplierCompanies}
      isGuest={false}
    />
  );
}

