import Link from 'next/link';
import { PricingPlan } from '@/config/marketing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div className={cn(
      "plan-card p-7 reveal flex flex-col relative overflow-hidden",
      plan.isFeatured && "featured",
      plan.delay
    )}>
      {plan.badge && (
        <div className="absolute top-4 right-4 text-[10px] font-semibold bg-[#f59e0b] text-white px-2.5 py-1 rounded-full">
          {plan.badge}
        </div>
      )}
      
      <div className="mb-5">
        <div className={cn(
          "text-xs font-semibold tracking-wider uppercase mb-3",
          plan.isFeatured ? "text-white/40" : "text-[#71717a]"
        )}>
          {plan.name}
        </div>
        <div className={cn(
          "font-display text-[56px] md:text-[64px] mb-1",
          plan.isFeatured ? "text-white" : "text-[#0a0a0a]"
        )}>
          {plan.price}
        </div>
        <div className={cn(
          "text-base font-light",
          plan.isFeatured ? "text-white/40" : "text-[#71717a]"
        )}>
          {plan.period}
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-7">
        {plan.features.map((feature, idx) => (
          <div 
            key={`${plan.id}-feat-${idx}`} 
            className={cn("flex items-center gap-2.5", !feature.included && "opacity-35")}
          >
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
              feature.included 
                ? (plan.isFeatured ? "bg-white/10 text-white" : "bg-emerald-100 text-emerald-600")
                : "bg-[#e4e4e7]"
            )}>
              {feature.included ? <Check className='size-2.5' /> : <X className='size-2.5 text-[#71717a]' />}
            </div>
            <span className={cn(
              "text-base",
              plan.isFeatured ? "text-white" : (feature.included ? "text-[#0a0a0a]" : "text-[#71717a]")
            )}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <Button 
        variant={plan.buttonVariant} 
        size="lg" 
        className='cursor-pointer'
        disabled={plan.id === 'pro'} // Original had Pro disabled or specialized
        asChild
      >
        <Link href={plan.buttonHref}>{plan.buttonText}</Link>
      </Button>
    </div>
  );
};

export default PricingCard;
