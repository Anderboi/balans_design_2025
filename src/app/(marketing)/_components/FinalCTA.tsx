'use client';

import Link from 'next/link';
import { useReveal } from './animations';

export default function FinalCTA() {
  useReveal();

  return (
    <section className="relative noise hero-dark py-28 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.07),transparent_60%)]" />
      <div className="relative z-10 max-w-2xl mx-auto reveal">
        <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-base text-white/35 mb-8">
          <span className="spark text-[#f59e0b]">✦</span>
          14 дней Pro бесплатно
        </div>
        <h2 className="font-display text-[60px]/20 md:text-[72px]/20 font-semibold text-white mb-6 tracking-tight">
          Начните работать
          <br />
          <em className="text-[#d64218]">по-новому</em>
        </h2>
        <p className="text-lg sm:text-xl text-white/50 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Присоединяйтесь к дизайнерам, которые уже упростили свою работу.
          Начните бесплатно сегодня.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto text-center text-base font-semibold text-[#0a0a0a] bg-white hover:bg-zinc-50 px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Создать аккаунт бесплатно →
          </Link>
          <Link
            href="/materials"
            className="w-full sm:w-auto text-center text-base font-medium text-white/45 border border-white/12 hover:border-white/25 hover:text-white/70 px-8 py-4 rounded-xl transition-all"
          >
            Витрина материалов
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/20">
          Без карты · Бесплатный тариф навсегда
        </p>
      </div>
    </section>
  );
}
