'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useCursorGlow, useProgressBars } from './animations';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useCursorGlow(heroRef, glowRef);
  useProgressBars();

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative flex flex-col items-center justify-center pt-14 overflow-hidden bg-white"
    >
      <div className="cursor-glow" ref={glowRef} />

      {/* badge */}
      <div className="relative z-10 mt-10 mb-7 float">
        <div className="inline-flex items-center gap-2 bg-white border border-[#e4e4e7] rounded-full px-4 py-1.5 shadow-sm text-sm text-[#71717a]">
          <span className="spark text-[#f59e0b]">✦</span>
          Создано для дизайнеров интерьера
          <span className="w-px h-3 bg-[#e4e4e7]" />
          <span className="text-emerald-500 font-medium">Бесплатно</span>
        </div>
      </div>

      {/* headline */}
      <h1 className="relative z-10 text-center font-display font-semibold text-[56px] sm:text-[88px] leading-none tracking-[-2px] text-[#0a0a0a] max-w-4xl px-6 mb-6">
        <span className="word mr-4" style={{ animationDelay: '0.05s' }}>Все</span>
        <span className="word" style={{ animationDelay: '0.12s' }}> проекты</span>
        <br />
        <span className="word mr-4 italic text-[#d64218]" style={{ animationDelay: '0.19s' }}>под</span>
        <span className="word italic text-[#d64218]" style={{ animationDelay: '0.26s' }}> контролем</span>
      </h1>

      <p
        className="relative z-10 text-center text-pretty text-lg sm:text-2xl text-[#71717a] font-light max-w-xl px-6 mb-10 leading-relaxed"
        style={{ opacity: 0, animation: 'wordUp 0.6s 0.5s forwards' }}
      >
        Управляйте проектами, бюджетами и материалами в одном месте. Без таблиц, без хаоса.
      </p>

      {/* cta */}
      <div
        className="relative z-10 flex flex-col sm:flex-row gap-4 px-6 mb-4"
        style={{ opacity: 0, animation: 'wordUp 0.6s 0.6s forwards' }}
      >
        <Link
          href="/login"
          className="text-center text-lg font-medium text-white bg-[#0a0a0a] hover:bg-[#161616] px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Начать бесплатно →
        </Link>
        <Link
          href="/materials"
          className="text-center text-lg font-medium text-[#0a0a0a] bg-white border border-[#e4e4e7] hover:border-zinc-400 px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Витрина материалов
        </Link>
      </div>
      <p
        className="relative z-10 text-sm text-[#a1a1aa] mb-10"
        style={{ opacity: 0, animation: 'wordUp 0.5s 0.7s forwards' }}
      >
        Без карты · Готово за 2 минуты
      </p>

      {/* mockup */}
      <div className="mockup-wrap w-full max-w-5xl px-6 relative z-10">
        <div className="mockup-inner relative">
          {/* chrome */}
          <div className="rounded-t-2xl border border-b-0 border-[#e4e4e7] bg-[#f5f5f4] px-4 py-2.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="mx-auto flex items-center gap-1.5 bg-white border border-[#e4e4e7] rounded-md px-3 py-1">
              <svg className="w-3 h-3 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[11px] text-[#a1a1aa]">app.balans.ru/dashboard</span>
            </div>
          </div>

          {/* app body */}
          <div className="border border-t-0 border-[#e4e4e7] rounded-b-2xl overflow-hidden flex" style={{ height: 420 }}>
            {/* sidebar */}
            <div className="w-44 bg-white border-r border-[#e4e4e7] shrink-0 flex-col py-3 px-2.5 hidden md:flex">
              <div className="flex items-center gap-2 px-2 mb-4">
                <div className="w-5 h-5 bg-[#0a0a0a] rounded flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">B</span>
                </div>
                <span className="text-[11px] font-semibold tracking-widest uppercase">Balans</span>
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="landing-nav-item active">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5" />
                  </svg>
                  Дашборд
                </div>
                <div className="landing-nav-item">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Проекты
                </div>
                <div className="landing-nav-item">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Все задачи
                </div>
                <div className="landing-nav-item">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Материалы
                </div>
                <div className="landing-nav-item">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Контакты
                </div>
              </div>
              <div className="border-t border-[#e4e4e7] pt-2.5">
                <div className="bg-[#0a0a0a] text-white rounded-lg px-3 py-2 flex items-center gap-1.5 cursor-pointer">
                  <span className="text-base leading-none">+</span>
                  <span className="text-[11px] font-medium">Новый проект</span>
                </div>
              </div>
            </div>

            {/* main */}
            <div className="flex-1 overflow-hidden bg-[#fafafa] flex flex-col">
              {/* dark banner */}
              <div className="hero-dark noise mx-3 mt-3 rounded-xl p-4 shrink-0">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-white/30">Balans OS Assistant</span>
                </div>
                <p className="text-xl font-semibold text-white mb-3 leading-snug">
                  Доброе утро. У вас <span className="text-white/40">3 задачи</span>
                  <br />в фокусе сегодня.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/6 rounded-lg p-2.5 border border-white/8">
                    <div className="text-[9px] text-white/35 uppercase tracking-wider mb-1">Проекты</div>
                    <div className="text-xl font-semibold text-white">3</div>
                  </div>
                  <div className="bg-white/6 rounded-lg p-2.5 border border-white/8">
                    <div className="text-[9px] text-white/35 uppercase tracking-wider mb-1">Задач</div>
                    <div className="text-xl font-semibold text-white">12</div>
                  </div>
                  <div className="bg-white/6 rounded-lg p-2.5 border border-white/8">
                    <div className="text-[9px] text-white/35 uppercase tracking-wider mb-1">Бюджет</div>
                    <div className="text-xl font-semibold text-white">2.4<span className="text-xs text-white/35"> М₽</span></div>
                  </div>
                </div>
              </div>

              {/* mini cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
                {/* Projects card */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-3">
                  <div className="text-base font-medium text-[#0a0a0a] mb-2">Проекты</div>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Хамовники', pct: 72, color: 'bg-emerald-400' },
                      { name: 'Репино', pct: 41, color: 'bg-blue-400' },
                      { name: 'Патриаршие', pct: 18, color: 'bg-[#f59e0b]' },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <span className="text-[10px] text-[#0a0a0a]">{p.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-[#e4e4e7] rounded-full overflow-hidden">
                            <div className={`pbar h-full ${p.color} rounded-full`} data-w={p.pct} />
                          </div>
                          <span className="text-[9px] text-[#a1a1aa]">{p.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today card */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-3">
                  <div className="text-base font-medium text-[#0a0a0a] mb-2">Сегодня</div>
                  <div className="space-y-1.5">
                    {[
                      { text: 'Согласовать выкрасы', color: 'bg-blue-400' },
                      { text: 'Заказать плитку', color: 'bg-[#f59e0b]' },
                      { text: 'Финальные обмеры', color: 'bg-emerald-400' },
                    ].map((t) => (
                      <div key={t.text} className="kcard flex items-start gap-1.5 p-1.5 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                        <div className={`w-1.5 h-1.5 rounded-full ${t.color} mt-0.5 shrink-0`} />
                        <span className="text-[10px] text-[#0a0a0a] leading-tight">{t.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials card */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-3">
                  <div className="text-base font-medium text-[#0a0a0a] mb-2">Материалы</div>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Loft Grey', price: '4 200 ₽/м²', bg: 'bg-stone-200' },
                      { name: 'Oak Natural', price: '8 900 ₽/м²', bg: 'bg-amber-100' },
                      { name: 'F&B №27', price: '3 100 ₽/л', bg: 'bg-slate-200' },
                    ].map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded ${m.bg} shrink-0`} />
                        <div>
                          <div className="text-[10px] font-medium text-[#0a0a0a]">{m.name}</div>
                          <div className="text-[9px] text-[#a1a1aa]">{m.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* fade overlay */}
          <div className="mockup-fade rounded-b-2xl" />
        </div>
      </div>
    </section>
  );
}
