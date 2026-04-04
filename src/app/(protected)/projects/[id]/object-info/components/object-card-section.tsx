import MainBlockCard from "@/components/ui/main-block-card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ObjectCardSectionProps {
  projectId: string;
}

export function ObjectCardSection({ projectId }: ObjectCardSectionProps) {
  return (
    <MainBlockCard className="bg-zinc-900 text-white p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Printer className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Карточка объекта</h3>
            <p className="text-sm text-gray-400">
              Сформировать PDF карточку объекта
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="cursor-pointer"
        >
          <Download className="size-4 mr-2" />
          Скачать PDF
        </Button>
      </div>
    </MainBlockCard>
  );
}
