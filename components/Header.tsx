"use client";

import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpecularButton from "@/components/SpecularButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const NAV_ITEMS = ["home", "services", "projects", "skills", "contact"];

function getLenis(): Lenis | null {
  return (window as unknown as Record<string, unknown>).__lenis as Lenis | null;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(NAV_ITEMS);

  const headerRef = useRef<HTMLElement>(null);

  // Direct DOM scroll class toggle — no React re-renders
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      requestAnimationFrame(() => {
        if (!header) return;
        header.classList.toggle("scrolled", (window.scrollY || document.documentElement.scrollTop) > 24);
        ticking = false;
      });
      ticking = true;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      const header = document.getElementById("siteHeader");
      if (header && !header.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuOpen]);

  // Mobile menu focus trap — Tab/Shift+Tab cycle within menu
  useEffect(() => {
    if (!menuOpen) return;
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    menu.addEventListener("keydown", handleTab);
    return () => {
      menu.removeEventListener("keydown", handleTab);
      document.querySelector<HTMLElement>(".menu-toggle")?.focus();
    };
  }, [menuOpen]);

  // --- GSAP entrance + scroll + hover animations ---
  useGSAP((_context, _contextSafe) => {
    const contextSafe = _contextSafe!;
    const header = headerRef.current;
    if (!header) return;

    // Build underline elements inside desktop nav links for the hover slide effect
    const links = header.querySelectorAll<HTMLAnchorElement>(".main-nav .nav-link");
    const underlines: HTMLSpanElement[] = [];

    links.forEach((link) => {
      const ul = document.createElement("span");
      ul.className = "nav-underline";
      ul.setAttribute("aria-hidden", "true");
      link.style.position = "relative";
      link.appendChild(ul);
      underlines.push(ul);
    });

    // Page-load entrance stagger — skip when reduced motion
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.from(".brand", {
        y: -20, autoAlpha: 0, filter: "blur(4px)",
        duration: 0.5, ease: "power3.out",
      });
      gsap.from(".main-nav .nav-link", {
        y: -20, autoAlpha: 0, filter: "blur(4px)",
        stagger: 0.06, duration: 0.45, ease: "power3.out", delay: 0.1,
      });
      gsap.from(".header-actions", {
        y: -20, autoAlpha: 0, filter: "blur(4px)",
        duration: 0.5, ease: "power3.out", delay: 0.35,
      });
    }

    // Scroll-driven header-inner height shrink
    gsap.to(".header-inner", {
      height: 60,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top -40px",
        end: "top -120px",
        scrub: 0.3,
      },
    });

    // Nav-link hover underline slide
    const cleanups: Array<() => void> = [];
    underlines.forEach((ul, i) => {
      const link = links[i];
      if (!link) return;
      const onEnter = contextSafe(() =>
        gsap.to(ul, { scaleX: 1, duration: 0.3, ease: "power2.out", transformOrigin: "left center" })
      );
      const onLeave = contextSafe(() =>
        gsap.to(ul, { scaleX: 0, duration: 0.3, ease: "power2.out", transformOrigin: "right center" })
      );
      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);
      cleanups.push(() => link.removeEventListener("mouseenter", onEnter));
      cleanups.push(() => link.removeEventListener("mouseleave", onLeave));
    });

    return () => {
      cleanups.forEach((fn) => fn());
      underlines.forEach((ul) => ul.remove());
    };
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      id="siteHeader"
      className={`site-header${menuOpen ? " menu-open" : ""}`}
    >
      <div className="header-inner container-wide">
        <a
          href="#home"
          className="brand"
          aria-label="Shezzle — home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("home");
          }}
        >
          Shezzle<span className="brand-dot">.</span>
        </a>

        <nav className="main-nav" aria-label="Primary">
          {NAV_ITEMS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link${activeId === id ? " is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {id === "home"
                ? "Home"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <SpecularButton
            size="sm"
            baseColor="#3A5A46"
            tint="#3A5A46"
            tintOpacity={0.9}
            textColor="#F6F5EF"
            lineColor="#A9C4AE"
            radius={14}
            className="sb-btn-sm max-[940px]:hidden"
            onClick={() => scrollTo("contact")}
          >
            Contact Me <ArrowRight />
          </SpecularButton>
          <button
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="ic-menu" />
            <X className="ic-x" />
          </button>
        </div>
      </div>

      <div className="mobile-menu" id="mobileMenu">
        <nav aria-label="Mobile">
          {NAV_ITEMS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link${activeId === id ? " is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {id === "home"
                ? "Home"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <SpecularButton
          size="md"
          baseColor="#3A5A46"
          tint="#3A5A46"
          tintOpacity={0.9}
          textColor="#F6F5EF"
          lineColor="#A9C4AE"
          radius={16}
          className="sb-btn w-full mt-[18px]"
          onClick={() => scrollTo("contact")}
        >
          Contact Me <ArrowRight />
        </SpecularButton>
      </div>
    </header>
  );
}
