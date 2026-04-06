'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Scroll-based reveal animation using IntersectionObserver.
 * Adds 'visible' class to elements with '.reveal'.
 */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * Animates progress bars (.pbar) when their container becomes visible.
 */
export function useProgressBars() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('.pbar').forEach((bar) => {
              bar.style.width = bar.dataset.w + '%';
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.bento, .mockup-inner, .step-card')
      .forEach((el) => observer.observe(el));

    // Also trigger after mount for initially-visible elements
    const timeout = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.pbar').forEach((bar) => {
        bar.style.width = bar.dataset.w + '%';
      });
    }, 900);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);
}

/**
 * Animates mini progress bars (.mpfill) in after/before rows.
 */
export function useMiniProgressBars() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('.mpfill').forEach((bar) => {
              bar.style.width = bar.dataset.w + '%';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document
      .querySelectorAll('.after-row, .before-row')
      .forEach((el) => observer.observe(el));

    const timeout = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.mpfill').forEach((bar) => {
        bar.style.width = bar.dataset.w + '%';
      });
    }, 700);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);
}

/**
 * Cursor glow effect that follows the mouse in the hero section.
 */
export function useCursorGlow(
  heroRef: React.RefObject<HTMLElement | null>,
  glowRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      glow.style.left = e.clientX - r.left + 'px';
      glow.style.top = e.clientY - r.top + 'px';
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, [heroRef, glowRef]);
}

/**
 * Header border visibility on scroll.
 */
export function useHeaderScroll(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      header.style.borderBottomColor =
        window.scrollY > 10 ? '#e4e4e7' : 'transparent';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerRef]);
}

/**
 * Sticky CTA visibility toggled when hero leaves/enters viewport.
 */
export function useStickyCTA(
  heroRef: React.RefObject<HTMLElement | null>,
  stickyRef: React.RefObject<HTMLElement | null>
) {
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    stickyRef.current?.classList.remove('show');
  }, [stickyRef]);

  useEffect(() => {
    const hero = heroRef.current;
    const sticky = stickyRef.current;
    if (!hero || !sticky) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!dismissedRef.current) {
            sticky.classList.toggle('show', !entry.isIntersecting);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef, stickyRef]);

  return dismiss;
}

/**
 * Typing animation for the AI assistant preview.
 */
export function useTypingEffect(
  textRef: React.RefObject<HTMLElement | null>,
  phrases: string[]
) {
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let started = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeStep() {
      if (!el) return;
      const phrase = phrases[phraseIdx];

      if (!deleting) {
        charIdx++;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          timeoutId = setTimeout(typeStep, 2200);
          return;
        }
        timeoutId = setTimeout(typeStep, 52);
      } else {
        charIdx--;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timeoutId = setTimeout(typeStep, 400);
          return;
        }
        timeoutId = setTimeout(typeStep, 28);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            timeoutId = setTimeout(typeStep, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe parent row
    const row = el.closest('.after-row');
    if (row) observer.observe(row);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [textRef, phrases]);
}

/**
 * Material chip staggered appearance animation.
 */
export function useChipAnimation(rowRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chips = row.querySelectorAll('.chip');
            chips.forEach((chip, i) => {
              setTimeout(() => {
                chip.classList.add('in');
              }, 200 + i * 220);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(row);
    return () => observer.disconnect();
  }, [rowRef]);
}
