import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GlobalErrorBoundary from "@/components/global-error-boundary";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: { default: "Balans Design", template: "%s | Balans" },
  description: "Приложение для управления проектами для дизайнера интерьера",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Balans App",
  },
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
