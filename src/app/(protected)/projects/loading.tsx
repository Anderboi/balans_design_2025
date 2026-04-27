import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsLoading() {
  return (
    <PageContainer>
      {/* 1. Точная копия шапки из page.tsx для предотвращения скачков верстки */}
      <div className="flex items-end justify-between mb-2">
        <PageHeader
          title="Проекты"
          description="Управление текущими объектами и стадиями проектирования."
        />
        <Button
          size="lg"
          disabled
          className="max-sm:size-12 opacity-50 cursor-not-allowed"
        >
          <Plus className="size-5 sm:mr-2" />
          <span className="hidden sm:inline">Создать проект</span>
        </Button>
      </div>

      <div className="mt-6">
        {/* 2. Скелетон панели инструментов (поиск, сортировка) */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-10 w-full max-w-sm rounded-lg bg-zinc-200/60 animate-pulse" />
          <div className="flex w-full sm:w-auto gap-2">
            <div className="h-10 w-full sm:w-32 rounded-lg bg-zinc-200/60 animate-pulse" />
            <div className="hidden sm:block h-10 w-10 rounded-lg bg-zinc-200/60 animate-pulse" />
          </div>
        </div>

        {/* 3. Скелетон сетки карточек проектов */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[280px] flex-col gap-4 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm"
            >
              {/* Заголовок и статус */}
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded-md bg-zinc-200/80 animate-pulse" />
                <div className="h-4 w-1/2 rounded-md bg-zinc-100 animate-pulse" />
              </div>

              {/* Имитация картинки или прогресс-бара */}
              <div className="mt-2 flex-1 rounded-lg bg-zinc-100 animate-pulse" />

              {/* Подвал карточки (аватарки команды, дата) */}
              <div className="mt-auto flex items-center justify-between border-t border-zinc-50 pt-4">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 border-2 border-white animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-zinc-200 border-2 border-white animate-pulse" />
                </div>
                <div className="h-4 w-16 rounded-md bg-zinc-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
