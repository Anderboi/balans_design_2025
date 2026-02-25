"use client";

import { Truck } from "lucide-react";

export function DeliveryWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-lg shadow-zinc-300/50 rounded-4xl p-6 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold mb-1">Статус поставок</h3>
            <p className="text-sm text-gray-500 mb-6">
              Отслеживание критических позиций
            </p>
          </div>
          <Truck className="size-5 text-gray-300" />
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="size-12 bg-gray-200 rounded-lg overflow-hidden relative shrink-0">
              <div className="absolute inset-0 bg-gray-300" />
              {/* Image placeholder */}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">Мрамор Carrara</h4>
              <p className="text-xs text-gray-400 truncate">
                Апартаменты Хамовники • Stone Source
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-medium text-blue-500 uppercase tracking-wide bg-blue-50 px-2 py-1 rounded-md inline-block mb-1">
                Оплачено
              </div>
              <div className="text-[10px] text-gray-400">Ожидание: 12.12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
