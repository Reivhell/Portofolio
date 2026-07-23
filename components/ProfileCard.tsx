"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import CardFront from "@/components/CardFront";
import CardBack from "@/components/CardBack";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export interface ProfileCardProps {
  avatarUrl?: string;
  name: string;
  role?: string;
  location?: string;
  timezone?: string;
  quote?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  twitterUrl?: string;
  onContactClick?: () => void;
  className?: string;
}

export default function ProfileCard({
  avatarUrl,
  name,
  role,
  location,
  timezone,
  quote,
  skills,
  githubUrl,
  linkedinUrl,
  email,
  twitterUrl,
  onContactClick,
  className = "",
}: ProfileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ─── Mouse parallax values ───
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const tiltX = useTransform(smoothY, [0, 1], [4, -4]);
  const tiltY = useTransform(smoothX, [0, 1], [-4, 4]);

  // Hover scale
  const hoverScale = useSpring(1, { stiffness: 400, damping: 30 });

  // ─── Flip orchestrated via per-property GSAP tweens ───
  // Each property gets its own proxy + ease curve, eliminating
  // the linear segment stiffness of useTransform keyframes.
  const roty = useRef({ v: 0 }).current;
  const posx = useRef({ v: 0 }).current;
  const posy = useRef({ v: 0 }).current;
  const sc = useRef({ v: 1 }).current;
  const tiltx = useRef({ v: 0 }).current;
  const rev = useRef({ v: 0 }).current;

  // Motion values updated by GSAP on every frame
  const flipRotateY = useMotionValue(0);
  const flipX = useMotionValue(0);
  const flipY = useMotionValue(0);
  const flipScale = useMotionValue(1);
  const flipTiltX = useMotionValue(0);
  const backReveal = useMotionValue(0);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      flipRotateY.set(isFlipped ? 180 : 0);
      flipX.set(0); flipY.set(0); flipScale.set(1); flipTiltX.set(0);
      backReveal.set(isFlipped ? 1 : 0);
      return;
    }

    // Sync proxies to current motion values (for smooth interrupt)
    roty.v = flipRotateY.get();
    posx.v = flipX.get();
    posy.v = flipY.get();
    sc.v = flipScale.get();
    tiltx.v = flipTiltX.get();
    rev.v = backReveal.get();

    tlRef.current?.kill();

    function sync() {
      flipRotateY.set(roty.v);
      flipX.set(posx.v);
      flipY.set(posy.v);
      flipScale.set(sc.v);
      flipTiltX.set(tiltx.v);
      backReveal.set(rev.v);
    }

    const tl = gsap.timeline({ onUpdate: sync });

    if (isFlipped) {
      // ── Phase 1: Anticipation (0→0.35s) — slow withdraw ──
      tl.to(roty,  { v: -15, duration: 0.35, ease: "power3.out" }, 0);
      tl.to(posx,  { v: -20, duration: 0.35, ease: "power3.out" }, 0);
      tl.to(posy,  { v: -5,  duration: 0.35, ease: "power3.out" }, 0);
      tl.to(sc,    { v: 0.97,duration: 0.35, ease: "power3.out" }, 0);
      tl.to(tiltx, { v: -4,  duration: 0.35, ease: "power3.out" }, 0);

      // ── Phase 2: Main flip (0.35→1.1s) — smooth arc ──
      tl.to(roty,  { v: 178, duration: 0.75, ease: "power3.inOut" }, 0.35);
      tl.to(posx,  { v: 28,  duration: 0.75, ease: "power3.inOut" }, 0.35);
      tl.to(posy,  { v: -14, duration: 0.75, ease: "power3.inOut" }, 0.35);
      tl.to(sc,    { v: 1.08,duration: 0.75, ease: "power3.inOut" }, 0.35);
      tl.to(tiltx, { v: 5,   duration: 0.75, ease: "power3.inOut" }, 0.35);

      // ── Back content reveal (0.7→1.1s) ──
      tl.to(rev,   { v: 1,   duration: 0.4,  ease: "power2.out" }, 0.7);

      // ── Phase 3: Settle (1.1→1.5s) — soft bounce landing ──
      tl.to(roty,  { v: 180, duration: 0.4,  ease: "back.out(1.15)" }, 1.1);
      tl.to(posx,  { v: 0,   duration: 0.4,  ease: "back.out(1.15)" }, 1.1);
      tl.to(posy,  { v: 0,   duration: 0.4,  ease: "back.out(1.15)" }, 1.1);
      tl.to(sc,    { v: 1,   duration: 0.4,  ease: "back.out(1.15)" }, 1.1);
      tl.to(tiltx, { v: 0,   duration: 0.4,  ease: "back.out(1.15)" }, 1.1);
    } else {
      // ── Reverse flip (faster, snappier return) ──
      tl.to(rev,   { v: 0,   duration: 0.15, ease: "power2.in" }, 0);
      tl.to(roty,  { v: 0,   duration: 0.5,  ease: "power3.inOut" }, 0);
      tl.to(posx,  { v: 0,   duration: 0.5,  ease: "power3.out" }, 0);
      tl.to(posy,  { v: 0,   duration: 0.5,  ease: "power3.out" }, 0);
      tl.to(sc,    { v: 1,   duration: 0.5,  ease: "power3.out" }, 0);
      tl.to(tiltx, { v: 0,   duration: 0.5,  ease: "power3.out" }, 0);
    }

    tlRef.current = tl;
  }, [isFlipped, prefersReducedMotion]);

  // ─── Combined transform as a SINGLE CSS property ───
  // Firefox doesn't handle individual properties (rotateX, scale) correctly
  // with transform-style: preserve-3d. A single transform string works everywhere.
  const cardTransform = useTransform(
    [tiltX, tiltY, hoverScale, flipX, flipY, flipRotateY, flipScale, flipTiltX],
    ([rx, ry, s, fx, fy, fry, fs, ftx]: number[]) => {
      const rxEff = prefersReducedMotion || isFlipped ? 0 : rx;
      const ryEff = prefersReducedMotion || isFlipped ? 0 : ry;
      return [
        `translateX(${fx}px)`,
        `translateY(${fy}px)`,
        `rotateX(${rxEff + ftx}deg)`,
        `rotateY(${ryEff + fry}deg)`,
        `scale(${s * fs})`,
      ].join(" ");
    },
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isFlipped || prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [isFlipped, prefersReducedMotion],
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsHovered(true);
    hoverScale.set(1.02);
  }, [prefersReducedMotion, hoverScale]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    hoverScale.set(1);
    setIsHovered(false);
  }, []);

  const handleFlip = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsFlipped((f) => !f);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip],
  );

  const sweepSpotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion || !sweepSpotRef.current) return;

    const el = sweepSpotRef.current;
    const entryWrapper = el.parentElement?.parentElement;
    if (!entryWrapper) return;

    // Cursor-following quickTo setters (smooth follow-behind)
    const toX = gsap.quickTo(el, "x", {
      duration: 0.6,
      ease: "power2.out",
    });
    const toY = gsap.quickTo(el, "y", {
      duration: 0.6,
      ease: "power2.out",
    });
    const toOpacity = gsap.quickTo(el, "opacity", {
      duration: 0.3,
    });

    const onMove = (e: PointerEvent) => {
      const rect = entryWrapper.getBoundingClientRect();
      toX(e.clientX - rect.left - 60);
      toY(e.clientY - rect.top - 60);
      toOpacity(1);
    };

    const onLeave = () => toOpacity(0);

    entryWrapper.addEventListener("pointermove", onMove);
    entryWrapper.addEventListener("pointerleave", onLeave);

    return () => {
      entryWrapper.removeEventListener("pointermove", onMove);
      entryWrapper.removeEventListener("pointerleave", onLeave);
    };
  }, {
    scope: sweepSpotRef,
    dependencies: [prefersReducedMotion],
    revertOnUpdate: true,
  });

  return (
    <motion.div
      className={`relative mx-auto w-full aspect-[420/650] max-w-[420px] max-h-[90dvh] ${className}`}
      style={{ perspective: prefersReducedMotion ? undefined : 1600 }}
    >
      {/* ─── Entry animation wrapper (OUTSIDE the 3D chain so opacity
           doesn't flatten preserve-3d in Firefox) ─── */}
      <motion.div
        className="h-full w-full"
        initial={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 24, scale: 0.97 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          mass: 0.9,
        }}
      >
      {/* ─── Reflection sweep (z-10, outside 3D chain) ─── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[28px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(241,239,232,0.5) 38%, rgba(251,250,245,0.7) 44%, rgba(241,239,232,0.5) 50%, transparent 58%)",
          }}
          initial={{ x: "-120%" }}
          animate={isHovered ? { x: "220%" } : { x: "-120%" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* GSAP cursor-follow highlight */}
        <div
          ref={sweepSpotRef}
          className="absolute size-[120px] rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(241,239,232,0.45) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ─── Card body — single element, single transform, Firefox-safe ─── */}
      <motion.div
        className="relative h-full w-full rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          // Single transform property — works in ALL browsers with preserve-3d
          transform: cardTransform,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={
          isFlipped
            ? "Press Enter or Space to flip to front"
            : "Press Enter or Space to flip to back"
        }
      >
        {/* ─── FRONT FACE ─── */}
        {/*
          Explicit rotateY(0deg) is REQUIRED for Firefox.
          Firefox needs the element itself to have a 3D transform
          for backface-visibility: hidden to work — it doesn't
          inherit the parent's rotation for backface calculation.
        */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="relative h-full w-full" style={{ borderRadius: 28 }}>
            <div
              className="absolute inset-0 overflow-hidden rounded-[28px] border border-border bg-card"
              style={{
                boxShadow:
                  "var(--shadow-card), 0 0 0 1px var(--hairline)",
              }}
            />
            <div className="relative h-full w-full">
              <CardFront
                avatarUrl={avatarUrl}
                name={name}
                role={role}
                location={location}
                timezone={timezone}
                onContactClick={onContactClick}
              />
            </div>
          </div>
        </div>

        {/* ─── BACK FACE ─── */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative h-full w-full" style={{ borderRadius: 28 }}>
            <div
              className="absolute inset-0 overflow-hidden rounded-[28px] border border-border bg-card"
              style={{
                boxShadow:
                  "var(--shadow-card), 0 0 0 1px var(--hairline)",
              }}
            />
            <div className="relative h-full w-full">
              <CardBack
                avatarUrl={avatarUrl}
                name={name}
                role={role}
                quote={quote}
                skills={skills}
                githubUrl={githubUrl}
                linkedinUrl={linkedinUrl}
                email={email}
                twitterUrl={twitterUrl}
                revealProgress={prefersReducedMotion ? undefined : backReveal}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </motion.div>
  );
}
