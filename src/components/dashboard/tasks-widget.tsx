"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TasksWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Текущие задачи по всем проектам
        </h3>
        <Link
          href="/tasks"
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          Все задачи <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-1 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant="destructive"
            className="bg-red-50 text-red-500 hover:bg-red-50 border-0 text-[10px] px-2 py-0.5 uppercase tracking-wide"
          >
            Критично
          </Badge>
          <span className="text-xs text-gray-400">20.11.2023</span>
        </div>

        <h4 className="text-xl font-medium mb-8 group-hover:text-blue-600 transition-colors">
          Заказать образцы плитки
        </h4>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Апартаменты Хамовники
          </span>
          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
