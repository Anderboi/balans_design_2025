import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

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
        <div className="flex h-screen">
          <SidebarProvider>
            <AppSidebar/>
            {/* <Sidebar /> */}
            <SidebarTrigger />
            <main className="flex-1 overflow-auto py-6 pr-6">{children}</main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
