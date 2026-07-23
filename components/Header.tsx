"use client";

import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import SpecularButton from "@/components/SpecularButton";

const NAV_ITEMS = ["home", "services", "projects", "skills", "contact"];

function getLenis(): Lenis | null {
  return (window as unknown as Record<string, unknown>).__lenis as Lenis | null;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(NAV_ITEMS);

  useEffect(() => {
    function onScroll() {
      setScrolled((window.scrollY || document.documentElement.scrollTop) > 24);
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

  return (
    <header
      id="siteHeader"
      className={`site-header${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
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
