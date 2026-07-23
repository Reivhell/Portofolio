"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observes when an element enters the viewport and marks it as visible.
 * Used for fade-up reveal animations triggered on scroll.
 */
export function useInView(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = options?.threshold ?? 0.15;
    const rootMargin = options?.rootMargin ?? "0px 0px -8% 0px";
    const once = options?.once ?? true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, inView };
}
