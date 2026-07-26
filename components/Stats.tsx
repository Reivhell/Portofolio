"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

function CountUp({ target, suffix }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }

    const dur = 1400;
    const t0 = performance.now();

    function step(now: number) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4); // ease-out quad
      setVal(Math.round(target * e));
      if (p < 1) frame.current = requestAnimationFrame(step);
    }

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  return (
    <span className="stat-num">
      <span>{val}</span>
      {suffix && <span className="suffix mono">{suffix}</span>}
    </span>
  );
}

const stats = [
  { target: 5, suffix: "+", label: "Years of experience" },
  { target: 30, suffix: "+", label: "Projects shipped end-to-end" },
  { target: 15, label: "Long-term clients & collaborators" },
  { target: 99, suffix: "%", label: "On-time delivery rate" },
];

export default function Stats() {
  const { ref, inView } = useInView({ threshold: 0.4, once: true });

  return (
    <section id="stats" className="section stats-section">
      <div className="container">
        <div className="section-head center" data-reveal>
          <p className="eyebrow mono">04 · By the Numbers</p>
        </div>
        <div className="stats-grid" ref={ref}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              {inView ? (
                <CountUp target={s.target} suffix={s.suffix} />
              ) : (
                <p className="stat-num">
                  <span>0</span>
                  {s.suffix && (
                    <span className="suffix mono">{s.suffix}</span>
                  )}
                </p>
              )}
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
