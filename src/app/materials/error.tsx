"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

export default function MaterialsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Логируем ошибку при её возникновении (в проде здесь может быть Sentry)
  useEffect(() => {
    console.error("Ошибка в модуле материалов:", error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center animate-in fade-in-50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-zinc-900">
          Не удалось загрузить материалы
        </h2>

        <p className="mb-8 max-w-md text-sm text-zinc-500">
          Произошла ошибка при получении данных из базы. Возможно, проблема с
          подключением или сервер временно недоступен.
        </p>

        <div className="flex items-center gap-4">
          <Button onClick={() => reset()} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Попробовать снова
          </Button>

          <Button variant="outline" onClick={() => window.location.reload()}>
            Перезагрузить страницу
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}