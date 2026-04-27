import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarLogic } from "@/components/sidebar-logic";
import DashboardHeader from "@/components/dashboard-header";
import { getUser } from "@/lib/supabase/getuser";
import Link from "next/link";

export default async function MaterialsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    // Гостевой режим (Витрина материалов): без боковой панели
    return (
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="font-semibold text-lg tracking-tight text-foreground">
            Balans <span className="font-normal text-[#86868B]">Materials</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-[#E5E5EA] transition-colors"
          >
            Войти / Регистрация
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:py-6 w-full relative">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Режим авторизованного пользователя
  return (
    <div className="flex h-dvh overflow-hidden no-scrollbar">
      <SidebarProvider>
        <SidebarLogic />
        <AppSidebar />
        <main className="flex-1 overflow-hidden flex flex-col bg-secondary no-scrollbar h-full">
          <DashboardHeader />
          <div className="max-w-7xl w-full mx-auto pb-20 animate-in fade-in-50 flex-1 overflow-y-auto p-4 md:py-6 no-scrollbar">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
