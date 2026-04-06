import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond} from "next/font/google";
import "./landing.css";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist",
});

const instrumentSerif = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Balans — Управление дизайн-проектами",
  description:
    "Управляйте проектами, бюджетами и материалами в одном месте. Создано специально для дизайнеров интерьера.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geist.variable} ${instrumentSerif.variable} font-sans antialiased`}
      style={{
        fontFamily: "var(--font-geist), sans-serif",
      }}
    >
      <style>{`
        .font-display { font-family: var(--font-display), serif; }
      `}</style>
      {children}
    </div>
  );
}
