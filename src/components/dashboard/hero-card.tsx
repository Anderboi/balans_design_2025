"use client";

import { Sparkles } from "lucide-react";

interface HeroCardProps {
  userName: string;
}

export function HeroCard({ userName }: HeroCardProps) {
  return (
    <div className="bg-[#111111] text-white rounded-4xl p-8 md:p-12 relative overflow-hidden">
      {/* Background gradient/blob effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-purple-400 mb-6">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium tracking-wide uppercase">
            Balans OS Assistant
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-12 max-w-3xl">
          Доброе утро, {userName}.
          <br />У вас <span className="text-gray-400">4 задачи</span> в
          <br />
          фокусе.
        </h1>

        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:max-w-md border border-white/10">
            <p className="text-lg text-gray-200 leading-relaxed">
              &quot;Хамовники&quot; идет с опережением графика. Согласуйте
              финальные выкрасы в &quot;Репино&quot;, чтобы не задержать
              малярные работы.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 w-40 border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Активные проекты
              </div>
              <div className="text-4xl font-light">1</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 w-40 border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Всего задач
              </div>
              <div className="text-4xl font-light">12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
