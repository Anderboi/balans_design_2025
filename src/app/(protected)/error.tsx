"use client"; // Файлы ошибок ОБЯЗАТЕЛЬНО должны быть клиентскими

import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Ваш shadcn компонент

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Здесь можно отправить ошибку в Sentry или другой логгер
    console.error("Caught in error boundary:", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-slate-800">
        Что-то пошло не так
      </h2>
      <p className="text-sm text-slate-500">
        Не удалось загрузить данные. Проверьте подключение или попробуйте снова.
      </p>
      {/* Функция reset пытается заново отрендерить сегмент */}
      <Button variant="outline" onClick={() => reset()}>
        Попробовать снова
      </Button>
    </div>
  );
}
