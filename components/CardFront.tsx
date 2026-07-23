"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CardFrontProps {
  avatarUrl?: string;
  name: string;
  role?: string;
  location?: string;
  timezone?: string;
  onContactClick?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return [parts[0] ?? name, ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CardFront({
  avatarUrl,
  name,
  role = "Software Engineer",
  location = "Remote",
  timezone = "GMT+8",
  onContactClick,
}: CardFrontProps) {
  const [first, last] = splitName(name);
  const initials = getInitials(name);

  const handleContact = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onContactClick?.();
    },
    [onContactClick],
  );

  return (
    <motion.div
      className="relative flex h-full w-full flex-col"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Floating code chip ─── */}
      <motion.div
        className="absolute left-8 top-7 z-20"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Badge
          variant="outline"
          className="border-accent/20 bg-accent/5 font-mono text-[11px] tracking-wide text-accent"
        >
          <span className="mr-1 inline-block size-1.5 rounded-full bg-accent opacity-70" />
          &lt;/&gt;
        </Badge>
      </motion.div>

      {/* ─── Radial gradient blob behind portrait ─── */}
      <div
        className="pointer-events-none absolute right-[-40px] top-[100px] size-[260px] opacity-25"
        aria-hidden="true"
      >
        <motion.div
          className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,var(--accent-tint),transparent_65%)]"
          animate={{ scale: [1, 1.12, 1], x: [0, 8, 0], y: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ─── Content — left side ─── */}
      <div className="relative z-10 flex flex-1 flex-col px-8 pt-[68px]">
        {/* Greeting */}
        <motion.p
          className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-text-3"
          variants={fadeUp}
        >
          Hello I&apos;m
        </motion.p>

        {/* Name */}
        <motion.div
          className="mt-3 leading-[0.92] tracking-[-0.035em]"
          variants={fadeUp}
        >
          {first && (
            <h1 className="font-heading text-[42px] font-bold text-text-1">
              {first}
            </h1>
          )}
          {last && (
            <h1 className="mt-1 font-heading text-[42px] font-bold text-accent">
              {last}
            </h1>
          )}
        </motion.div>

        {/* Role */}
        <motion.p
          className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-text-3"
          variants={fadeUp}
        >
          {role}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-5 h-px w-8 bg-border"
          variants={fadeUp}
          style={{ transformOrigin: "left" }}
        />

        {/* Description */}
        <motion.p
          className="mt-4 max-w-[20ch] font-sans text-[13px] leading-[1.7] text-text-2"
          variants={fadeUp}
        >
          Design-minded engineer building performant, polished digital products
          with clean architecture.
        </motion.p>

        <div className="flex-1" />

        {/* ─── Status cards ─── */}
        <motion.div
          className="flex flex-wrap gap-2.5 pb-[88px]"
          variants={fadeUp}
        >
          <motion.div
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2"
            style={{ boxShadow: "var(--shadow-flat)" }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <MapIcon />
            <span className="font-sans text-[11px] font-semibold text-text-1">
              {location}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2"
            style={{ boxShadow: "var(--shadow-flat)" }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <GlobeIcon />
            <span className="font-sans text-[11px] font-semibold text-text-1">
              {timezone}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/5 px-3.5 py-2"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="font-sans text-[11px] font-semibold text-accent">
              Available
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Portrait ─── */}
      <motion.div
        className="absolute right-[-24px] top-[120px] z-[5]"
        initial={{ opacity: 0, scale: 0.85, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 scale-110 rounded-full bg-[radial-gradient(ellipse_at_35%_35%,var(--accent-tint),transparent_70%)]" />
          <div className="relative size-[170px] overflow-hidden rounded-full border-2 border-surface shadow-[var(--shadow-card)]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sunken font-heading text-3xl font-bold text-accent">
                {initials}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Floating Contact Panel ─── */}
      <motion.div
        className="absolute -bottom-[22px] left-4 right-4 z-20 overflow-hidden rounded-2xl border border-border bg-card/80 px-4 py-3.5 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-card)" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.45,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Mini avatar */}
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-border">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sunken text-xs font-semibold text-text-3">
                {initials}
              </div>
            )}
          </div>

          {/* Name + Online */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[13px] font-semibold text-text-1">
              {name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-[10px] font-semibold text-accent">
                Online
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleContact}
            className="group flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-accent-hover hover:translate-y-[-1px]"
            style={{ boxShadow: "var(--shadow-cta)" }}
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MapIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
