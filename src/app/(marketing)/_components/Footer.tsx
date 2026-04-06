import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-[#0a0a0a] border-t border-white/8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-[#0a0a0a] text-[11px] font-bold">B</span>
            </div>
            <span className="text-white text-sm font-semibold tracking-widest uppercase">
              Balans
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/materials" className="text-white/40 hover:text-white transition-colors text-sm">
              Материалы
            </Link>
            <Link href="/login" className="text-white/40 hover:text-white transition-colors text-sm">
              Войти
            </Link>
          </div>

          <div className="text-white/18 text-[10px] tracking-widest uppercase font-semibold">
            © 2024 Balans. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
