import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import GlobalErrorBoundary from "@/components/global-error-boundary";
import { SidebarLogic } from "@/components/sidebar-logic";
import DashboardHeader from "@/components/dashboard-header";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Balans Design",
  description: "Приложение для управления проектами для дизайнера интерьера",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <div className="flex h-screen no-scrollbar">
            <SidebarProvider>
              <SidebarLogic />
              <AppSidebar />
              <main className="flex-1 overflow-auto flex flex-col bg-[#f5f5f7] no-scrollbar h-screen">
                <DashboardHeader />
                <div className="max-w-7xl w-full mx-auto pb-20 animate-fade-in flex-1 overflow-auto p-4 md:py-6 no-scrollbar">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </div>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
