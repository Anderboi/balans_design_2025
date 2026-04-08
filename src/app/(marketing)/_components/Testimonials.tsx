"use client";

import { useReveal } from "./animations";
import LandingBlockHeader from "./LandingBlockHeader";
import { TESTIMONIALS } from "@/config/marketing";
import TestimonialCard from "./testimonial-card";

export default function Testimonials() {
  useReveal();

  return (
    <section id="testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <LandingBlockHeader title="Отзывы">
          Говорят
          <br />
          <em className="text-[#d64218]">дизайнеры</em>
        </LandingBlockHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
