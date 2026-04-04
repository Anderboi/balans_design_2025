import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Мягкий фоновый градиент для глубины (Apple-style) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f5f5f7_0%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Основной контент */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Заголовок */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#1D1D1F] leading-tight">
          Проектируйте с <span className="text-[#0066CC]">Balans</span>.
          <br />
          Легко и безупречно.
        </h1>

        {/* Подзаголовок */}
        <p className="text-xl md:text-2xl text-[#86868B] max-w-2xl font-normal leading-relaxed">
          Единое пространство для управления проектами, бюджетами и базами материалов. Создано специально для дизайнеров интерьера.
        </p>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-medium bg-[#0066CC] hover:bg-[#0055B3] text-white transition-colors">
            <Link href="/dashboard">
              Перейти к проектам
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-medium border-2 border-[#E5E5EA] bg-transparent text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors">
            <Link href="/materials">
              Витрина материалов
            </Link>
          </Button>
        </div>
      </main>

      {/* Минималистичный футер */}
      <footer className="absolute bottom-8 text-sm text-[#86868B]">
        <p>© {new Date().getFullYear()} Balans Design. Все права защищены.</p>
      </footer>
    </div>
  );
}
