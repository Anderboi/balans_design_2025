export interface Testimonial {
  id: string;
  stars: number;
  text: string;
  author: string;
  role: string;
  initials: string;
  color: string;
  delay?: string;
}

/**
 * Marketing site configuration
 * Stores testimonials, feature lists, and other static marketing content.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'komaarova',
    stars: 5,
    text: 'Раньше вела всё в таблицах и постоянно теряла что-то важное. Теперь открываю Balans и вижу полную картину по каждому проекту. Совершенно другой уровень спокойствия.',
    author: 'Анна Комарова',
    role: 'Студия интерьера, Москва',
    initials: 'АК',
    color: 'bg-violet-500',
  },
  {
    id: 'lebedeva',
    stars: 5,
    text: 'Библиотека материалов — лучшая функция. Собрала базу поставщиков один раз, теперь добавляю позиции в смету за секунды. Клиенты в восторге от прозрачности.',
    author: 'Мария Лебедева',
    role: 'Независимый дизайнер, СПб',
    initials: 'МЛ',
    color: 'bg-pink-500',
    delay: 'd1',
  },
];
