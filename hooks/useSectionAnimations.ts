"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

    /* ─── MUSIC PLAYER — progress bar fill + EQ wave ─── */
    gsap.from(".progress-fill", {
      scrollTrigger: {
        trigger: "#music",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
      width: "0%",
      duration: 1.2,
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

    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
    //  IMPROVED ANIMATIONS — additive, different properties, no conflicts
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

    const cleanups: (() => void)[] = [];

    /* 1. HERO — extra depth: scale + rotationX on parallax, clip-path reveal ─── */
    gsap.to(".hero-parallax", {
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
      scale: 1.06,
      rotationX: 5,
      ease: "none",
    });

    gsap.to(".hero-visual", {
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "center top",
        scrub: 1.2,
      },
      clipPath: "inset(0 0 100% 0)",
      ease: "none",
    });

    /* 2. SERVICES — mouse-follow 3D tilt ─── */
    gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
      const tiltX = gsap.quickTo(card, "rotationY", {
        duration: 0.4,
        ease: "power3",
      });
      const tiltY = gsap.quickTo(card, "rotationX", {
        duration: 0.4,
        ease: "power3",
      });

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        tiltX(nx * 10);
        tiltY(ny * -10);
      };
      const onLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    /* 3. STACK — floating hover effect on chips ─── */
    gsap.utils.toArray<HTMLElement>(".chip").forEach((chip) => {
      const onEnter = () =>
        gsap.to(chip, {
          y: -6,
          scale: 1.08,
          duration: 0.3,
          ease: "power2.out",
        });
      const onLeave = () =>
        gsap.to(chip, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      chip.addEventListener("mouseenter", onEnter);
      chip.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        chip.removeEventListener("mouseenter", onEnter);
        chip.removeEventListener("mouseleave", onLeave);
      });
    });

    /* 5. STATS — glow pulse highlight after elastic entry ─── */
    gsap.utils.toArray<HTMLElement>(".stat").forEach((stat, i) => {
      gsap.fromTo(
        stat.querySelector(".stat-num"),
        { textShadow: "0 0 0px rgba(58, 90, 70, 0)" },
        {
          textShadow: "0 0 20px rgba(58, 90, 70, 0.35)",
          duration: 0.6,
          delay: 0.8 + i * 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
      );
    });

    /* 6. SKILLS — hover scale on list items ─── */
    gsap.utils.toArray<HTMLElement>(".skill-cat li").forEach((item) => {
      const onEnter = () =>
        gsap.to(item, {
          scale: 1.04,
          x: 4,
          duration: 0.25,
          ease: "power2.out",
        });
      const onLeave = () =>
        gsap.to(item, {
          scale: 1,
          x: 0,
          duration: 0.25,
          ease: "power2.out",
        });
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      });
    });

    /* 7. PROJECTS — parallax y movement on images with scrub ─── */
    gsap.utils
      .toArray<HTMLElement>(".project-card")
      .forEach((card) => {
        const img = card.querySelector<HTMLElement>(
          ".project-media img",
        );
        if (!img) return;
        gsap.to(img, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -40,
          ease: "none",
        });
      });

    /* 8. TESTIMONIALS — 3D tilt mouse follow ─── */
    gsap.utils.toArray<HTMLElement>(".t-card").forEach((card) => {
      const tiltX = gsap.quickTo(card, "rotationY", {
        duration: 0.4,
        ease: "power3",
      });
      const tiltY = gsap.quickTo(card, "rotationX", {
        duration: 0.4,
        ease: "power3",
      });

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        tiltX(nx * 8);
        tiltY(ny * -8);
      };
      const onLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    /* 9. FOOTER — magnetic social button hover ─── */
    gsap.utils.toArray<HTMLElement>(".social-btn").forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(btn, {
          x: dx,
          y: dy,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    /* 10. SPLITTEXT — per-char reveal on section titles ─── */
    gsap.utils
      .toArray<HTMLElement>(".section-title")
      .forEach((title) => {
        const st = new SplitText(title, { type: "chars,words" });
        if (!st.chars?.length) return;
        gsap.from(st.chars, {
          opacity: 0,
          y: 30,
          rotationX: -40,
          duration: 0.7,
          stagger: 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

    return () => {
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
