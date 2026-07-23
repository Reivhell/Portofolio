"use client";

import { useEffect, useRef, useState } from "react";

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

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
      timer.current = setTimeout(() => setVisible(false), 2600);
    }

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={`toast mono${visible ? " show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {msg}
    </div>
  );
}
