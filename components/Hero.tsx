"use client";

import { MapPin, ArrowRight, ArrowDown } from "lucide-react";
import { useCallback, useRef } from "react";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ProfileCard from "@/components/ProfileCard";
import SpecularButton from "@/components/SpecularButton";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Direct DOM scroll parallax — no React re-renders
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = parallaxRef.current;
    if (!el) return;
    // Init transform so mobile browser composites the layer before animations start
    el.style.transform = "translateY(0px)";
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = window.innerHeight * 1.3;
        el.style.transform = y < max
          ? `translateY(${(y * 0.05).toFixed(1)}px)`
          : `translateY(${(max * 0.05).toFixed(1)}px)`;
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, { scope: heroRef, dependencies: [] });

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

  // --- GSAP text reveal + enhanced entrance animations ---
  useGSAP(() => {
    const section = heroRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Split text into word spans for stagger reveal
    const textEls = section.querySelectorAll<HTMLElement>(
      ".hero-name, .hero-role, .hero-lede"
    );
    textEls.forEach((el) => {
      if (el.dataset.gsapSplit) return;
      const childNodes = Array.from(el.childNodes);
      el.innerHTML = "";
      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          (node.textContent || "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              el.appendChild(document.createTextNode(" "));
              return;
            }
            const span = document.createElement("span");
            span.className = "gsap-word";
            span.textContent = part;
            span.style.display = "inline-block";
            el.appendChild(span);
          });
        } else {
          el.appendChild(node.cloneNode(true));
        }
      });
      el.dataset.gsapSplit = "true";
    });

    // Word stagger reveal (fires after CSS heroIn completes)
    gsap.from(".gsap-word", {
      y: 20,
      autoAlpha: 0,
      stagger: 0.04,
      duration: 0.4,
      ease: "power3.out",
      delay: (_i: number, el: Element) => {
        const parent = el.closest("[data-hero]") as HTMLElement | null;
        const d = parent
          ? parseFloat(parent.style.getPropertyValue("--d") || "0.3")
          : 0.3;
        return d + 0.6;
      },
    });

    // Enhanced status-dot continuous pulse
    gsap.to(".status-dot", {
      scale: 1.35,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      transformOrigin: "center center",
    });

    // Enhanced scroll-cue dot — smooth continuous loop
    gsap.to(".cue-dot", {
      y: 44,
      duration: 2.0,
      repeat: -1,
      ease: "power1.inOut",
    });
    gsap.to(".cue-dot", {
      autoAlpha: 0.25,
      duration: 2.0,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, { scope: heroRef, dependencies: [] });

  return (
    <section ref={heroRef} id="home" className="hero">
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
            ref={parallaxRef}
            className="hero-parallax"
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
