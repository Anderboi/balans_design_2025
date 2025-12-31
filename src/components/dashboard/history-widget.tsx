"use client";

import { Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function HistoryWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">История изменений</h3>
        <Clock className="h-4 w-4 text-gray-300" />
      </div>

      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-1">
        <div className="space-y-6 relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-8 bottom-0 w-px bg-gray-100" />

          <div className="relative flex gap-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 z-10">
              <AvatarFallback>ЕС</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none mb-1.5 pt-1">
                Елена Смирнова{" "}
                <span className="text-gray-400 font-normal">
                  утвердила материал
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                &quot;Инженерная доска Дуб Натур&quot;
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                АПАРТАМЕНТЫ ХАМОВНИКИ • 17:30
              </div>
            </div>
          </div>

          <div className="relative flex gap-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 z-10">
              <AvatarFallback>ДС</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none mb-1.5 pt-1">
                Дмитрий Соколов{" "}
                <span className="text-gray-400 font-normal">
                  загрузил новый рендер
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                &quot;Кухня-гостиная V2&quot;
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                АПАРТАМЕНТЫ ХАМОВНИКИ • 14:20
              </div>
            </div>
          </div>

          <div className="relative flex gap-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 z-10">
              <AvatarFallback>АП</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none mb-1.5 pt-1">
                Алексей Петров{" "}
                <span className="text-gray-400 font-normal">
                  изменил статус задачи
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                &quot;Замеры террасы&quot;
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                ЗАГОРОДНЫЙ ДОМ РЕПИНО • 10:45
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-50 text-center">
          <button className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
            Показать всё
          </button>
        </div>
      </div>
    </div>
  );
}
