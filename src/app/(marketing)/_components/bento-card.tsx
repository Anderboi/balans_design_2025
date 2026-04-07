import { cn } from '@/lib/utils';
import React from 'react'

interface BentoCardProps {
  id: string;
  num: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  revealDelay?: string;
}

const BentoCard = ({ id, num, title, description, children, className, badge, revealDelay }: BentoCardProps) => (
  <div className={cn("bento p-6 flex flex-col reveal", revealDelay, className)}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <div className="fnum font-display">{num}</div>
        <h3 className="text-xl font-semibold text-[#0a0a0a]">{title}</h3>
      </div>
      {badge && (
        <span className="text-[10px] font-medium text-[#f59e0b] bg-[#fef3c7] px-2.5 py-1 rounded-full shrink-0">
          {badge}
        </span>
      )}
    </div>
    <p className="text-lg sm:text-base text-[#71717a] font-light mb-6 leading-relaxed">
      {description}
    </p>
    <div className="mt-auto">
      {children}
    </div>
  </div>
);

export default BentoCard