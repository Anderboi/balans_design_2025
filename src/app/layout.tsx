import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalErrorBoundary from "@/components/global-error-boundary";
import { Toaster } from "@/components/ui/sonner";

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
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
