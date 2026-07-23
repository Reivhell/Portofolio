interface AnimatedBadgeProps {
  label: string;
}

export default function AnimatedBadge({ label }: AnimatedBadgeProps) {
  return (
    <span className="text-[13px] leading-relaxed text-white/35">
      {label}
    </span>
  );
}
