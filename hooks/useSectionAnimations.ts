"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Unique per-section GSAP + ScrollTrigger animations layered on top of the
 * existing CSS reveal. Property choices avoid conflict with [data-reveal] CSS
 * (opacity / translateY) by animating different transforms, clip-paths, and
 * child elements.
 */
export function useSectionAnimations() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    /* ─── wire ScrollTrigger → Lenis ─── */
    const lenis = (window as unknown as Record<string, unknown>)
      .__lenis as { on: (e: string, fn: () => void) => void } | null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    /* ─── HERO — parallax depth ─── */
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });
    heroTl
      .to(".hero-parallax", { y: 90, ease: "none" }, 0)
      .to(".hero-copy", { y: -20, ease: "none" }, 0);

    /* ─── SERVICES — 3D perspective tilt entry ─── */
    gsap.utils
      .toArray<HTMLElement>(".service-card")
      .forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          rotationX: 12,
          rotationY: i % 2 === 0 ? -8 : 8,
          transformOrigin: "center center",
          y: 50,
          duration: 0.75,
          delay: i * 0.08,
          ease: "power3.out",
        });
      });

    /* ─── STACK — chips slide from alternating sides with bounce ─── */
    gsap.utils.toArray<HTMLElement>(".stack-group").forEach((group, i) => {
      gsap.from(group.querySelectorAll(".chip"), {
        scrollTrigger: {
          trigger: group,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        x: i % 2 === 0 ? -50 : 50,
        opacity: 0,
        rotation: i % 2 === 0 ? -6 : 6,
        duration: 0.55,
        stagger: 0.05,
        ease: "back.out(1.6)",
      });
    });

    /* ─── MUSIC PLAYER — album spin + EQ wave ─── */
    gsap.from(".album", {
      scrollTrigger: {
        trigger: "#music",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
      rotation: 120,
      scale: 0.5,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
    });

    gsap.from(".eq span", {
      scrollTrigger: {
        trigger: "#music",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.5,
      stagger: 0.07,
      ease: "back.out(2)",
    });

    /* ─── STATS — elastic scale entry ─── */
    gsap.from(".stat", {
      scrollTrigger: {
        trigger: "#stats",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
      scale: 0.75,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "elastic.out(1, 0.45)",
    });

    /* ─── SKILLS — list items wipe in from left ─── */
    gsap.utils.toArray<HTMLElement>(".skill-cat").forEach((cat) => {
      gsap.from(cat.querySelectorAll("li"), {
        scrollTrigger: {
          trigger: cat,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
        x: -24,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
      });
    });

    /* ─── PROJECTS — clip-path reveal from top ─── */
    gsap.utils
      .toArray<HTMLElement>(".project-card")
      .forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
          clipPath: "inset(0 0 100% 0)",
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.inOut",
        });
      });

    gsap.utils
      .toArray<HTMLElement>(".project-card")
      .forEach((card) => {
        gsap.from(card.querySelector(".project-media img"), {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          scale: 1.15,
          duration: 0.9,
          ease: "power2.out",
        });
      });

    /* ─── TESTIMONIALS — alternating horizontal slide + tilt ─── */
    gsap.utils.toArray<HTMLElement>(".t-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: "#testimonials",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: i % 2 === 0 ? -70 : 70,
        opacity: 0,
        rotation: i % 2 === 0 ? -4 : 4,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      });
    });

    /* ─── FOOTER — watermark scale + content stagger ─── */
    gsap.from(".footer-mark", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top bottom",
        end: "top 30%",
        scrub: 1.2,
      },
      scale: 0.6,
      opacity: 0,
      ease: "none",
    });

    gsap.from(".footer-top > *", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top 86%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power2.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
