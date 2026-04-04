import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarLogic } from "@/components/sidebar-logic";
import DashboardHeader from "@/components/dashboard-header";
import { getUser } from "@/lib/supabase/getuser";

export default async function MaterialsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    // Гостевой режим (Витрина материалов): без боковой панели
    return (
      <div className="flex h-[100dvh] flex-col bg-white">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA]">
          <div className="font-semibold text-lg tracking-tight text-[#1D1D1F]">
            Balans <span className="font-normal text-[#86868B]">Materials</span>
          </div>
          <a
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors"
          >
            Войти / Регистрация
          </a>
        </header>
        <main className="flex-1 overflow-auto p-4 md:py-6 relative">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    );
  }

  // Режим авторизованного пользователя
  return (
    <div className="flex h-[100dvh] no-scrollbar">
      <SidebarProvider>
        <SidebarLogic />
        <AppSidebar />
        <main className="flex-1 overflow-auto flex flex-col bg-[#f5f5f7] no-scrollbar h-full">
          <DashboardHeader />
          <div className="max-w-7xl w-full mx-auto pb-20 animate-fade-in flex-1 overflow-auto p-4 md:py-6 no-scrollbar">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
