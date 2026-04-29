import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { SlashIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BriefLoading() {
  return (
    <PageContainer>
      {/* Шапка и хлебные крошки (Skeleton) */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-24" /> {/* Название проекта */}
          <SlashIcon className="h-3 w-3" />
          <span className="font-bold text-black">Техническое задание</span>
        </div>

        <PageHeader title="Техническое задание" />
      </div>

      {/* Основной текстовый блок и прогресс (Skeleton) */}
      <div className="text-center space-y-6 max-w-2xl mx-auto pt-10">
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-12 w-3/4 mb-2" />{" "}
          {/* Заголовок "Заполните анкету" */}
        </div>

        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-[400px] max-w-full" />{" "}
          {/* Подзаголовок (1 строка) */}
          <Skeleton className="h-4 w-[300px] max-w-full" />{" "}
          {/* Подзаголовок (2 строка) */}
        </div>

        <div className="pt-4 flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-10" /> {/* Процент завершения */}
        </div>
      </div>

      {/* Сетка карточек (Skeleton) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-6 h-40 border border-zinc-100 rounded-2xl bg-white/50"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Иконка */}
              <Skeleton className="h-6 w-16 rounded-full" />{" "}
              {/* Бейдж "Готово" или пустой */}
            </div>

            <div>
              <Skeleton className="h-5 w-1/2 mb-2" /> {/* Название раздела */}
              <Skeleton className="h-3 w-3/4" /> {/* Описание раздела */}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка скачивания (Skeleton) */}
      <div className="flex justify-center pt-10 pb-6">
        <Skeleton className="h-14 w-64 rounded-full" />
      </div>
    </PageContainer>
  );
}
