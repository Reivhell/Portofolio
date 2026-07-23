import {
  Atom,
  Triangle,
  Braces,
  Wind,
  Server,
  Database,
  Network,
  Layers,
  Palette,
  GitBranch,
  Container,
  Rocket,
} from "lucide-react";

const groups = [
  {
    category: "Front-end",
    chips: [
      { label: "React", icon: Atom },
      { label: "Next.js", icon: Triangle },
      { label: "TypeScript", icon: Braces },
      { label: "Tailwind CSS", icon: Wind },
    ],
  },
  {
    category: "Back-end",
    chips: [
      { label: "Node.js", icon: Server },
      { label: "PostgreSQL", icon: Database },
      { label: "GraphQL", icon: Network },
      { label: "Prisma", icon: Layers },
    ],
  },
  {
    category: "Tools & Design",
    chips: [
      { label: "Figma", icon: Palette },
      { label: "Git", icon: GitBranch },
      { label: "Docker", icon: Container },
      { label: "Vercel", icon: Rocket },
    ],
  },
];

export default function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow mono">02 · Toolbox</p>
          <h2 className="section-title">A stack chosen for shipping speed.</h2>
          <p className="section-sub">
            The tools I reach for daily — picked for reliability and a fast path
            from idea to deploy.
          </p>
        </div>
        <div className="stack-list">
          {groups.map((g, i) => (
            <div
              key={g.category}
              className="stack-group"
              data-reveal
              style={{ "--rd": `${i * 0.07}s` } as React.CSSProperties}
            >
              <p className="stack-cat mono">{g.category}</p>
              <ul className="chip-list">
                {g.chips.map((c) => (
                  <li key={c.label} className="chip">
                    <c.icon />
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
