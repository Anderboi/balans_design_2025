"use client";

import { useReveal, useProgressBars } from "./animations";
import LandingBlockHeader from "./LandingBlockHeader";
import { cn } from "@/lib/utils";
import React from "react";
import { HOW_IT_WORKS_STEPS } from "@/config/marketing";
import StepCard from "./step-card";

/* -------------------------------------------------------------------------- */
/*                               Sub-components                               */
/* -------------------------------------------------------------------------- */

const Step1Preview = () => (
  <>
    <div className="flex items-center gap-2 mb-3">
      <div className="size-2 rounded-full bg-[#f59e0b]" />
      <span className="text-sm font-medium text-[#0a0a0a]">Новый проект</span>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-[#e4e4e7] rounded-full flex-1" />
      <div className="h-2 bg-[#e4e4e7] rounded-full w-3/4" />
      <div className="h-2 bg-[#e4e4e7] rounded-full w-1/2" />
    </div>
  </>
);

const Step2Preview = () => (
  <div className="space-y-1.5">
    {[
      { color: "bg-blue-400", w: "flex-1" },
      { color: "bg-[#f59e0b]", w: "w-2/3" },
      { color: "bg-emerald-400", w: "flex-1", opacity: true },
    ].map((item, i) => (
      <div
        key={i}
        className={cn(
          "flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e4e4e7]",
          item.opacity && "opacity-40",
        )}
      >
        <div className={cn("size-1.5 rounded-full", item.color)} />
        <div className={cn("h-2 bg-[#e4e4e7] rounded", item.w)} />
      </div>
    ))}
  </div>
);

const Step3Preview = () => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-[#71717a]">Прогресс</span>
      <span className="text-[10px] font-medium text-[#0a0a0a]">72%</span>
    </div>
    <div className="h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
      <div className="pbar h-full bg-emerald-400 rounded-full" data-w="72" />
    </div>
    <div className="flex justify-between items-center mt-1">
      <span className="text-[10px] text-[#71717a]">Бюджет</span>
      <span className="text-[10px] font-medium text-[#f59e0b]">1.7 / 2.4М</span>
    </div>
    <div className="h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
      <div className="pbar h-full bg-[#f59e0b] rounded-full" data-w="71" />
    </div>
  </div>
);

const STEP_PREVIEWS: Record<string, React.ReactNode> = {
  step1: <Step1Preview />,
  step2: <Step2Preview />,
  step3: <Step3Preview />,
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export default function HowItWorks() {
  useReveal();
  useProgressBars();

  return (
    <section id='how-it-works' className="py-24 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <LandingBlockHeader title="Как это работает">
          Три шага до
          <br />
          <em className="text-[#d64218]">порядка</em>
        </LandingBlockHeader>
      </div>

      <div className="pl-6 md:pl-[calc((100vw-1024px)/2+24px)]">
        <div className="steps-scroll pb-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <StepCard key={step.id} step={step}>
              {STEP_PREVIEWS[step.id]}
            </StepCard>
          ))}
          <div className="w-6 shrink-0" />
        </div>
      </div>
    </section>
  );
}
