"use client";

import { useInView } from 'react-intersection-observer';

/**
 * Wrapper hook for react-intersection-observer
 * Used to trigger animations when sections enter viewport
 */
export const useSectionInView = (options?: {
  threshold?: number;
  triggerOnce?: boolean;
}) => {
  const { ref, inView } = useInView({
    threshold: options?.threshold || 0.1,
    triggerOnce: options?.triggerOnce !== false,
  });

  return { ref, inView };
};
