"use client";

import { useEffect } from "react";

/**
 * Observes all [data-reveal] elements and adds "is-visible" class
 * when they scroll into view. Mirrors the vanilla IntersectionObserver
 * from the original index.html.
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
