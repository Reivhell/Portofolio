"use client";

import { useReveal } from "@/hooks/useReveal";
import { useSectionAnimations } from "@/hooks/useSectionAnimations";

export default function RevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useReveal();
  useSectionAnimations();
  return <>{children}</>;
}
