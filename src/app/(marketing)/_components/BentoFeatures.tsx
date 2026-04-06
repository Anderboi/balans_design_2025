'use client';

import { useReveal, useProgressBars } from './animations';
import LandingBlockHeader from './LandingBlockHeader';

export default function BentoFeatures() {
  useReveal();
  useProgressBars();

  return (
    <section className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto">
        <LandingBlockHeader
          title="Возможности"
        >
            Всё, что нужно<br/><em className="text-[#d64218]">дизайнеру</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 01 — STAGES */}
          <div className="bento p-6 reveal d2 flex flex-col">
            <div className="fnum font-display">01</div>
            <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Этапы проекта</h3>
            <p className="text-lg sm:text-base text-[#71717a] font-light mb-6 leading-relaxed">
              Разбивайте работу на этапы — отслеживайте каждый.
            </p>
            <div className="space-y-2.5 mt-auto">
              {/* Stage 1 - complete */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#0a0a0a]">Замеры и ТЗ</span>
                    <span className="text-xs text-emerald-500">100%</span>
                  </div>
                  <div className="h-1 bg-[#e4e4e7] rounded-full overflow-hidden">
                    <div className="pbar h-full bg-emerald-400 rounded-full" data-w="100" />
                  </div>
                </div>
              </div>
              {/* Stage 2 - in progress */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[12px] font-bold">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#0a0a0a]">Концепция</span>
                    <span className="text-xs text-blue-500">65%</span>
                  </div>
                  <div className="h-1 bg-[#e4e4e7] rounded-full overflow-hidden">
                    <div className="pbar h-full bg-blue-400 rounded-full" data-w="65" />
                  </div>
                </div>
              </div>
              {/* Stage 3 - locked */}
              <div className="flex items-center gap-2.5 opacity-40">
                <div className="w-6 h-6 rounded-full bg-[#e4e4e7] flex items-center justify-center shrink-0">
                  <span className="text-[#71717a] text-[12px] font-bold">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#0a0a0a]">Документация</span>
                    <span className="text-xs text-[#71717a]">—</span>
                  </div>
                  <div className="h-1 bg-[#e4e4e7] rounded-full" />
                </div>
              </div>
              {/* Stage 4 - locked */}
              <div className="flex items-center gap-2.5 opacity-40">
                <div className="w-6 h-6 rounded-full bg-[#e4e4e7] flex items-center justify-center shrink-0">
                  <span className="text-[#71717a] text-[12px] font-bold">4</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#0a0a0a]">Авторский надзор</span>
                    <span className="text-xs text-[#71717a]">—</span>
                  </div>
                  <div className="h-1 bg-[#e4e4e7] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 02 — KANBAN */}
          <div className="bento p-6 md:col-span-2 reveal">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="fnum font-display">02</div>
                <h3 className="text-xl font-semibold text-[#0a0a0a] ">Канбан-доска задач</h3>
                <p className="text-lg sm:text-base text-[#71717a] font-light mt-1 max-w-md leading-relaxed">
                  Перетаскивайте задачи между статусами. Прогресс обновляется автоматически.
                </p>
              </div>
              <span className="text-[10px] font-medium text-[#f59e0b] bg-[#fef3c7] px-2.5 py-1 rounded-full shrink-0">
                Популярное
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-[#fafafa] rounded-xl p-3 border border-[#e4e4e7]">
              {/* In Progress */}
              <div>
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 px-1">В работе</div>
                <div className="space-y-1.5">
                  {[
                    { task: 'Согласовать планировку', project: 'Хамовники' },
                    { task: 'Подобрать светильники', project: 'Репино' },
                  ].map((item) => (
                    <div key={item.task} className="kcard bg-white border border-[#e4e4e7] rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-1.5" />
                      <div className="text-[11px] font-medium text-[#0a0a0a] leading-tight">{item.task}</div>
                      <div className="text-[10px] text-[#a1a1aa] mt-1">{item.project}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Review */}
              <div>
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 px-1">На проверке</div>
                <div className="space-y-1.5">
                  <div className="kcard bg-white border border-[#e4e4e7] rounded-lg p-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mb-1.5" />
                    <div className="text-[11px] font-medium text-[#0a0a0a] leading-tight">Смета на кухню</div>
                    <div className="text-[10px] text-[#a1a1aa] mt-1">Патриаршие</div>
                  </div>
                </div>
              </div>
              {/* Done */}
              <div>
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 px-1">Готово</div>
                <div className="space-y-1.5">
                  {['Финальные обмеры', 'ТЗ от клиента'].map((t) => (
                    <div key={t} className="kcard bg-white border border-[#e4e4e7] rounded-lg p-2.5 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-1.5" />
                      <div className="text-[11px] font-medium text-[#0a0a0a] line-through leading-tight">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 03 — BUDGET */}
          <div className="bento p-6 reveal d1 flex flex-col">
            <div className="fnum font-display">03</div>
            <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Контроль бюджета</h3>
            <p className="text-lg sm:text-base text-[#71717a] font-light mb-6 leading-relaxed">
              Смета, расходы и остаток — в реальном времени.
            </p>
            <div className="mt-auto bg-[#0a0a0a] rounded-xl p-4 space-y-3">
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Хамовники · Бюджет</div>
                <div className="text-2xl font-semibold text-white">2.4М <span className="text-sm font-normal text-white/30">₽</span></div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-white/50">Потрачено</span>
                    <span className="text-[12px] text-emerald-400 font-medium">1.1М ₽</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="pbar h-full bg-emerald-400 rounded-full" data-w="46" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-white/50">В работе</span>
                    <span className="text-[12px] text-[#f59e0b] font-medium">0.6М ₽</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="pbar h-full bg-[#f59e0b] rounded-full" data-w="25" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 04 — MATERIALS */}
          <div className="bento p-6 reveal flex flex-col">
            <div className="fnum font-display">04</div>
            <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Библиотека материалов</h3>
            <p className="text-lg sm:text-base text-[#71717a] font-light mb-6 leading-relaxed">
              Артикулы, цены, поставщики — собираете один раз.
            </p>
            <div className="space-y-2 mt-auto">
              {[
                { name: 'Керамогранит Loft Grey', price: '4 200 ₽/м²', bg: 'bg-stone-200' },
                { name: 'Паркет Oak Natural', price: '8 900 ₽/м²', bg: 'bg-amber-100' },
                { name: 'Краска Farrow & Ball', price: '3 100 ₽/л', bg: 'bg-slate-200' },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7] hover:border-zinc-300 transition-colors cursor-pointer group">
                  <div className={`w-9 h-9 rounded-lg ${m.bg} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0a0a0a] truncate">{m.name}</div>
                    <div className="text-[12px] text-[#a1a1aa]">{m.price}</div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* 05 — CONTACTS */}
          <div className="bento p-6 reveal d1 flex flex-col">
            <div className="fnum font-display">05</div>
            <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">База контактов</h3>
            <p className="text-lg sm:text-base text-[#71717a] font-light mb-6 leading-relaxed">
              Подрядчики и поставщики всегда под рукой.
            </p>
            <div className="space-y-2 mt-auto">
              {[
                { initials: 'АИ', name: 'Алексей Иванов', role: 'Электрик · Партнёр', bg: 'bg-violet-100', text: 'text-violet-600' },
                { initials: 'КС', name: 'Компания «Стройдом»', role: 'Поставщик · Плитка', bg: 'bg-emerald-100', text: 'text-emerald-600' },
                { initials: 'МГ', name: 'Мария Громова', role: 'Клиент · Хамовники', bg: 'bg-pink-100', text: 'text-pink-600' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2.5 p-2.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center ${c.text} text-[12px] font-semibold shrink-0`}>
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0a0a0a]">{c.name}</div>
                    <div className="text-[12px] text-[#a1a1aa]">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
