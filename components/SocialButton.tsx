import type { ReactNode } from "react";

interface SocialButtonProps {
  href: string;
  label: string;
  children: ReactNode;
}

export default function SocialButton({ href, label, children }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full text-white/35 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {children}
    </a>
  );
}
