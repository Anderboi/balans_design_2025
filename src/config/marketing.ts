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

export interface HowItWorksStep {
  id: string;
  num: string;
  title: string;
  description: string;
  delay?: string;
}

export interface BentoStage {
  id: number;
  label: string;
  progress: number | null;
  status: 'complete' | 'in-progress' | 'locked';
}

export interface BentoMaterial {
  name: string;
  price: string;
  bg: string;
}

export interface BentoContact {
  initials: string;
  name: string;
  role: string;
  bg: string;
  text: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: PricingFeature[];
  isFeatured?: boolean;
  badge?: string;
  buttonText: string;
  buttonHref: string;
  buttonVariant: 'outline' | 'secondary';
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
    delay: 'd2',
  },
];

export const BENTO_STAGES: BentoStage[] = [
  { id: 1, label: 'Замеры и ТЗ', progress: 100, status: 'complete' },
  { id: 2, label: 'Концепция', progress: 65, status: 'in-progress' },
  { id: 3, label: 'Документация', progress: null, status: 'locked' },
  { id: 4, label: 'Авторский надзор', progress: null, status: 'locked' },
];

export const BENTO_KANBAN = {
  inProgress: [
    { task: 'Согласовать планировку', project: 'Хамовники' },
    { task: 'Подобрать светильники', project: 'Репино' },
  ],
  review: [
    { task: 'Смета на кухню', project: 'Патриаршие' },
  ],
  done: [
    'Финальные обмеры',
    'ТЗ от клиента',
  ],
};

export const BENTO_MATERIALS: BentoMaterial[] = [
  { name: 'Керамогранит Loft Grey', price: '4 200 ₽/м²', bg: 'bg-stone-200' },
  { name: 'Паркет Oak Natural', price: '8 900 ₽/м²', bg: 'bg-amber-100' },
  { name: 'Краска Farrow & Ball', price: '3 100 ₽/л', bg: 'bg-slate-200' },
];

export const BENTO_CONTACTS: BentoContact[] = [
  { initials: 'АИ', name: 'Алексей Иванов', role: 'Электрик · Партнёр', bg: 'bg-violet-100', text: 'text-violet-600' },
  { initials: 'КС', name: 'Компания «Стройдом»', role: 'Поставщик · Плитка', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { initials: 'МГ', name: 'Мария Громова', role: 'Клиент · Хамовники', bg: 'bg-pink-100', text: 'text-pink-600' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Бесплатно',
    price: '0 ₽',
    period: 'навсегда',
    buttonText: 'Начать бесплатно',
    buttonHref: '/login',
    buttonVariant: 'outline',
    features: [
      { text: 'До 3 проектов', included: true },
      { text: 'Канбан-доска', included: true },
      { text: 'До 50 материалов', included: true },
      { text: 'База контактов', included: true },
      { text: 'AI-ассистент', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '990 ₽',
    period: 'в месяц',
    isFeatured: true,
    badge: 'Популярный',
    buttonText: 'Попробовать Pro →',
    buttonHref: '/login',
    buttonVariant: 'secondary',
    delay: 'd1',
    features: [
      { text: 'Неограниченно проектов', included: true },
      { text: 'Неограниченно материалов', included: true },
      { text: 'AI-ассистент', included: true },
      { text: 'Экспорт смет в PDF', included: true },
      { text: 'Приоритетная поддержка', included: true },
    ],
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: "step1",
    num: "I",
    title: "Создайте\nпроект",
    description: "Добавьте название, клиента и бюджет. Разбейте на этапы.",
  },
  {
    id: "step2",
    num: "II",
    title: "Наполните содержимым",
    description: "Задачи, материалы, контакты подрядчиков и документы.",
    delay: "d1",
  },
  {
    id: "step3",
    num: "III",
    title: "Контролируйте результат",
    description: "Прогресс, бюджет и дедлайны — всё в одном месте.",
    delay: "d2",
  },
];
