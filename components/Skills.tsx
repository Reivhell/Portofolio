import {
  MonitorSmartphone,
  Server,
  PenTool,
  Database,
  Palette,
} from "lucide-react";

const categories = [
  {
    title: "Front-end",
    icon: MonitorSmartphone,
    skills: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Motion Design (GSAP)",
      "Accessibility (WCAG 2.2)",
    ],
  },
  {
    title: "Back-end",
    icon: Server,
    skills: [
      "Node.js & Express",
      "REST & GraphQL APIs",
      "Auth & Session Security",
      "Testing & CI/CD",
    ],
  },
  {
    title: "UI / UX",
    icon: PenTool,
    skills: [
      "Design Systems",
      "Wireframes & Prototypes",
      "User Flows & Research",
      "Interaction Design",
    ],
  },
  {
    title: "Database & API",
    icon: Database,
    skills: [
      "PostgreSQL",
      "Prisma & Redis",
      "Data Modeling",
      "Third-party Integrations",
    ],
  },
  {
    title: "Design Tools",
    icon: Palette,
    skills: ["Figma & Dev Mode", "Framer", "Illustrator", "Notion & Linear"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow mono">05 · Capabilities</p>
          <h2 className="section-title">Depth where it counts.</h2>
          <p className="section-sub">
            A broad toolkit, organized by where it actually gets used on a real
            project.
          </p>
        </div>
        <div className="skills-grid">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="skill-cat"
              data-reveal
              style={
                { "--rd": `${i % 3 === 2 ? 0.14 : i % 3 === 1 ? 0.07 : 0}s` } as React.CSSProperties
              }
            >
              <h3>
                <cat.icon />
                {cat.title}
              </h3>
              <ul>
                {cat.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
