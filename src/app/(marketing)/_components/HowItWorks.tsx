'use client';

import { useReveal, useProgressBars } from './animations';
import LandingBlockHeader from './LandingBlockHeader';

export default function HowItWorks() {
  useReveal();
  useProgressBars();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <LandingBlockHeader title="Как это работает">
          Три шага до
          <br />
          <em className="text-[#d64218]">порядка</em>
        </LandingBlockHeader>
      </div>

      {/* scrollable steps */}
      <div className="pl-6 md:pl-[calc((100vw-1024px)/2+24px)]">
        <div className="steps-scroll pb-4">
          {/* Step 1 */}
          <div className="step-card reveal bento">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center font-display text-3xl mb-5">
                I
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Создайте <br/>проект
              </h3>
              <p className="text-base text-[#71717a] font-light leading-relaxed mb-6">
                Добавьте название, клиента и бюджет. Разбейте на этапы.
              </p>
            </div>
            <div className="bg-[#fafafa] border-t border-[#e4e4e7] px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span className="text-sm font-medium text-[#0a0a0a]">
                  Новый проект
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-[#e4e4e7] rounded-full flex-1" />
                <div className="h-2 bg-[#e4e4e7] rounded-full w-3/4" />
                <div className="h-2 bg-[#e4e4e7] rounded-full w-1/2" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-card reveal d1 bento">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center font-display text-3xl mb-5">
                II
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Наполните содержимым
              </h3>
              <p className="text-base text-[#71717a] font-light leading-relaxed mb-6">
                Задачи, материалы, контакты подрядчиков и документы.
              </p>
            </div>
            <div className="bg-[#fafafa] border-t border-[#e4e4e7] px-6 py-4">
              <div className="space-y-1.5">
                {[
                  { color: "bg-blue-400", w: "flex-1" },
                  { color: "bg-[#f59e0b]", w: "w-2/3" },
                  { color: "bg-emerald-400", w: "flex-1", opacity: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e4e4e7] ${item.opacity ? "opacity-40" : ""}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <div className={`h-2 bg-[#e4e4e7] rounded ${item.w}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-card reveal d2 bento">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center font-display text-3xl mb-5">
                III
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                Контролируйте результат
              </h3>
              <p className="text-base text-[#71717a] font-light leading-relaxed mb-6">
                Прогресс, бюджет и дедлайны — всё в одном месте.
              </p>
            </div>
            <div className="bg-[#fafafa] border-t border-[#e4e4e7] px-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#71717a]">Прогресс</span>
                  <span className="text-[10px] font-medium text-[#0a0a0a]">
                    72%
                  </span>
                </div>
                <div className="h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
                  <div
                    className="pbar h-full bg-emerald-400 rounded-full"
                    data-w="72"
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-[#71717a]">Бюджет</span>
                  <span className="text-[10px] font-medium text-[#f59e0b]">
                    1.7 / 2.4М
                  </span>
                </div>
                <div className="h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
                  <div
                    className="pbar h-full bg-[#f59e0b] rounded-full"
                    data-w="71"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* spacer */}
          <div className="w-6 shrink-0" />
        </div>
      </div>
    </section>
  );
}
