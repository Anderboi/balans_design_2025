'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useHeaderScroll } from './animations';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  useHeaderScroll(headerRef);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      ref={headerRef}
      className="fixed  border-b border-transparent top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 md:px-6 transition-all duration-300"
      style={{
        background: "rgba(250, 250, 250, 0.85)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0a0a0a] rounded-md flex items-center justify-center shrink-0">
          <span className="text-white text-[12px] font-bold">B</span>
        </div>
        <span className="text-lg font-semibold tracking-widest uppercase">
          Balans
        </span>
      </div>

      {/* <div className="hidden md:flex items-center gap-1.5 bg-white border border-[#e4e4e7] rounded-lg px-3 py-1.5 w-44 cursor-text">
        <svg className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs text-[#a1a1aa] flex-1">Поиск...</span>
        <span className="text-[10px] text-[#a1a1aa] bg-[#fafafa] border border-[#e4e4e7] rounded px-1.5 py-0.5">⌘K</span>
      </div> */}

      {/* Mobile Menu Toggle */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu />
      </Button>

      {/* Mobile Menu Overlay */}
      

      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden sm:block  text-[#71717a] hover:text-[#0a0a0a] transition-colors px-3 py-1.5 rounded-lg hover:bg-white"
        >
          Войти
        </Link>
        <Link
          href="/login"
          className="text-base font-medium text-white bg-[#0a0a0a] hover:bg-[#161616] px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          Начать бесплатно
        </Link>
      </div>
    </header>
  );
}
