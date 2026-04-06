import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GlobalErrorBoundary from "@/components/global-error-boundary";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["cyrillic"] });

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
      <body className={geist.className}>
        <GlobalErrorBoundary>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
