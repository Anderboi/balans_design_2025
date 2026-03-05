"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

interface NotificationsPopoverProps {
  initialNotifications: Notification[];
  userId: string;
}

function formatTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: ru,
    });
  } catch {
    return "";
  }
}

export function NotificationsPopover({
  initialNotifications,
  userId,
}: NotificationsPopoverProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ initialNotifications, userId });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-500 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0 rounded-2xl border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 px-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-900">Уведомления</h3>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent"
            >
              <Check className="mr-1 h-3 w-3" />
              Прочитать все
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-zinc-600">
                Нет уведомлений
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Здесь будут появляться ваши новые уведомления
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative flex items-start gap-4 p-4 px-5 transition-colors border-b border-gray-50 last:border-0",
                    !notification.read ? "bg-primary/2" : "hover:bg-gray-50/50",
                  )}
                >
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold truncate",
                          !notification.read
                            ? "text-zinc-900"
                            : "text-zinc-700",
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 whitespace-nowrap">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
                    {notification.body && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {notification.body}
                      </p>
                    )}
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Перейти
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-primary rounded-full"
                        onClick={() => markAsRead(notification.id)}
                        title="Отметить прочитанным"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-600 rounded-full"
                      onClick={() => deleteNotification(notification.id)}
                      title="Удалить"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
