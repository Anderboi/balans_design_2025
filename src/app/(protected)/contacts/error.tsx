"use client"; // Обязательная директива для всех файлов обработки ошибок

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, RefreshCcw, Home } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import Link from "next/link";

export default function ContactsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // В продакшене здесь можно подключить Sentry или другой сервис мониторинга
    console.error("Ошибка в модуле контактов:", error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/30 p-8 text-center backdrop-blur-sm animate-in zoom-in-95">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-sm">
          <Users className="h-10 w-10 text-red-600" />
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900">
          Не удалось загрузить адресную книгу
        </h2>

        <p className="mb-8 max-w-md text-sm text-zinc-500">
          Произошла ошибка при синхронизации контактов и компаний. Возможно,
          проблема с подключением или сервер временно недоступен.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
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
            className="w-full sm:w-auto"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              На главную
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
