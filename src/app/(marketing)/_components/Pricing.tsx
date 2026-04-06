'use client';

import Link from 'next/link';
import { useReveal } from './animations';
import LandingBlockHeader from './LandingBlockHeader';
import { Button } from '@/components/ui/button';

const checkIcon = (
  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const crossIcon = (
  <svg className="w-2.5 h-2.5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Pricing() {
  useReveal();

  return (
    <section className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto">
        <LandingBlockHeader title="Тарифы">
          Просто и<br />
          <em className="text-[#d64218]">прозрачно</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Free */}
          <div className="plan-card p-7 reveal flex flex-col">
            <div className="mb-5">
              <div className="text-xs font-semibold tracking-wider uppercase text-[#71717a] mb-3">
                Бесплатно
              </div>
              <div className="font-display text-[56px] md:text-[64px] text-[#0a0a0a] mb-1">
                0 ₽
              </div>
              <div className="text-base text-[#71717a] font-light">
                навсегда
              </div>
            </div>
            <div className="space-y-3 flex-1 mb-7">
              {[
                "До 3 проектов",
                "Канбан-доска",
                "До 50 материалов",
                "База контактов",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    {checkIcon}
                  </div>
                  <span className="text-base text-[#0a0a0a]">{f}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 opacity-35">
                <div className="w-4 h-4 rounded-full bg-[#e4e4e7] flex items-center justify-center shrink-0">
                  {crossIcon}
                </div>
                <span className="text-base text-[#71717a]">AI-ассистент</span>
              </div>
            </div>
            <Button variant="outline" size="lg" className='cursor-pointer'>
              <Link href="/login">Начать бесплатно</Link>
            </Button>
            
          </div>

          {/* Pro */}
          <div className="plan-card featured p-7 reveal d1 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] font-semibold bg-[#f59e0b] text-white px-2.5 py-1 rounded-full">
              Популярный
            </div>
            <div className="mb-5">
              <div className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-3">
                Pro
              </div>
              <div className="font-display text-[56px] md:text-[64px] text-white mb-1">
                990 ₽
              </div>
              <div className="text-base text-white/40 font-light">в месяц</div>
            </div>
            <div className="space-y-3 flex-1 mb-7">
              {[
                "Неограниченно проектов",
                "Неограниченно материалов",
                "AI-ассистент",
                "Экспорт смет в PDF",
                "Приоритетная поддержка",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white">
                    {checkIcon}
                  </div>
                  <span className="text-base text-white">{f}</span>
                </div>
              ))}
            </div>
            <Button disabled variant="secondary" size="lg" className='cursor-pointer'>
              Попробовать Pro →
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-[#a1a1aa] mt-5 reveal">
          14 дней Pro бесплатно · Без карты при регистрации
        </p>
      </div>
    </section>
  );
}
