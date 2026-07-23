"use client";

import { useState, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import CardFront from "@/components/CardFront";
import CardBack from "@/components/CardBack";

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

  // ─── Flip rotation as a spring (for smooth cross-browser animation) ───
  const flipRotateY = useSpring(0, {
    stiffness: 200,
    damping: 25,
    mass: 0.8,
  });

  useEffect(() => {
    flipRotateY.set(isFlipped ? 180 : 0);
  }, [isFlipped, flipRotateY]);

  // ─── Combined transform as a SINGLE CSS property ───
  // Firefox doesn't handle individual properties (rotateX, scale) correctly
  // with transform-style: preserve-3d. A single transform string works everywhere.
  const cardTransform = useTransform(
    [tiltX, tiltY, flipRotateY, hoverScale],
    ([rx, ry, flip, s]: number[]) => {
      const rxEff = prefersReducedMotion || isFlipped ? 0 : rx;
      const ryEff = prefersReducedMotion || isFlipped ? 0 : ry;
      return `rotateX(${rxEff}deg) rotateY(${ryEff + flip}deg) scale(${s})`;
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
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </motion.div>
  );
}
