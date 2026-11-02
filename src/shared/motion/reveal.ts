import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATION, EASE, reduced } from './policy';

// Module evaluation runs once, so the plugin registers once.
gsap.registerPlugin(ScrollTrigger);

export interface RevealOptions {
  // 'enter' plays each target when it nears the viewport (once); 'load' plays right away.
  when?: 'enter' | 'load';
  // Seconds added to every target's delay, on top of its data-reveal-delay attribute.
  baseDelay?: number;
}

// Fades and un-blurs the matching targets in. The `.motion [data-reveal]` rule in global.css hides
// them before this runs, so every target this is meant to reveal must be passed to it, or it stays hidden.
// Under reduced motion nothing animates: targets are set visible at once.
export function revealOnEnter(
  root: ParentNode | null,
  selector = '[data-reveal]',
  { when = 'enter', baseDelay = 0 }: RevealOptions = {},
): void {
  if (!root) return;
  const targets = root.querySelectorAll<HTMLElement>(selector);

  if (reduced.matches) {
    gsap.set(targets, { opacity: 1, filter: 'none' });
    return;
  }

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, filter: 'blur(12px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: DURATION.reveal,
        ease: EASE.reveal,
        delay: baseDelay + Number(el.dataset.revealDelay ?? 0),
        // No clearProps: clearing the inline filter would fall back to the CSS pre-hide blur.
        scrollTrigger: when === 'enter' ? { trigger: el, start: 'top 85%', once: true } : undefined,
      },
    );
  });
}
