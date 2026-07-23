"use client";

import { useRef } from "react";
import { motion, useReducedMotion, type MotionValue } from "motion/react";
import { Globe, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

interface CardBackProps {
  avatarUrl?: string;
  name: string;
  role?: string;
  quote?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  twitterUrl?: string;
  revealProgress?: MotionValue<number>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const DEFAULT_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Laravel",
  "ShadCN",
  "Tailwind CSS"
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CardBack({
  avatarUrl,
  name,
  role = "Software Engineer",
  quote = "Building beautiful, performant digital experiences with modern tools and clean architecture.",
  skills = DEFAULT_SKILLS,
  githubUrl,
  linkedinUrl,
  email,
  twitterUrl,
  revealProgress,
}: CardBackProps) {
  const initials = getInitials(name);
  const cardRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !cardRef.current || !skillsRef.current) return;

    // Skill badges elastic settle (continuous subtle bob)
    const badges = skillsRef.current.querySelectorAll("[data-gsap-badge]");
    if (badges.length) {
      gsap.to(badges, {
        y: -4,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
        stagger: { each: 0.1, from: "random" },
        repeat: -1,
        yoyo: true,
        repeatDelay: 4,
      });
    }

    // Mouse-follow tilt on hover
    const toRotX = gsap.quickTo(cardRef.current, "rotationX", {
      duration: 0.4,
      ease: "power2.out",
    });
    const toRotY = gsap.quickTo(cardRef.current, "rotationY", {
      duration: 0.4,
      ease: "power2.out",
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = cardRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      toRotX((y - 0.5) * -8);
      toRotY((x - 0.5) * 8);
    };

    const onPointerLeave = () => {
      toRotX(0);
      toRotY(0);
    };

    cardRef.current.addEventListener("pointermove", onPointerMove);
    cardRef.current.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cardRef.current?.removeEventListener("pointermove", onPointerMove);
      cardRef.current?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, { scope: cardRef, dependencies: [prefersReducedMotion], revertOnUpdate: true });

  return (
    <motion.div
      ref={cardRef}
      className="relative flex h-full w-full flex-col items-center px-8 pb-10 pt-12"
      variants={stagger}
      initial="hidden"
      animate="visible"
      style={{ opacity: revealProgress }}
    >
      {/* ─── Avatar (ring expands on hover) ─── */}
      <motion.div variants={fadeUp}>
        <div className="size-[76px] overflow-hidden rounded-full border-2 border-border bg-surface ring-2 ring-transparent transition-all duration-300 hover:border-accent/40 hover:ring-accent/15">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sunken text-base font-semibold text-text-3">
              {initials}
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Name & Role ─── */}
      <motion.div className="mt-5 text-center" variants={fadeUp}>
        <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] text-text-1">
          {name}
        </h3>
        <p className="mt-[3px] font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">
          {role}
        </p>
      </motion.div>

      {/* ─── Divider ─── */}
      <motion.div
        className="my-5 h-px w-8 bg-border"
        variants={fadeUp}
        style={{ transformOrigin: "center" }}
      />

      {/* ─── Quote ─── */}
      <motion.p
        className="max-w-[28ch] text-center font-sans text-[12.5px] leading-relaxed italic text-text-3"
        variants={fadeUp}
      >
        &ldquo;{quote}&rdquo;
      </motion.p>

      {/* ─── Skills as shadcn Badges ─── */}
      <motion.div
        ref={skillsRef}
        className="mt-6 flex flex-wrap justify-center gap-2.5"
        variants={stagger}
      >
        {skills.map((skill) => (
          <motion.div key={skill} variants={fadeUp}>
            <Badge
              variant="outline"
              className="border-border bg-surface px-3.5 py-1.5 font-sans text-[11px] font-semibold text-text-2 transition-all duration-200 hover:border-accent/30 hover:text-accent hover:shadow-[0_0_16px_rgba(58,90,70,0.1)] hover:scale-105"
              data-gsap-badge
            >
              {skill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex-1" />

      {/* ─── Stats row ─── */}
      <motion.div
        className="mb-6 flex w-full justify-center gap-12"
        variants={fadeUp}
      >
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-text-1">15+</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-text-3">
            Projects
          </p>
        </div>
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-text-1">8+</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-text-3">
            Years
          </p>
        </div>
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-text-1">20+</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-text-3">
            Clients
          </p>
        </div>
      </motion.div>

      {/* ─── Divider ─── */}
      <motion.div
        className="mb-6 h-px w-full bg-border"
        variants={fadeUp}
        style={{ transformOrigin: "center" }}
      />

      {/* ─── Social (circular, glass, hover glow/rotate/scale) ─── */}
      <motion.div className="flex items-center gap-3" variants={fadeUp}>
        {githubUrl && (
          <SocialLink href={githubUrl} label="GitHub profile">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px]" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </SocialLink>
        )}
        {linkedinUrl && (
          <SocialLink href={linkedinUrl} label="LinkedIn profile">
            <Globe className="size-[16px]" aria-hidden="true" />
          </SocialLink>
        )}
        {email && (
          <SocialLink href={`mailto:${email}`} label="Send email">
            <Mail className="size-[16px]" aria-hidden="true" />
          </SocialLink>
        )}
        {twitterUrl && (
          <SocialLink href={twitterUrl} label="X / Twitter profile">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px]" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialLink>
        )}
      </motion.div>
    </motion.div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-3 transition-all duration-200 hover:scale-110 hover:rotate-[-8deg] hover:border-accent/30 hover:text-accent hover:shadow-[0_0_16px_rgba(58,90,70,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {children}
    </a>
  );
}
