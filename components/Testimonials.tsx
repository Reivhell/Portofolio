"use client";

import { Quote } from "lucide-react";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const w = track.scrollWidth / 2;
    if (w > 0) {
      track.style.setProperty(
        "--marquee-dur",
        Math.max(30, w / 40).toFixed(1) + "s"
      );
    }
  }, []);

  return (
    <section id="testimonials" className="section">
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
