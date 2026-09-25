"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./grounding.module.css";
import { useTranslation } from "@/lib/i18n";

const MOOD_OPTIONS = [
  { emoji: "😔", label: "Very low",    score: 1 },
  { emoji: "😟", label: "Low",         score: 2 },
  { emoji: "😐", label: "Okay",        score: 3 },
  { emoji: "🙂", label: "Better",      score: 4 },
  { emoji: "😊", label: "Good",        score: 5 },
];

const SAFETY_OPTIONS = [
  { emoji: "😨", label: "Not safe",    score: 1 },
  { emoji: "😟", label: "Worried",     score: 2 },
  { emoji: "😐", label: "Okay",        score: 3 },
  { emoji: "🙂", label: "Fairly safe", score: 4 },
  { emoji: "😌", label: "Safe",        score: 5 },
];

const SENSORY_STEPS = [
  {
    step: 5,
    title: "5 Things you can SEE",
    icon: "👁️",
    desc: "Look around you right now. Notice 5 objects or details (e.g. a window, a chair, your shoes).",
    prompts: ["First thing you see", "Second thing", "Third thing", "Fourth thing", "Fifth thing"],
    color: "#8B74C9",
  },
  {
    step: 4,
    title: "4 Things you can TOUCH",
    icon: "✋",
    desc: "Notice the physical texture of 4 items around you (e.g. the fabric of your sleeve, table surface).",
    prompts: ["First physical sensation", "Second texture", "Third touch", "Fourth feeling"],
    color: "#6FA98A",
  },
  {
    step: 3,
    title: "3 Things you can HEAR",
    icon: "👂",
    desc: "Listen carefully. What are 3 sounds in your environment right now?",
    prompts: ["First sound (distant or near)", "Second sound", "Third sound"],
    color: "#D9A441",
  },
  {
    step: 2,
    title: "2 Things you can SMELL",
    icon: "👃",
    desc: "Breathe in gently. Can you notice 2 scents, or recall 2 comforting scents?",
    prompts: ["First scent", "Second scent"],
    color: "#C9526B",
  },
  {
    step: 1,
    title: "1 Thing you can TASTE",
    icon: "👅",
    desc: "Notice the taste in your mouth, take a sip of water, or speak 1 kind word to yourself.",
    prompts: ["1 taste or comforting affirmation"],
    color: "#7E68B8",
  },
];

