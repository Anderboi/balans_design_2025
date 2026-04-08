import { Testimonial } from '@/config/marketing';
import { cn } from '@/lib/utils';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className={cn("bento p-6 reveal", testimonial.delay)}>
    <div className="text-[#f59e0b] mb-3">{"★".repeat(testimonial.stars)}</div>
    <p className="text-pretty text-lg text-[#0a0a0a] leading-relaxed mb-5 font-light">
      {testimonial.text}
    </p>
    <div className="flex items-center gap-3 pt-4 border-t border-[#e4e4e7]">
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0",
          testimonial.color,
        )}
      >
        {testimonial.initials}
      </div>
      <div>
        <div className="text-base font-medium text-[#0a0a0a]">
          {testimonial.author}
        </div>
        <div className="text-sm text-[#71717a]">{testimonial.role}</div>
      </div>
    </div>
  </div>
);

export default TestimonialCard;