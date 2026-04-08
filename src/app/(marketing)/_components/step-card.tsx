import { HowItWorksStep } from '@/config/marketing';
import { cn } from '@/lib/utils';
import React from 'react';

interface StepCardProps {
  step: HowItWorksStep;
  children: React.ReactNode;
}

const StepCard = ({ step, children }: StepCardProps) => (
  <div className={cn("step-card reveal bento", step.delay)}>
    <div className="p-6">
      <div className="size-12 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center font-display text-3xl mb-5">
        {step.num}
      </div>
      <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3 whitespace-pre-line">
        {step.title}
      </h3>
      <p className="text-base text-[#71717a] font-light leading-relaxed mb-6">
        {step.description}
      </p>
    </div>
    <div className="bg-[#fafafa] border-t border-[#e4e4e7] px-6 py-4">
      {children}
    </div>
  </div>
);

export default StepCard;
