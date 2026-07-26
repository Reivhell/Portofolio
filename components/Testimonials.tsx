"use client";

import { Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const cards = [
  {
    quote:
      "Adrian turned a vague idea into a product our customers actually compliment. The craft shows on every single screen.",
    initials: "SL",
    name: "Sarah Lim",
    company: "CEO, Bloomly",
  },
  {
    quote:
      "A rare mix of design taste and engineering rigor. He shipped our dashboard rebuild two weeks ahead of schedule.",
    initials: "MC",
    name: "Marcus Chen",
    company: "CTO, Finlane",
  },
  {
    quote:
      "Clear communication, clean handoffs, zero surprises. Our go-to freelancer for anything on the front-end.",
    initials: "PN",
    name: "Priya Nair",
    company: "Product Lead, Atlas",
  },
  {
    quote:
      "Our conversion rate jumped 34% after the redesign. Worth every single cent and then some.",
    initials: "DR",
    name: "Diego Ramos",
    company: "Founder, Karta",
  },
  {
    quote:
      "He thinks like a product manager and ships like a machine. Honestly the easiest collaboration we've had.",
    initials: "EH",
    name: "Emily Hart",
    company: "COO, Nara",
  },
  {
    quote:
      "The best investment we made in our brand this year. Fast, thoughtful and meticulous down to the last pixel.",
    initials: "TB",
    name: "Tom Becker",
    company: "Marketing Dir., Haven",
  },
];

function TestimonialCard({ c }: { c: (typeof cards)[0] }) {
  return (
    <article className="t-card">
      <span className="t-quote-icon">
        <Quote />
      </span>
      <p className="t-quote">{c.quote}</p>
      <div className="t-foot">
        <span className="t-avatar mono">{c.initials}</span>
        <div>
          <p className="t-name">{c.name}</p>
          <p className="t-company">{c.company}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamically set marquee speed based on content width
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const w = track.scrollWidth / 2;
    if (w > 0) {
      track.style.setProperty(
        "--marquee-dur",
        Math.max(30, w / 40).toFixed(1) + "s",
      );
    }
  }, []);

  // GSAP ticker — 3D fisheye tunnel with depth-of-field blur + organic bob
  // Paused via IntersectionObserver so the rAF loop doesn't run when scrolled past.
  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      if (window.innerWidth < 768) return; // CSS marquee is sufficient on mobile

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let paused = false;
      const io = new IntersectionObserver(
        ([entry]) => { paused = !entry.isIntersecting; },
        { threshold: 0 }
      );
      io.observe(section);

      const cards = track.querySelectorAll<HTMLElement>(".t-card");
      if (!cards.length) return;

      function tick() {
        if (paused) return;
        const half = window.innerWidth * 0.5;
        // gsap.ticker.time is a property, not a function
        const time = gsap.ticker.time;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = (cardCenter - window.innerWidth / 2) / half;
          const clamped = Math.min(1, Math.max(-1, dist));
          const abs = Math.abs(clamped);

          // 3D fisheye: extreme tilt at edges, face-on at center
          const rotateY = clamped * -45;
          // Skew tunnel: adds velocity shear for a speed-through feel
          const skewX = clamped * 5;
          // Scale bulge: center card looms large, edges recede into depth
          const scale = 1 - abs * 0.48;
          // Depth fade: edges dissolve into the vignette
          const opacity = 1 - abs * 0.55;

          // Depth-of-field: subtle blur at edges, bright + sharp at center
          const blur = (abs * 0.8).toFixed(1);
          const bright = 1 + (1 - abs) * 0.15;
          card.style.filter =
            blur !== "0.0"
              ? `blur(${blur}px) brightness(${bright.toFixed(2)})`
              : `brightness(${bright.toFixed(2)})`;

          // Organic vertical bob: dual-frequency, each card on its own wave
          const phase = cardCenter * 0.004 + time * 0.45;
          const bob =
            Math.sin(phase) * 3 + Math.sin(phase * 2.5 + 1.2) * 1.5;

          // Center spotlight glow
          const glow = 1 - abs;
          const boxShadow =
            glow > 0.05
              ? `0 0 ${8 + glow * 36}px rgba(58, 90, 70, ${(
                  glow * 0.35
                ).toFixed(2)})`
              : "var(--shadow-flat)";

          gsap.set(card, {
            rotateY,
            skewX,
            scale,
            opacity,
            y: bob,
            boxShadow,
            force3D: true,
          });
        });
      }

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="testimonials" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-head center" data-reveal>
          <p className="eyebrow mono">07 · Kind Words</p>
          <h2 className="section-title">
            What clients say after the launch party.
          </h2>
        </div>
      </div>
      <div className="marquee" data-reveal>
        <div className="marquee-track" ref={trackRef}>
          <div className="marquee-group">
            {cards.map((c) => (
              <TestimonialCard key={c.name} c={c} />
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {cards.map((c) => (
              <TestimonialCard key={c.name} c={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
