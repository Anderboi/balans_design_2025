import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarLogic } from "@/components/sidebar-logic";
import DashboardHeader from "@/components/dashboard-header";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh no-scrollbar">
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
