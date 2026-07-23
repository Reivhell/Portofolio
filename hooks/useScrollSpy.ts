"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view using IntersectionObserver.
 * Returns the id of the most visible section, or null if none are intersecting.
 */
export function useScrollSpy(
  sectionIds: string[],
  options?: { rootMargin?: string }
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const rootMargin = options?.rootMargin ?? "-40% 0px -55% 0px";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin, threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds, options?.rootMargin]);

  return activeId;
}
