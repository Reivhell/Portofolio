"use client";

import { Play, Pause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import TiltedCard from "./TiltedCard";

const DURATION = 222; // seconds

function fmt(s: number) {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + 0.25;
        return next >= DURATION ? 0 : next;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  const seek = useCallback((clientX: number) => {
    const el = document.getElementById("progress");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setT(p * DURATION);
  }, []);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      setT((v) => Math.min(DURATION, v + 5));
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      setT((v) => Math.max(0, v - 5));
      e.preventDefault();
    }
  }

  const pct = (t / DURATION) * 100;

  return (
    <section id="music" className="section">
      <div className="container-narrow">
        <div className="section-head center" data-reveal>
          <p className="eyebrow mono">03 · On Rotation</p>
          <h2 className="section-title">Fuel for deep work</h2>
          <p className="section-sub">
            The lo-fi rotation that keeps focus steady through long build
            sessions.
          </p>
        </div>
        <div className="music-card" data-reveal>
          <div className={`player${playing ? " playing" : ""}`} id="player">
            <div className="album-wrap">
              <TiltedCard
                imageSrc="/image/Song.webp"
                altText="Album - Being Funny In Foreign Language"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                captionText="🎵 The 1975"
                showMobileWarning={false}
                showTooltip={true}
                scaleOnHover={1.05}
                rotateAmplitude={10}
              />
            </div>
            <div className="player-main">
              <div className="track-row">
                <div>
                  <p className="track-title">Quiet Hours</p>
                  <p className="track-artist">Analog Desk — Deep Focus Mix</p>
                </div>
                <div className="eq" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div
                className="progress"
                id="progress"
                role="slider"
                tabIndex={0}
                aria-label="Seek track"
                aria-valuemin={0}
                aria-valuemax={DURATION}
                aria-valuenow={Math.round(t)}
                onClick={(e) => seek(e.clientX)}
                onKeyDown={onKey}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${pct.toFixed(2)}%` }}
                />
              </div>

              <div className="time-row mono">
                <span>{fmt(t)}</span>
                <span>{fmt(DURATION)}</span>
              </div>

              <div className="player-controls">
                <button
                  className="play-btn"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((v) => !v)}
                >
                  <Play className="ic-play" />
                  <Pause className="ic-pause" />
                </button>
                <span className="mono now-label">LO-FI · CHILL · 82 BPM</span>
              </div>
            </div>
          </div>
          <p className="music-note mono">
            PLACEHOLDER PLAYER — FULL SPOTIFY EMBED ON PRODUCTION BUILD
          </p>
        </div>
      </div>
    </section>
  );
}
