'use client';

import { useReveal, useProgressBars } from './animations';
import BentoCard from './bento-card';
import LandingBlockHeader from './LandingBlockHeader';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface Stage {
  id: number;
  label: string;
  progress: number | null;
  status: 'complete' | 'in-progress' | 'locked';
}

// interface KanbanTask {
//   id: string;
//   task: string;
//   project?: string;
//   status: 'todo' | 'preview' | 'done';
// }

interface Material {
  name: string;
  price: string;
  bg: string;
}

interface Contact {
  initials: string;
  name: string;
  role: string;
  bg: string;
  text: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const STAGES_DATA: Stage[] = [
  { id: 1, label: 'Замеры и ТЗ', progress: 100, status: 'complete' },
  { id: 2, label: 'Концепция', progress: 65, status: 'in-progress' },
  { id: 3, label: 'Документация', progress: null, status: 'locked' },
  { id: 4, label: 'Авторский надзор', progress: null, status: 'locked' },
];

const KANBAN_DATA = {
  inProgress: [
    { task: 'Согласовать планировку', project: 'Хамовники' },
    { task: 'Подобрать светильники', project: 'Репино' },
  ],
  review: [
    { task: 'Смета на кухню', project: 'Патриаршие' },
  ],
  done: [
    'Финальные обмеры',
    'ТЗ от клиента',
  ],
};

const MATERIALS_DATA: Material[] = [
  { name: 'Керамогранит Loft Grey', price: '4 200 ₽/м²', bg: 'bg-stone-200' },
  { name: 'Паркет Oak Natural', price: '8 900 ₽/м²', bg: 'bg-amber-100' },
  { name: 'Краска Farrow & Ball', price: '3 100 ₽/л', bg: 'bg-slate-200' },
];

const CONTACTS_DATA: Contact[] = [
  { initials: 'АИ', name: 'Алексей Иванов', role: 'Электрик · Партнёр', bg: 'bg-violet-100', text: 'text-violet-600' },
  { initials: 'КС', name: 'Компания «Стройдом»', role: 'Поставщик · Плитка', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { initials: 'МГ', name: 'Мария Громова', role: 'Клиент · Хамовники', bg: 'bg-pink-100', text: 'text-pink-600' },
];

/* -------------------------------------------------------------------------- */
/*                               Sub-components                               */
/* -------------------------------------------------------------------------- */

const ProgressBar = ({ label, progress, status, colorClass }: { label: string; progress: number | null; status: Stage['status']; colorClass: string }) => (
  <div className={cn("flex items-center gap-2.5", status === 'locked' && "opacity-40")}>
    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", status === 'complete' ? "bg-emerald-500" : (status === 'in-progress' ? "bg-blue-500" : "bg-[#e4e4e7]"))}>
      {status === 'complete' ? (
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      ) : (
        <span className={cn("text-[12px] font-bold", status === 'locked' ? "text-[#71717a]" : "text-white")}>
          {STAGES_DATA.find(s => s.label === label)?.id}
        </span>
      )}
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-[#0a0a0a]">{label}</span>
        <span className={cn("text-xs", status === 'complete' ? "text-emerald-500" : (status === 'in-progress' ? "text-blue-500" : "text-[#71717a]"))}>
          {progress ? `${progress}%` : '—'}
        </span>
      </div>
      <div className="h-1 bg-[#e4e4e7] rounded-full overflow-hidden">
        {progress !== null && (
          <div className={cn("pbar h-full rounded-full transition-all duration-1000", colorClass)} data-w={progress} />
        )}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export default function BentoFeatures() {
  useReveal();
  useProgressBars();

  return (
    <section id="features" className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto">
        <LandingBlockHeader title="Возможности">
          Всё, что нужно<br/><em className="text-[#d64218]">дизайнеру</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 01 — STAGES */}
          <BentoCard
            id="stages"
            num="01"
            title="Этапы проекта"
            description="Разбивайте работу на этапы — отслеживайте каждый."
            revealDelay="d2"
          >
            <div className="space-y-2.5">
              {STAGES_DATA.map((stage) => (
                <ProgressBar
                  key={stage.id}
                  label={stage.label}
                  progress={stage.progress}
                  status={stage.status}
                  colorClass={stage.status === 'complete' ? "bg-emerald-400" : "bg-blue-400"}
                />
              ))}
            </div>
          </BentoCard>

          {/* 02 — KANBAN */}
          <BentoCard
            id="kanban"
            num="02"
            title="Канбан-доска задач"
            description="Перетаскивайте задачи между статусами. Прогресс обновляется автоматически."
            className="md:col-span-2"
            badge="Популярное"
          >
            <div className="grid grid-cols-3 gap-2 bg-[#fafafa] rounded-xl p-3 border border-[#e4e4e7]">
              {/* In Progress */}
              <div>
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 px-1">В работе</div>
                <div className="space-y-1.5">
                  {KANBAN_DATA.inProgress.map((item) => (
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
                  {KANBAN_DATA.review.map((item) => (
                    <div key={item.task} className="kcard bg-white border border-[#e4e4e7] rounded-lg p-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mb-1.5" />
                      <div className="text-[11px] font-medium text-[#0a0a0a] leading-tight">{item.task}</div>
                      <div className="text-[10px] text-[#a1a1aa] mt-1">{item.project}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Done */}
              <div>
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 px-1">Готово</div>
                <div className="space-y-1.5">
                  {KANBAN_DATA.done.map((t) => (
                    <div key={t} className="kcard bg-white border border-[#e4e4e7] rounded-lg p-2.5 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-1.5" />
                      <div className="text-[11px] font-medium text-[#0a0a0a] line-through leading-tight">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 03 — BUDGET */}
          <BentoCard
            id="budget"
            num="03"
            title="Контроль бюджета"
            description="Смета, расходы и остаток — в реальном времени."
            revealDelay="d1"
          >
            <div className="bg-[#0a0a0a] rounded-xl p-4 space-y-3">
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
          </BentoCard>

          {/* 04 — MATERIALS */}
          <BentoCard
            id="materials"
            num="04"
            title="Библиотека материалов"
            description="Артикулы, цены, поставщики — собираете один раз."
          >
            <div className="space-y-2">
              {MATERIALS_DATA.map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7] hover:border-zinc-300 transition-colors cursor-pointer group">
                  <div className={cn("w-9 h-9 rounded-lg shrink-0", m.bg)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0a0a0a] truncate">{m.name}</div>
                    <div className="text-[12px] text-[#a1a1aa]">{m.price}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
            </div>
          </BentoCard>

          {/* 05 — CONTACTS */}
          <BentoCard
            id="contacts"
            num="05"
            title="База контактов"
            description="Подрядчики и поставщики всегда под рукой."
            revealDelay="d1"
          >
            <div className="space-y-2">
              {CONTACTS_DATA.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5 p-2.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0", c.bg, c.text)}>
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0a0a0a]">{c.name}</div>
                    <div className="text-[12px] text-[#a1a1aa]">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