export default function GroundingPage() {
  const { lang, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"sensory" | "checkin">("sensory");

  // Checkin state
  const [mood, setMood] = useState<number | null>(null);
  const [safety, setSafety] = useState<number | null>(null);
  const [submittedCheckin, setSubmittedCheckin] = useState(false);

  // 5-4-3-2-1 Sensory state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [sensoryCompleted, setSensoryCompleted] = useState(false);

  function toggleCheck(key: string) {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleCheckinSubmit() {
    if (mood !== null && safety !== null) setSubmittedCheckin(true);
  }

  const currentStep = SENSORY_STEPS[currentStepIdx];
  const stepChecks = currentStep.prompts.map((_, i) => `${currentStep.step}-${i}`);
  const allCurrentChecked = stepChecks.every((k) => checkedItems[k]);

  function nextSensoryStep() {
    if (currentStepIdx < SENSORY_STEPS.length - 1) {
      setCurrentStepIdx((i) => i + 1);
    } else {
      setSensoryCompleted(true);
    }
  }

  function resetSensory() {
    setCurrentStepIdx(0);
    setCheckedItems({});
    setSensoryCompleted(false);
  }

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ display: "flex", marginBottom: "var(--sp-2)" }}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          {t.backHome}
        </Link>
      </div>

      {/* Tab Switcher */}
      <div className={styles.tabBar} role="tablist">
        <button
          className={`${styles.tabBtn} ${activeTab === "sensory" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("sensory")}
          role="tab"
          aria-selected={activeTab === "sensory"}
        >
          🌿 {t.quickGroundTitle}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "checkin" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("checkin")}
          role="tab"
          aria-selected={activeTab === "checkin"}
        >
          📋 {lang === "hi" ? "मूड व सुरक्षा चेक" : lang === "mr" ? "मनस्थिती व सुरक्षा तपासणी" : "Mood & Safety Check"}
        </button>
      </div>

      {activeTab === "sensory" ? (
        sensoryCompleted ? (
          <div className={`${styles.completedCard} animate-fade-in-up`}>
            <div className={styles.compIcon}>🌱</div>
            <h1 className="text-h1 text-serif">You are grounded and safe.</h1>
            <p className="text-body text-muted" style={{ maxWidth: 440, margin: "var(--sp-2) auto var(--sp-6)" }}>
              You brought your mind back to the present moment. Take a gentle breath. You did this for yourself.
            </p>
            <div className={styles.compBtns}>
              <button className="btn btn-secondary" onClick={resetSensory}>
                Practice again
              </button>
              <Link href="/breathing" className="btn btn-secondary">
                Try 4-7-8 Breathing
              </Link>
              <Link href="/buddy-voice" className="btn btn-primary">
                Talk with Buddy
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${styles.sensoryContainer} animate-fade-in`}>
            {/* Progress stepper */}
            <div className={styles.stepProgress}>
              {SENSORY_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  className={`${styles.progressDot} ${idx === currentStepIdx ? styles.dotCurrent : idx < currentStepIdx ? styles.dotDone : ""}`}
                  title={s.title}
                >
                  {idx < currentStepIdx ? "✓" : s.step}
                </div>
              ))}
            </div>

            <div className={styles.sensoryCard} style={{ borderColor: `${currentStep.color}40` }}>
              <div className={styles.stepHeader}>
                <span className={styles.stepIcon}>{currentStep.icon}</span>
                <div>
                  <div className={styles.stepCount}>Step {currentStepIdx + 1} of 5</div>
                  <h2 className={styles.stepTitle} style={{ color: currentStep.color }}>{currentStep.title}</h2>
                </div>
              </div>

              <p className={styles.stepDesc}>{currentStep.desc}</p>

              <div className={styles.checklist}>
                {currentStep.prompts.map((p, i) => {
                  const key = `${currentStep.step}-${i}`;
                  const isDone = !!checkedItems[key];
                  return (
                    <button
                      key={key}
                      className={`${styles.checkItem} ${isDone ? styles.checkItemDone : ""}`}
                      onClick={() => toggleCheck(key)}
                      aria-pressed={isDone}
                    >
                      <span className={styles.checkbox}>{isDone ? "✓" : ""}</span>
                      <span className={styles.checkText}>{p}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.sensoryActions}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={nextSensoryStep}
                  style={{ width: "100%", background: currentStep.color }}
                >
                  {currentStepIdx === SENSORY_STEPS.length - 1 ? "Complete Grounding 🌟" : "Next step →"}
                </button>
                {currentStepIdx > 0 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentStepIdx((i) => i - 1)}
                  >
                    ← Previous step
                  </button>
                )}
              </div>
            </div>

            <div className={styles.calmTip}>
              <span>💡</span>
              <span className="text-xs text-muted">
                Sensory grounding activates your parasympathetic nervous system, easing acute anxiety and panic sensations.
              </span>
            </div>
          </div>
        )
      ) : (
        /* Mood & Safety Checkin Tab */
        submittedCheckin ? (
          <div className={`${styles.thankYou} animate-fade-in-up`}>
            <div className={styles.tyEmoji}>💜</div>
            <h1 className="text-h1 text-serif">Thank you for checking in.</h1>
            <p className="text-body text-muted" style={{ marginTop: "var(--sp-2)" }}>
              Your responses help us support you better. You are heard and valued.
            </p>
            {(mood !== null && mood <= 2) || (safety !== null && safety <= 2) ? (
              <div className={styles.supportMsg}>
                It sounds like things are heavy right now. Would you like to talk to Buddy?
                <div style={{ marginTop: "var(--sp-4)", display: "flex", flexWrap: "wrap", gap: "var(--sp-3)", justifyContent: "center" }}>
                  <Link href="/buddy-voice" className="btn btn-primary btn-sm">🎙️ Talk with Buddy</Link>
                  <Link href="/checkin" className="btn btn-secondary btn-sm">💬 Chat Check-in</Link>
                  <a href="tel:14566" className="btn btn-danger btn-sm">🆘 Call 14566</a>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "var(--sp-6)", display: "flex", gap: "var(--sp-3)" }}>
                <Link href="/breathing" className="btn btn-secondary">Try breathing</Link>
                <Link href="/home" className="btn btn-primary">Return home</Link>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className={styles.intro}>
              <h1 className="text-h1 text-serif">Grounding Check</h1>
              <p className="text-body text-muted" style={{ marginTop: "var(--sp-2)" }}>
                A quick, private check on how you're feeling right now.
              </p>
            </div>

            {/* Mood selection */}
            <section className={styles.section}>
              <h2 className="text-h2">How are you feeling emotionally?</h2>
              <div className="grounding-grid" role="group" aria-label="Mood selection">
                {MOOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.score}
                    className={`grounding-item ${mood === opt.score ? "selected" : ""}`}
                    onClick={() => setMood(opt.score)}
                    aria-pressed={mood === opt.score}
                    aria-label={opt.label}
                  >
                    <span className="grounding-emoji">{opt.emoji}</span>
                    <span className="grounding-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Safety selection */}
            <section className={styles.section}>
              <h2 className="text-h2">How safe do you feel right now?</h2>
              <div className="grounding-grid" role="group" aria-label="Safety selection">
                {SAFETY_OPTIONS.map((opt) => (
                  <button
                    key={opt.score}
                    className={`grounding-item ${safety === opt.score ? "selected" : ""}`}
                    onClick={() => setSafety(opt.score)}
                    aria-pressed={safety === opt.score}
                    aria-label={opt.label}
                  >
                    <span className="grounding-emoji">{opt.emoji}</span>
                    <span className="grounding-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className={styles.submitArea}>
              <p className="text-sm text-muted" style={{ textAlign: "center" }}>
                🔒 Only your assigned counselor can see this — with your consent.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCheckinSubmit}
                disabled={mood === null || safety === null}
                style={{ width: "100%", marginTop: "var(--sp-2)" }}
              >
                Submit check-in
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
