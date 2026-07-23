import { Code, PenTool, Layers, Gauge } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";

const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Marketing sites and web apps that load fast, score high on Core Web Vitals, and feel effortless to use.",
    icon: Code,
  },
  {
    num: "02",
    title: "UI / UX & Product Design",
    desc: "Interfaces designed with systems thinking — from wireframe and prototype to a polished, scalable UI.",
    icon: PenTool,
  },
  {
    num: "03",
    title: "Full-Stack Engineering",
    desc: "End-to-end features: APIs, databases, authentication and the deployment pipelines that keep them live.",
    icon: Layers,
  },
  {
    num: "04",
    title: "Performance & SEO",
    desc: "Audits and optimizations that make products load instantly and rank higher where it counts.",
    icon: Gauge,
  },
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="head-row section-head" data-reveal>
          <div>
            <p className="eyebrow mono">01 · What I Do</p>
            <h2 className="section-title">
              Services built around outcomes, not hours.
            </h2>
          </div>
          <p className="head-note">Max 4 engagements / quarter</p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <BorderGlow
              key={s.num}
              backgroundColor="#FBFAF5"
              borderRadius={24}
              glowColor="142 22 29"
              colors={["#3A5A46", "#A9C4AE", "#2D4936"]}
              glowIntensity={0.5}
              edgeSensitivity={25}
              className="service-card !border-transparent"
            >
              <div
                className="service-card-inner"
                data-reveal
                style={{ "--rd": `${i * 0.07}s` } as React.CSSProperties}
              >
                <div className="service-top">
                  <span className="service-num mono">{s.num}</span>
                  <s.icon />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
