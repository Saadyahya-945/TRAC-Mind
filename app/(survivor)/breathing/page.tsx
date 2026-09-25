"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./breathing.module.css";
import { useTranslation } from "@/lib/i18n";

type Phase = "ready" | "inhale" | "hold1" | "exhale" | "hold2";

export default function BreathingPage() {
  const { lang, t } = useTranslation();

  const PHASES: { phase: Phase; label: string; duration: number; next: Phase }[] = [
    { phase: "inhale", label: lang === "hi" ? "सांस अंदर लें" : lang === "mr" ? "श्वास आत घ्या" : "Breathe in",  duration: 4, next: "hold1"  },
    { phase: "hold1",  label: lang === "hi" ? "रोककर रखें" : lang === "mr" ? "थांबवा" : "Hold", duration: 7, next: "exhale" },
    { phase: "exhale", label: lang === "hi" ? "सांस बाहर छोड़ें" : lang === "mr" ? "श्वास सोडा" : "Breathe out", duration: 8, next: "hold2"  },
    { phase: "hold2",  label: lang === "hi" ? "विश्राम व रोकें" : lang === "mr" ? "विश्रांती घ्या" : "Rest & hold", duration: 4, next: "inhale" },
  ];
  const [running, setRunning]    = useState(false);
  const [paused, setPaused]      = useState(false);
  const [phase, setPhase]        = useState<Phase>("ready");
  const [seconds, setSeconds]    = useState(0);
  const [cycles, setCycles]      = useState(0);
  const [phaseIdx, setPhaseIdx]  = useState(0);

  const currentPhase = phase === "ready" ? null : PHASES[phaseIdx];

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhase(PHASES[next].phase);
      setSeconds(PHASES[next].duration);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running || paused || phase === "ready") return;
    if (seconds <= 0) {
      advancePhase();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, paused, phase, seconds, advancePhase]);

  function start() {
    setPhaseIdx(0);
    setPhase(PHASES[0].phase);
    setSeconds(PHASES[0].duration);
    setCycles(0);
    setPaused(false);
    setRunning(true);
  }

  function pause() {
    setPaused(true);
  }

  function resume() {
    setPaused(false);
  }

  function stop() {
    setRunning(false);
    setPaused(false);
    setPhase("ready");
  }

  function reset() {
    setRunning(false);
    setPaused(false);
    setPhase("ready");
    setSeconds(0);
    setCycles(0);
    setPhaseIdx(0);
  }

  const phaseData = currentPhase ?? { label: "Ready", duration: 0 };

  const circleScale =
    paused ? 1.1 :
    phase === "inhale" ? 1.25 :
    phase === "hold1" ? 1.25 :
    phase === "exhale" ? 1 : 1;

  const circleColor =
    paused ? "var(--risk-medium)" :
    phase === "inhale" ? "var(--brand)" :
    phase === "hold1"  ? "var(--brand-light)" :
    phase === "exhale" ? "var(--ink-faint)" :
    "var(--border)";

  return (
    <div className={`${styles.page} animate-fade-in`}>
      {/* Back button */}
      <div className={styles.topNavRow}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          {t.backHome}
        </Link>
      </div>

      <div className={styles.breathingCard}>
        <div className={styles.intro}>
          <h1 className="text-h1 text-serif">{t.quickBreatheTitle}</h1>
          <p className="text-body text-muted" style={{ marginTop: "var(--sp-2)" }}>
            {lang === "hi"
              ? "यह आपकी घबराहट को शांत करता है और नाड़ी को स्थिर करता है। वृत्त के अनुसार धीरे-धीरे सांस लें।"
              : lang === "mr"
              ? "हे तुमची अस्वस्थता शांत करते आणि नाडी स्थिर करते. वर्तुळाच्या गतीनुसार श्वास घ्या."
              : "Calms your nervous system and steadies your pulse. Follow the circle at your own pace."}
          </p>
        </div>

        {/* Breathing Circle Container */}
        <div className={styles.circleContainer} aria-live="polite" aria-atomic="true">
          <div
            className={styles.circleOuter}
            style={{
              transform: `scale(${circleScale})`,
              borderColor: circleColor,
              transition: paused
                ? "none"
                : `transform ${phaseData.duration ?? 0}s ease-in-out, border-color 0.6s ease`,
            }}
          >
            <div
              className={styles.circleInner}
              style={{ background: `radial-gradient(circle, ${circleColor}22 0%, transparent 70%)` }}
            >
              <div className={styles.phaseLabel}>
                {paused ? "Paused" : phaseData.label}
              </div>

              {running && !paused && (
                <div className={styles.phaseCount} aria-label={`${seconds} seconds`}>
                  {seconds}
                </div>
              )}

              {paused && (
                <div className={styles.phaseCount} style={{ fontSize: "1.25rem", color: "var(--risk-medium)" }}>
                  Take your time
                </div>
              )}

              {!running && (
                <div className={styles.phaseCount} style={{ fontSize: "0.9375rem", color: "var(--ink-muted)" }}>
                  Tap Begin below
                </div>
              )}
            </div>
          </div>

          {/* Ripple rings */}
          {running && !paused && (
            <>
              <div className={styles.ripple1} style={{ borderColor: circleColor }} />
              <div className={styles.ripple2} style={{ borderColor: circleColor }} />
            </>
          )}
        </div>

        {/* Cycle count */}
        {running && (
          <div className={styles.cycleCount} aria-label={`${cycles} cycles completed`}>
            Cycles completed: <strong>{cycles}</strong>
          </div>
        )}

        {/* Controls: Start, Pause, Resume, Stop, Reset (Req 15) */}
        <div className={styles.controls}>
          {!running ? (
            <button className="btn btn-primary btn-lg" onClick={start} style={{ minWidth: "180px" }}>
              {lang === "hi" ? "व्यायाम शुरू करें" : lang === "mr" ? "सुरू करा" : "Begin Breathing"}
            </button>
          ) : (
            <div className={styles.runningBtns}>
              {paused ? (
                <button className="btn btn-primary" onClick={resume}>
                  ▶ {lang === "hi" ? "जारी रखें" : lang === "mr" ? "सुरू ठेवा" : "Resume"}
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={pause}>
                  ⏸ {lang === "hi" ? "रोकें" : lang === "mr" ? "थांबवा" : "Pause"}
                </button>
              )}
              <button className="btn btn-secondary" onClick={stop}>
                ⏹ {lang === "hi" ? "समाप्त करें" : lang === "mr" ? "बंद करा" : "Stop"}
              </button>
              <button className="btn btn-ghost" onClick={reset} title="Reset cycles">
                🔄 {lang === "hi" ? "रीसेट" : lang === "mr" ? "रीसेट" : "Reset"}
              </button>
            </div>
          )}
        </div>

        {/* Breathing Guide */}
        <div className={styles.guide}>
          <div className={styles.guideItem}>
            <span className={styles.guideStep}>4s</span>
            <span>Inhale gently through your nose</span>
          </div>
          <div className={styles.guideItem}>
            <span className={styles.guideStep}>7s</span>
            <span>Hold your breath comfortably</span>
          </div>
          <div className={styles.guideItem}>
            <span className={styles.guideStep}>8s</span>
            <span>Exhale slowly through your mouth</span>
          </div>
          <div className={styles.guideItem}>
            <span className={styles.guideStep}>4s</span>
            <span>Rest and hold before the next cycle</span>
          </div>
        </div>

        {/* Encouragement message */}
        {running && (
          <div className={styles.encouragement}>
            You are safe here. Keep breathing gently.
          </div>
        )}

        {/* Completion summary */}
        {!running && cycles > 0 && (
          <div className={`${styles.completedMsg} animate-fade-in-up`}>
            <span>🌟</span>
            <div>
              <strong>Well done.</strong> You completed {cycles} mindful breath cycle{cycles !== 1 ? "s" : ""}.
              <br />
              <div style={{ marginTop: "var(--sp-2)", display: "flex", gap: "var(--sp-2)" }}>
                <Link href="/buddy-voice" className="btn btn-primary btn-sm">Talk with Buddy</Link>
                <Link href="/home" className="btn btn-secondary btn-sm">Return Home</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
