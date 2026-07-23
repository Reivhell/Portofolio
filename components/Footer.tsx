"use client";

import {
  Mail,
  Send,
  Download,
  ArrowUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import SpecularButton from "@/components/SpecularButton";

export default function Footer() {
  const [BanjarmasinTime, setBanjarmasinTime] = useState("");
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());

    function tick() {
      try {
        setBanjarmasinTime(
          new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Makassar",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date())
        );
      } catch {
        setBanjarmasinTime("GMT+8");
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as Record<string, unknown>)
      .__lenis as Lenis | null;
    if (lenis) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer id="contact" className="footer">
      <div className="footer-mark" aria-hidden="true">
        David.
      </div>
      <div className="container">
        <div className="footer-top" data-reveal>
          <p className="eyebrow mono footer-eyebrow">08 · Next Step</p>
          <h2 className="footer-title">
            Have a project in mind? Let&apos;s make it{" "}
            <span className="footer-em">real.</span>
          </h2>
          <p className="footer-sub">
            Currently booking new engagements for Q3–Q4 2026. Tell me what
            you&apos;re building — I&apos;ll reply within 24 hours.
          </p>
          <div className="footer-cta">
            <SpecularButton
              size="md"
              baseColor="#F1EFE8"
              tint="#F1EFE8"
              tintOpacity={0.9}
              textColor="#16140E"
              lineColor="#ffffff"
              radius={16}
              className="sb-btn"
              onClick={() => window.open("mailto:hello@adrianvale.dev", "_self")}
            >
              Start a Conversation <Send />
            </SpecularButton>
            <a
              className="btn btn-ghost-dark"
              href="#"
              data-toast="CV download will be available soon."
            >
              <Download /> Download CV
            </a>
          </div>
          <div className="social-row">
            <a
              className="social-btn"
              href="https://github.com/reivhell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a
              className="social-btn"
              href="https://linkedin.com/in/reivhell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a
              className="social-btn"
              href="#"
              aria-label="X / Twitter"
              data-toast="X / Twitter — coming soon."
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
            </a>
            <a
              className="social-btn"
              href="#"
              aria-label="Dribbble"
              data-toast="Dribbble — coming soon."
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg>
            </a>
            <a
              className="social-btn"
              href="mailto:hello@adrianvale.dev"
              aria-label="Email"
            >
              <Mail />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {year ?? "2026"} Ahmad David Alvees &middot; Designed &amp; built
            with intent.
          </p>
          <p className="mono footer-meta">
            Banjarmasin · {BanjarmasinTime || "--:--:--"} LOCAL
          </p>
          <a
            href="#home"
            className="back-top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
          >
            Back to top <ArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
