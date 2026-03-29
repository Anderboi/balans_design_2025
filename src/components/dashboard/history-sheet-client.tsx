"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ACTION_STYLES, DEFAULT_ACTION_STYLE, describeAction, relativeTime } from "./history-utils";

interface HistorySheetClientProps {
  items: any[];
  totalCount: number;
}

export function HistorySheetClient({ items, totalCount }: HistorySheetClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors inline-flex items-center gap-1 cursor-pointer">
          Вся история <ArrowRight className="size-3" />
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md border-zinc-100 p-0 flex flex-col bg-white">
        <SheetHeader className="p-6 border-b border-zinc-100">
          <SheetTitle className="text-xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
            <Clock className="size-5 text-gray-400" />
            История изменений
          </SheetTitle>
          <SheetDescription>
            Последние 20 событий по всем проектам
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6 h-full">
          <div className="space-y-4 pb-8">
            {items.map((item: any) => {
              const actionStyle = ACTION_STYLES[item.action] || DEFAULT_ACTION_STYLE;
              const Icon = actionStyle.icon;
              const taskTitle = item.task?.title || "Задача";
              const projectName = item.task?.project?.name || "";
              const userName = item.user?.full_name || "Пользователь";
              const description = describeAction(item.action, item.details);

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100/50 transition-colors"
                >
                  {/* Leading Icon */}
                  <div className={`mt-0.5 size-10 ${actionStyle.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`size-5 ${actionStyle.text} opacity-60`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-zinc-900 leading-snug mb-1">
                      {description}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2 truncate">
                      {[taskTitle, projectName].filter(Boolean).join(" • ")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5">
                        <div className="size-4 rounded-full bg-zinc-200 flex items-center justify-center text-[8px] text-zinc-600">
                          {userName.charAt(0)}
                        </div>
                        {userName}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">
                        {relativeTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {items.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                Нет доступной истории
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
