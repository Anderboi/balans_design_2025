"use client";

import { useRef } from "react";
import {
  useReveal,
  useMiniProgressBars,
  useTypingEffect,
  useChipAnimation,
} from "./animations";
import LandingBlockHeader from "./LandingBlockHeader";

const TYPING_PHRASES = [
  "Согласуй выкрасы в «Репино»",
  "Закажите плитку до среды",
  "Хамовники идут по графику ✓",
];

export default function BeforeAfter() {
  const typingRef = useRef<HTMLParagraphElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);

  useReveal();
  useMiniProgressBars();
  useTypingEffect(typingRef, TYPING_PHRASES);
  useChipAnimation(chipRowRef);

  return (
    <section
      id="before-after"
      className="py-24 px-6 noise hero-dark overflow-hidden relative"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <LandingBlockHeader title="До и после" background="dark">
          Прощайте,
          <br />
          <em className="text-[#d64218]">таблицы и чаты</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE */}
          <div className="reveal rounded-2xl border border-white/15 bg-white/6 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">✕</span>
              </div>
              <span className="text-lg font-medium text-white/50">Раньше</span>
            </div>
            <div className="space-y-2.5">
              {[
                {
                  icon: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </>
                  ),
                  title: "Google Таблицы",
                  desc: "Сметы, контакты, графики в разных файлах",
                  delay: "d1",
                },
                {
                  icon: (
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  ),
                  title: "WhatsApp / Telegram",
                  desc: "Договорённости теряются в переписке",
                  delay: "d2",
                },
                {
                  icon: (
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  ),
                  title: "Заметки и стикеры",
                  desc: "Задачи разбросаны по телефону и блокноту",
                  delay: "d3",
                },
                {
                  icon: (
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  ),
                  title: "Папки с файлами",
                  desc: "Изображения и файлы в разных местах",
                  delay: "d4",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`before-row reveal ${item.delay}`}
                >
                  <div className="bicon">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(248,113,113,0.7)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-medium text-white/65 mb-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-white/30 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div className="reveal d1 rounded-2xl border border-white/15 bg-white/6 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-emerald-500/25 flex items-center justify-center">
                <span className="text-emerald-400 text-xs font-bold">✓</span>
              </div>
              <span className="text-lg font-medium text-white">
                Теперь с Balans
              </span>
            </div>
            <div className="space-y-2.5 relative">
              {/* 1. One workspace */}
              <div className="after-row reveal d1">
                <div className="after-left">
                  <div className="aicon aicon-b">
                    <div className="w-7 h-7 bg-white/15 rounded-sm flex items-center justify-center">
                      <span className="text-white text-[12px] font-bold">
                        B
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-medium leading-tight text-white mb-1">
                      Одно пространство
                    </div>
                    <div className="text-sm text-white/35 leading-tight">
                      Проекты, бюджет, задачи, материалы
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 shrink-0 bg-black/10 w-24 sm:w-[140px] border-l border-white/15">
                  <div className="w-full space-y-2">
                    {[
                      { color: "bg-emerald-400", w: 72 },
                      { color: "bg-blue-400", w: 41 },
                      { color: "bg-amber-400", w: 18 },
                    ].map((bar) => (
                      <div key={bar.w} className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${bar.color} shrink-0`}
                        />
                        <div className="flex-1">
                          <div className="db-bar bg-white/8 overflow-hidden">
                            <div
                              className={`db-bar mpfill ${bar.color}`}
                              data-w={bar.w}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30">
                          {bar.w}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Progress visible */}
              <div className="after-row reveal d2">
                <div className="after-left">
                  <div className="aicon aicon-g">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(74,222,128,.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-medium leading-tight text-white mb-1">
                      Прогресс всегда виден
                    </div>
                    <div className="text-sm text-white/35 leading-tight">
                      Этапы, задачи и бюджет на дашборде
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 shrink-0 bg-black/10 w-24 sm:w-[140px] border-l border-white/15">
                  <div className="w-full space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1 4l2 2 4-3"
                            stroke="rgba(74,222,128,.9)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="mpfill h-full bg-emerald-400 rounded-full"
                          data-w="100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/25 border border-blue-500/35 flex items-center justify-center shrink-0">
                        <span className="text-blue-400 text-[8px] font-bold">
                          2
                        </span>
                      </div>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="mpfill h-full bg-blue-400 rounded-full"
                          data-w="65"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-30">
                      <div className="w-4 h-4 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-white/40 text-[8px]">3</span>
                      </div>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Materials library */}
              <div ref={chipRowRef} className="after-row reveal d3">
                <div className="after-left">
                  <div className="aicon aicon-bl">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(96,165,250,.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-medium leading-tight text-white mb-1">
                      Библиотека материалов
                    </div>
                    <div className="text-sm text-white/35 leading-tight">
                      Добавляйте в проект за один клик
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 justify-center p-2 shrink-0 bg-black/10 w-24 sm:w-[140px] border-l flex-col border-white/15">
                  <div className="chip flex items-center gap-2 bg-white/6 border border-white/10 rounded-lg px-2.5 py-2">
                    <div className="w-4 h-4 rounded bg-stone-400/60 shrink-0" />
                    <span className="text-[11px] text-white/60 font-medium whitespace-nowrap">
                      Loft Grey
                    </span>
                  </div>
                  <div className="chip flex items-center gap-2 bg-white/6 border border-white/10 rounded-lg px-2.5 py-2">
                    <div className="w-4 h-4 rounded bg-amber-300/60 shrink-0" />
                    <span className="text-[11px] text-white/60 font-medium whitespace-nowrap">
                      Oak Natural
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. AI assistant */}
              <div className="after-row reveal d4">
                <div className="after-left">
                  <div className="aicon aicon-a">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(245,158,11,.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-medium leading-tight text-white mb-1">
                      AI-ассистент
                      <span className="hidden //sm:flex spark text-amber-400 text-xs ml-1">
                        ✦
                      </span>
                    </div>
                    <div className="text-sm text-white/35 leading-tight">
                      Подсказывает, что сделать дальше
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 shrink-0 bg-black/10 w-24 sm:w-[140px] border-l border-white/15">
                  <div className="w-full bg-black/20 rounded-lg p-3 border border-white/6">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">
                        Assistant
                      </span>
                    </div>
                    <p
                      ref={typingRef}
                      className="text-[11px] text-white/55 leading-relaxed min-h-[32px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
