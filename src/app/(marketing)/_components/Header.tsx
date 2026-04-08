'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useHeaderScroll } from './animations';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { href: '#features', label: 'Возможности' },
  { href: '#how-it-works', label: 'Как это работает' },
  { href: '#before-after', label: 'До и после' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#testimonials', label: 'Отзывы' },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  useHeaderScroll(headerRef);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      ref={headerRef}
      className="fixed border-b border-transparent top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 md:px-6 transition-all duration-300"
      style={{
        background: "rgba(250, 250, 250, 0.85)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="size-8 bg-[#0a0a0a] rounded-md flex items-center justify-center shrink-0">
          <span className="text-white text-[12px] font-bold">B</span>
        </div>
        <span className="text-lg font-semibold tracking-widest uppercase">
          Balans
        </span>
      </Link>

      {/* Mobile Menu */}
      <div>
        <div className="sm:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon-lg" variant="ghost" aria-label="Open mobile menu">
                <Menu className="size-6"/>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-[#fafafa]/95 backdrop-blur-xl border-l border-[#e4e4e7] rounded-l-2xl p-8"
            >
              <SheetHeader className="text-left mb-8 px-0!">
                <SheetTitle className="text-lg font-semibold tracking-widest uppercase">
                  Balans
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium //text-[#71717a] py-2 border-b border-[#e4e4e7]/50 block"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-8 pt-8 space-y-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-lg text-[#71717a] hover:text-[#0a0a0a] py-2"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-lg font-medium text-white bg-[#0a0a0a] hover:bg-[#161616] px-5 py-3 rounded-xl transition-all shadow-sm"
                  >
                    Начать бесплатно
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:block  text-[#71717a] hover:text-[#0a0a0a] transition-colors px-3 py-1.5 rounded-lg hover:bg-white"
          >
            Войти
          </Link>
          <Link
            href="/login"
            className="hidden sm:block text-base font-medium text-white bg-[#0a0a0a] hover:bg-[#161616] px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
          >
            Начать бесплатно
          </Link>
        </div>
      </div>
    </header>
  );
}
