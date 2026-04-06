'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useStickyCTA } from './animations';

interface StickyCTAProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

export default function StickyCTA({ heroRef }: StickyCTAProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const dismiss = useStickyCTA(heroRef, stickyRef);

  return (
    <div
      ref={stickyRef}
      className="landing-sticky-cta fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="flex justify-center pb-5 px-4">
        <div className="pointer-events-auto flex items-center gap-3 bg-[#0a0a0a]/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.3)] border border-white/8">
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0">
              <span className="text-[#0a0a0a] text-[11px] font-bold">B</span>
            </div>
            <span className="text-base font-semibold tracking-widest uppercase text-white/70">Balans</span>
            <span className="w-px h-4 bg-white/15 ml-1" />
          </div>
          <span className="text-base text-white/50 font-light hidden md:block">
            Управляйте проектами без хаоса
          </span>
          <Link
            href="/login"
            className="text-base font-medium text-[#0a0a0a] bg-white hover:bg-zinc-50 px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg whitespace-nowrap"
          >
            Начать бесплатно →
          </Link>
          <button
            onClick={dismiss}
            className="text-white/30 hover:text-white/60 transition-colors ml-1 p-1"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
