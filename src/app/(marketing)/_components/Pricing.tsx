'use client';

import { useReveal } from './animations';
import LandingBlockHeader from './LandingBlockHeader';
import { PRICING_PLANS } from '@/config/marketing';
import PricingCard from './pricing-card';

export default function Pricing() {
  useReveal();

  return (
    <section id='pricing' className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto">
        <LandingBlockHeader title="Тарифы">
          Просто и<br />
          <em className="text-[#d64218]">прозрачно</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className="text-center text-sm text-[#a1a1aa] mt-5 reveal">
          14 дней Pro бесплатно · Без карты при регистрации
        </p>
      </div>
    </section>
  );
}
