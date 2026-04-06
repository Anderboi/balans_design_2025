'use client';

import { useReveal } from './animations';
import LandingBlockHeader from './LandingBlockHeader';

export default function Testimonials() {
  useReveal();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <LandingBlockHeader title="Отзывы">
          Говорят<br /><em className="text-[#d64218]">дизайнеры</em>
        </LandingBlockHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bento p-6 reveal">
            <div className="text-[#f59e0b] mb-3">★★★★★</div>
            <p className="text-base text-pretty sm:text-lg text-[#0a0a0a] leading-relaxed mb-5 font-light">
              Раньше вела всё в таблицах и постоянно теряла что-то важное.
              Теперь открываю Balans и вижу полную картину по каждому проекту.
              Совершенно другой уровень спокойствия.
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-[#e4e4e7]">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                АК
              </div>
              <div>
                <div className="text-base font-medium text-[#0a0a0a]">Анна Комарова</div>
                <div className="text-sm text-[#71717a]">Студия интерьера, Москва</div>
              </div>
            </div>
          </div>

          <div className="bento p-6 reveal d1">
            <div className="text-[#f59e0b] mb-3">★★★★★</div>
            <p className="text-base text-pretty sm:text-lg text-[#0a0a0a] leading-relaxed mb-5 font-light">
              Библиотека материалов — лучшая функция. Собрала базу поставщиков
              один раз, теперь добавляю позиции в смету за секунды. Клиенты в
              восторге от прозрачности.
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-[#e4e4e7]">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                МЛ
              </div>
              <div>
                <div className="text-base font-medium text-[#0a0a0a]">Мария Лебедева</div>
                <div className="text-sm text-[#71717a]">Независимый дизайнер, СПб</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
