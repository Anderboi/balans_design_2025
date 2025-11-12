import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import GlobalErrorBoundary from '@/components/global-error-boundary';

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
          <div className="flex h-screen">
            <SidebarProvider>
              <AppSidebar/>
              {/* <Sidebar /> */}
              <SidebarTrigger  className='hidden md:flex'/>
              <main className="flex-1 overflow-auto p-4  md:py-6 md:pl-0 md:pr-6">{children}</main>
            </SidebarProvider>
          </div>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
