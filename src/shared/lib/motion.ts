import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from '../motion/policy';

// Module evaluation runs once, so the plugin registers once.
gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return reduced.matches;
}
