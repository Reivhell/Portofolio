"use client";

import { MapPin, ArrowRight, ArrowDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import ProfileCard from "@/components/ProfileCard";
import SpecularButton from "@/components/SpecularButton";

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const max = window.innerHeight * 1.3;
      if (y < max) {
        setOffsetY(y * 0.05);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as Record<string, unknown>)
      .__lenis as Lenis | null;
    if (lenis) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="status" data-hero style={{ "--d": "0.05s" } as React.CSSProperties}>
            <span className="status-dot" />
            Available — Q3 2026
          </p>
          <h1 className="hero-name" data-hero style={{ "--d": "0.13s" } as React.CSSProperties}>
            Ahmad David Alvees<span className="accent-dot">.</span>
          </h1>
          <p className="hero-role" data-hero style={{ "--d": "0.21s" } as React.CSSProperties}>
            Full-Stack Developer <span className="amp">&amp;</span> Mobile Developer
          </p>
          <p className="hero-lede" data-hero style={{ "--d": "0.29s" } as React.CSSProperties}>
            I help startups and studios turn fuzzy ideas into fast, considered
            web products — from the first wireframe to the production deploy.
          </p>
          <div
            className="hero-cta"
            data-hero
            style={{ "--d": "0.37s" } as React.CSSProperties}
          >
            <SpecularButton
              size="md"
              baseColor="#3A5A46"
              tint="#3A5A46"
              tintOpacity={0.9}
              textColor="#F6F5EF"
              lineColor="#A9C4AE"
              radius={16}
              className="sb-btn"
              onClick={() => scrollTo("contact")}
            >
              Contact Me <ArrowRight />
            </SpecularButton>
            <SpecularButton
              size="md"
              baseColor="#3A5A46"
              tint="#DCD7C8"
              tintOpacity={0.1}
              textColor="#16140E"
              lineColor="#3A5A46"
              intensity={0.5}
              radius={16}
              className="sb-btn"
              onClick={() => scrollTo("projects")}
            >
              View My Work <ArrowDown />
            </SpecularButton>
          </div>
          <p
            className="hero-meta"
            data-hero
            style={{ "--d": "0.45s" } as React.CSSProperties}
          >
            <MapPin />
            <span className="mono">
              Banjarmasin — WORKING WORLDWIDE · GMT+8
            </span>
          </p>
        </div>

        <div
          className="hero-visual"
          data-hero
          style={{ "--d": "0.3s" } as React.CSSProperties}
        >
          <div
            className="hero-parallax"
            style={{ transform: `translateY(${offsetY.toFixed(1)}px)` }}
          >
            <ProfileCard
              avatarUrl="https://image.qwenlm.ai/public_source/6f86c30a-277c-406e-85df-03fdf435d303/1c216c180-f9a0-41db-96b1-3d4cac21fa2f.png"
              name="Ahmad David Alvees"
              role="Full-Stack Developer &amp; Mobile Developer"
              location="Jakarta"
              timezone="GMT+8"
              githubUrl="https://github.com/reivhell"
              linkedinUrl="https://linkedin.com/in/reivhell"
              email="david@example.com"
              onContactClick={() => scrollTo("contact")}
              className="w-full mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span className="mono">SCROLL</span>
        <span className="cue-line">
          <span className="cue-dot" />
        </span>
      </div>
    </section>
  );
}
