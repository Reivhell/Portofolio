"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-toast]");
      if (!target) return;
      e.preventDefault();
      const text = (target as HTMLElement).getAttribute("data-toast");
      if (!text) return;
      setMsg(text);
      setVisible(true);
      clearTimeout(timer.current);
    }

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
      clearTimeout(timer.current);
    };
  }, []);

  // --- GSAP entrance/exit animation ---
  useGSAP(() => {
    if (!visible || !msg) return;

    const el = toastRef.current;
    if (!el) return;

    // Disable CSS transition so GSAP is in full control
    gsap.set(el, { transition: "none" });

    gsap.timeline({ onComplete: () => setVisible(false) })
      .fromTo(el,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }
      )
      .to(el, { y: -12, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "+=2.2");
  }, { dependencies: [visible, msg], revertOnUpdate: true });

  return (
    <div
      ref={toastRef}
      className={`toast mono${visible ? " show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {msg}
    </div>
  );
}
