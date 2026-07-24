"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const projects = [
  {
    num: "01",
    title: "Lumen",
    category: "FINTECH",
    year: "2026",
    desc: "A real-time cash-flow dashboard giving small businesses instant clarity on runway, spend and overdue invoices — replacing three spreadsheets with one calm screen.",
    tags: ["NEXT.JS", "TYPESCRIPT", "POSTGRESQL"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1f9808b28-a543-4872-825f-6dfd334baa45.png",
    featured: true,
    toast: "Live demo for Lumen — coming soon.",
  },
  {
    num: "02",
    title: "Karta",
    category: "E-COMMERCE",
    year: "2025",
    desc: "Headless storefront for a Jakarta fashion label — checkouts ran 41% faster after the relaunch.",
    tags: ["NEXT.JS", "STRIPE", "SANITY"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1eeb9ae9e-a43c-45a6-a233-77927c21109d.png",
    featured: false,
    toast: "Live demo for Karta — coming soon.",
  },
  {
    num: "03",
    title: "Nara",
    category: "BOOKING",
    year: "2025",
    desc: "Scheduling platform for wellness studios with payments, reminders and a no-show rate cut in half.",
    tags: ["REACT", "NODE.JS", "PRISMA"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1f3c91b19-24e0-4d80-add1-7c5952725487.png",
    featured: false,
    toast: "Live demo for Nara — coming soon.",
  },
  {
    num: "04",
    title: "Atlas",
    category: "SAAS",
    year: "2024",
    desc: "Product analytics suite with funnels and retention views, built to be readable by non-technical teams.",
    tags: ["TYPESCRIPT", "GRAPHQL", "D3"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/16f169ced-a54c-4516-bb9f-bb484bd83303.png",
    featured: false,
    toast: "Live demo for Atlas — coming soon.",
  },
  {
    num: "05",
    title: "Haven",
    category: "PROPERTY",
    year: "2024",
    desc: "Listings platform with map search and instant viewings for a boutique agency — bookings up 3×.",
    tags: ["NEXT.JS", "SUPABASE", "MAPBOX"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/124bc43e6-7d13-4ee0-9d24-9f3de5b0183f.png",
    featured: false,
    toast: "Live demo for Haven — coming soon.",
  },
  {
    num: "06",
    title: "Pulse",
    category: "HEALTH",
    year: "2024",
    desc: "Patient portal for a telehealth startup — appointment booking, prescription tracking, and secure messaging in one calm interface.",
    tags: ["REACT", "FIREBASE", "TWILIO"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1f9808b28-a543-4872-825f-6dfd334baa45.png",
    featured: false,
    toast: "Live demo for Pulse — coming soon.",
  },
  {
    num: "07",
    title: "Canopy",
    category: "EDUCATION",
    year: "2023",
    desc: "Learning management system for a coding bootcamp — course progress, live sessions, and assignment grading for 200+ students.",
    tags: ["NEXT.JS", "POSTGRESQL", "WEBSOCKET"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1eeb9ae9e-a43c-45a6-a233-77927c21109d.png",
    featured: false,
    toast: "Live demo for Canopy — coming soon.",
  },
  {
    num: "08",
    title: "Ridgeline",
    category: "LOGISTICS",
    year: "2023",
    desc: "Fleet tracking dashboard for a delivery company — live map, route optimisation, and driver scorecards replaced a wall of spreadsheets.",
    tags: ["TYPESCRIPT", "MAPBOX", "REDIS"],
    img: "https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1f3c91b19-24e0-4d80-add1-7c5952725487.png",
    featured: false,
    toast: "Live demo for Ridgeline — coming soon.",
  },
];

const INITIAL_COUNT = 5;

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = showAll ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;
  const extraCount = projects.length - INITIAL_COUNT;

  // Trigger fade-in for new cards after expand
  useEffect(() => {
    if (!showAll || !gridRef.current) {
      setRevealed(false);
      return;
    }
    // Double-rAF: first frame paints opacity:0, second frame triggers the transition
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setRevealed(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [showAll]);

  const toggle = useCallback(() => setShowAll((v) => !v), []);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="head-row section-head" data-reveal>
          <div>
            <p className="eyebrow mono">06 · Selected Work</p>
            <h2 className="section-title">
              Work that shipped, scaled, and stuck.
            </h2>
          </div>
          <p className="head-note">
            {projects.length} Projects · 2023 — 2026
          </p>
        </div>

        <div
          className={`projects-grid-wrap${showAll ? " is-expanded" : ""}`}
          ref={gridRef}
        >
          <div className="projects-grid">
            {visible.map((p, i) => {
              const isExtra = i >= INITIAL_COUNT;
              return (
                <article
                  key={p.num}
                  className={[
                    "project-card",
                    p.featured && !showAll ? "featured" : "",
                    isExtra && !revealed ? "project-card--hidden" : "",
                    isExtra && revealed ? "project-card--visible" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    "--rd": `${i * 0.07}s`,
                    transitionDelay: isExtra ? `${(i - INITIAL_COUNT) * 0.08}s` : "0s",
                  } as React.CSSProperties}
                >
                  <a
                    className="project-media"
                    href="#"
                    data-toast={p.toast}
                  >
                    <Image
                      src={p.img}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 600px"
                      quality={80}
                      loading="lazy"
                      decoding="async"
                      className="project-thumb"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  </a>
                  <div className="project-body">
                    <p className="project-meta mono">
                      <span className="num">{p.num}</span>
                      <span>
                        {p.category} · {p.year}
                      </span>
                    </p>
                    <h3 className="project-title">
                      {p.title}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </h3>
                    <p className="project-desc">{p.desc}</p>
                    <ul className="tag-list">
                      {p.tags.map((t) => (
                        <li key={t} className="tag mono">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="project-links">
                      <a href="#" data-toast={p.toast}>
                        Live Demo{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>
                      </a>
                      <a href="#" data-toast={p.toast}>
                        Case Study{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {hasMore && (
          <div className="projects-footer">
            <p className="projects-counter mono">
              {showAll
                ? `Showing 1–${projects.length} of ${projects.length}`
                : `Showing 1–${INITIAL_COUNT} of ${projects.length}`}
            </p>
            <button
              className="btn btn-ghost projects-more-btn"
              onClick={toggle}
              aria-expanded={showAll}
            >
              {showAll
                ? "Show Less"
                : `See All ${projects.length} Projects`}
              <ChevronDown
                className="lucide"
                style={{
                  transform: showAll
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s var(--ease)",
                }}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
