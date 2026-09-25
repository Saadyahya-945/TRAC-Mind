"use client";

import { useRouter } from "next/navigation";
import styles from "./landing.module.css";
import { useTranslation, Language } from "@/lib/i18n";

const FEATURES = [
  { icon: "🎙️", label: "Voice check-in" },
  { icon: "💬", label: "Chat with Buddy" },
  { icon: "🌬️", label: "Breathing pacer" },
  { icon: "⚖️", label: "Legal aid" },
  { icon: "🔒", label: "100% private" },
];

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

export default function LandingPage() {
  const router = useRouter();
  const { lang, setLang, t } = useTranslation();

  return (
    <main className={styles.page}>
      {/* Ambient background blobs */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />
      <div className={styles.blob3} aria-hidden />
      <div className={styles.blob4} aria-hidden />

      {/* Top strip */}
      <div className={styles.topStrip}>
        <span className={styles.wordmark}>
          <span className={styles.wIcon}>💜</span> {t.brand}
        </span>
        <div className={styles.topRight}>
          {/* Functional Language pills (Req 2) */}
          <div className={styles.langPills} role="group" aria-label="Language selection">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`${styles.langPill} ${lang === l.code ? styles.langActive : ""}`}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a href="tel:14566" className={styles.topSOS} aria-label={t.emergencyHotline}>
            {t.emergencyHotline}
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} /> {t.landingHeroBadge}
        </div>
        <h1 className={`${styles.heroTitle} text-serif`}>
          {t.landingHeroTitle1}<br />
          <em>{t.landingHeroTitle2}</em>
        </h1>
        <p className={styles.heroSub}>
          {t.landingHeroSub}
        </p>

        {/* Feature strip */}
        <div className={styles.featureStrip} aria-hidden>
          {FEATURES.map((f) => (
            <div key={f.label} className={styles.featurePill}>
              <span>{f.icon}</span> {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* The fork */}
      <div className={styles.fork} role="navigation" aria-label="Choose your path">
        {/* Survivor panel */}
        <button
          className={`${styles.panel} ${styles.survivorPanel}`}
          onClick={() => router.push("/home")}
          aria-label={t.survivorCardTitle}
        >
          <div className={styles.panelGlow} aria-hidden />
          <div className={styles.panelTop}>
            <div className={styles.panelEmoji} aria-hidden>💜</div>
            <div className={styles.panelArrow} aria-hidden>↗</div>
          </div>
          <div className={styles.panelTitle}>{t.survivorCardTitle}</div>
          <div className={styles.panelDesc}>
            {t.survivorCardDesc}
          </div>
          <div className={styles.panelFooter}>
            <span className={styles.panelTag}>{t.survivorCardTag}</span>
          </div>
        </button>

        {/* Care team panel */}
        <button
          className={`${styles.panel} ${styles.carePanel}`}
          onClick={() => router.push("/login")}
          aria-label={t.careCardTitle}
        >
          <div className={styles.panelGlow2} aria-hidden />
          <div className={styles.panelTop}>
            <div className={styles.panelEmoji} aria-hidden>🏥</div>
            <div className={styles.panelArrow} aria-hidden>↗</div>
          </div>
          <div className={styles.panelTitle}>{t.careCardTitle}</div>
          <div className={styles.panelDesc}>
            {t.careCardDesc}
          </div>
          <div className={styles.panelFooter}>
            <span className={styles.panelTag}>{t.careCardTag}</span>
          </div>
        </button>
      </div>

      {/* Compliance strip */}
      <div className={styles.complianceRow}>
        <span className={styles.compliancePill}>DPDP Act 2023</span>
        <span className={styles.compliancePill}>Mental Healthcare Act 2017</span>
        <span className={styles.compliancePill}>WCAG 2.1 AA</span>
        <span className={styles.compliancePill}>Byte-Forge · SIH 2026</span>
      </div>

      {/* Helplines footer */}
      <div className={styles.footerStrip}>
        <span className="text-faint" style={{ fontSize: "0.8125rem" }}>{t.emergencyHelplines}</span>
        {[
          { label: "NHAA", num: "14566" },
          { label: "Tele-MANAS", num: "14416" },
          { label: "Police", num: "112" },
        ].map((h) => (
          <a key={h.num} href={`tel:${h.num}`} className={styles.footerHotline}>
            {h.label} {h.num}
          </a>
        ))}
      </div>
    </main>
  );
}
