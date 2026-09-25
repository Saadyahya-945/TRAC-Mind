"use client";

import Link from "next/link";
import styles from "./home.module.css";
import { useTranslation } from "@/lib/i18n";

const HELPLINES = [
  { label: "NHAA",       num: "14566",         icon: "🆘" },
  { label: "Tele-MANAS", num: "14416",         icon: "📞" },
  { label: "iCall",      num: "9152987821",    icon: "💙" },
  { label: "Vandrevala", num: "1860-2662-345", icon: "🤝" },
];

export default function HomePage() {
  const { t } = useTranslation();

  const hour = new Date().getHours();
  const greeting =
    hour < 5  ? t.greetingNight :
    hour < 12 ? t.greetingMorning :
    hour < 17 ? t.greetingAfternoon :
    hour < 21 ? t.greetingEvening :
                t.greetingNight;

  const quickActions = [
    {
      icon: "💬",
      label: t.quickChatTitle,
      href: "/checkin",
      desc: t.quickChatDesc,
      gradient: "linear-gradient(135deg, #EEE8FF, #F5F0FF)",
      border: "rgba(139,116,201,.3)",
    },
    {
      icon: "🌬️",
      label: t.quickBreatheTitle,
      href: "/breathing",
      desc: t.quickBreatheDesc,
      gradient: "linear-gradient(135deg, #EAF3EF, #F0F8F4)",
      border: "rgba(111,169,138,.3)",
    },
    {
      icon: "🌿",
      label: t.quickGroundTitle,
      href: "/grounding",
      desc: t.quickGroundDesc,
      gradient: "linear-gradient(135deg, #EAF3EF, #F0F8F4)",
      border: "rgba(111,169,138,.25)",
    },
    {
      icon: "⚖️",
      label: t.quickLegalTitle,
      href: "/legal-aid",
      desc: t.quickLegalDesc,
      gradient: "linear-gradient(135deg, #F3EFFC, #FAF8FE)",
      border: "rgba(139,116,201,.25)",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero greeting */}
      <section className={`${styles.hero} animate-fade-in-up`}>
        <div className={styles.heroInner}>
          <div className={styles.greetBadge}>{t.safeSpaceBadge}</div>
          <h1 className={`${styles.greetTitle} text-serif`}>{greeting}</h1>
          <p className={styles.greetSub}>
            {t.greetingSub}
          </p>
        </div>
        <div className={styles.heroCircle} aria-hidden />
      </section>

      {/* Voice & Chat CTA Strip — primary prominent entry point */}
      <section className={`${styles.ctaStrip} animate-fade-in-up`} style={{ animationDelay: "0.08s" }}>
        <Link href="/buddy-voice" className={styles.voiceCTA} aria-label={t.voiceCtaTitle}>
          <div className={styles.voicePulse} aria-hidden />
          <span className={styles.voiceIcon}>🎙️</span>
          <div className={styles.voiceContent}>
            <div className={styles.voiceTitle}>{t.voiceCtaTitle}</div>
            <div className={styles.voiceDesc}>{t.voiceCtaDesc}</div>
          </div>
          <span className={styles.voiceArrow} aria-hidden>→</span>
        </Link>
        <Link href="/checkin" className={styles.chatCTA} aria-label={t.chatCtaTitle}>
          <span className={styles.chatIcon}>💬</span>
          <div className={styles.chatTitle}>{t.chatCtaTitle}</div>
        </Link>
      </section>

      {/* Quick actions grid (No duplicate Talk with Buddy; 4 distinct tools) */}
      <section className={`${styles.section} animate-fade-in-up`} style={{ animationDelay: "0.14s" }}>
        <h2 className={styles.sectionTitle}>{t.whatDoYouNeed}</h2>
        <div className={styles.actionGrid}>
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={styles.actionCard}
              style={{ background: a.gradient, borderColor: a.border }}
              aria-label={a.label}
            >
              <div className={styles.actionIcon}>{a.icon}</div>
              <div className={styles.actionText}>
                <div className={styles.actionLabel}>{a.label}</div>
                <div className={styles.actionDesc}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy note */}
      <div className={`${styles.privacyNote} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
        <span className={styles.lockIcon}>🔐</span>
        <p className="text-sm text-muted">
          {t.privacyNote}
        </p>
      </div>

      {/* Secondary links */}
      <section className={styles.section} style={{ animationDelay: "0.24s" }}>
        <h2 className={styles.sectionTitle}>{t.moreSupportTitle}</h2>
        <div className={styles.moreGrid}>
          <Link href="/legal-aid"          className={styles.moreCard}><span>⚖️</span><span>{t.legalAid}</span></Link>
          <Link href="/witness-protection" className={styles.moreCard}><span>🛡️</span><span>{t.witnessProtection}</span></Link>
          <Link href="/my-progress"        className={styles.moreCard}><span>📈</span><span>{t.myProgress}</span></Link>
          <Link href="/consent"            className={styles.moreCard}><span>🔒</span><span>{t.privacy}</span></Link>
        </div>
      </section>

      {/* Helplines */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.helplinesTitle}</h2>
        <div className={styles.helplineGrid}>
          {HELPLINES.map((h) => (
            <a key={h.num} href={`tel:${h.num}`} className={styles.helplineCard}>
              <div className={styles.helplineIcon}>{h.icon}</div>
              <div className={styles.helplineText}>
                <div className={styles.helplineName}>{h.label}</div>
                <div className={styles.helplineNum}>{h.num}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
