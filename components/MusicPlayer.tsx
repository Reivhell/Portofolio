"use client";

import { Play, Pause } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TiltedCard from "./TiltedCard";

const FALLBACK_DURATION = 222; // seconds, before metadata loads

function fmt(s: number) {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync play/pause state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  // Track real audio time, duration, and end-of-track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setT(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || FALLBACK_DURATION);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const playerRef = useRef<HTMLDivElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!eqRef.current || !btnRef.current) return;
      const bars = eqRef.current.querySelectorAll<HTMLElement>("span");
      if (!bars.length) return;

      if (playing) {
        gsap.to(bars, {
          scaleY: 1.8,
          duration: 0.45,
          stagger: { each: 0.12, from: "random" },
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(btnRef.current, {
          boxShadow: "0 0 20px rgba(58, 90, 70, 0.35)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      } else {
        gsap.to(bars, {
          scaleY: 0.35,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
        });
        gsap.killTweensOf(btnRef.current);
        gsap.to(btnRef.current, {
          boxShadow: "0 4px 14px -6px rgba(58, 90, 70, 0.40)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [playing] },
  );

  const seek = useCallback((clientX: number) => {
    const el = document.getElementById("progress");
    if (!el || !audioRef.current) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    audioRef.current.currentTime = p * audioRef.current.duration;
  }, []);

  function onKey(e: React.KeyboardEvent) {
    if (!audioRef.current) return;
    if (e.key === "ArrowRight") {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 5,
      );
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5,
      );
      e.preventDefault();
    }
  }

  const pct = duration ? (t / duration) * 100 : 0;

  return (
    <section id="music" className="section">
      <div className="container-narrow">
        <div className="section-head center" data-reveal>
          <p className="eyebrow mono">03 · On Rotation</p>
          <h2 className="section-title">Fuel for deep work</h2>
          <p className="section-sub">
            The song rotation that keeps focus steady through long build
            sessions.
          </p>
        </div>
        <div className="music-card" data-reveal>
          <div
            className={`player${playing ? " playing" : ""}`}
            id="player"
            ref={playerRef}
          >
            <div className="album-wrap">
              <TiltedCard
                imageSrc="/image/Song.webp"
                altText="Album — Being Funny In A Foreign Language"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                captionText="🎵 The 1975"
                showMobileWarning={false}
                showTooltip={true}
                scaleOnHover={1.15}
                rotateAmplitude={45}
              />
            </div>
            <div className="player-main">
              <div className="track-row">
                <div>
                  <p className="track-title">About You</p>
                  <p className="track-artist">The 1975</p>
                </div>
                <div className="eq" aria-hidden="true" ref={eqRef}>
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
                aria-valuemax={Math.round(duration)}
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
                <span>{fmt(duration)}</span>
              </div>

              <div className="player-controls">
                <button
                  ref={btnRef}
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
            <audio
              ref={audioRef}
              src="/music/The 1975 - About You.flac"
              preload="metadata"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
