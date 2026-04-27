"use client"; // Обязательная директива для Error Boundaries

import { useEffect } from "react";
import Link from "next/link";
import { FolderX, RefreshCcw, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // В проде логируем ошибку в Sentry
    console.error("Критическая ошибка в модуле проектов:", error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-8 text-center animate-in zoom-in-95 duration-300">
        {/* Иконка ошибки */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-sm ring-4 ring-red-50">
          <FolderX className="h-10 w-10 text-red-600" />
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900">
          Не удалось загрузить проекты
        </h2>

        <p className="mb-8 max-w-md text-sm text-zinc-500">
          Произошла ошибка при получении списка ваших объектов из базы данных.
          Возможно, проблема с интернет-соединением или сервер временно
          недоступен.
        </p>

        {/* Панель действий */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            onClick={() => reset()}
            size="lg"
            className="flex w-full sm:w-auto items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Попробовать снова
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto bg-white hover:bg-zinc-50"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4 text-zinc-500" />
              На главную
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
