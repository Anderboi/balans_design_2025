import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 h-full bg-gray-100 border-r p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Balans Design</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Link href="/" passHref>
          <Button variant="ghost" className="w-full justify-start">
            Дашборд
          </Button>
        </Link>
        <Link href="/projects" passHref>
          <Button variant="ghost" className="w-full justify-start">
            Проекты
          </Button>
        </Link>
        <Link href="/tasks" passHref>
          <Button variant="ghost" className="w-full justify-start">
            Задачи
          </Button>
        </Link>
        <Link href="/materials" passHref>
          <Button variant="ghost" className="w-full justify-start">
            Материалы
          </Button>
        </Link>
        <Link href="/contacts" passHref>
          <Button variant="ghost" className="w-full justify-start">
            Контакты
          </Button>
        </Link>
      </nav>
      
      <div className="mt-auto pt-4 border-t">
        <Button variant="outline" className="w-full">
          Настройки
        </Button>
      </div>
    </div>
  );
}