"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./survivor.module.css";
import { useTranslation, Language } from "@/lib/i18n";

export default function SurvivorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { lang, setLang, t } = useTranslation();

  // Modals state
  const [showExitModal, setShowExitModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showSosModal, setShowSosModal]   = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowExitModal(false);
        setShowHomeModal(false);
        setShowSosModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pathname === "/home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setShowHomeModal(true);
  }

  function handleNavHomeClick(e: React.MouseEvent) {
    if (pathname !== "/home") {
      e.preventDefault();
      setShowHomeModal(true);
    }
  }

  function confirmGoHome() {
    setShowHomeModal(false);
    router.push("/home");
  }

  function confirmExit() {
    setShowExitModal(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("trac_survivor_session");
    }
    router.push("/");
  }

  function confirmSosCall() {
    setShowSosModal(false);
    window.location.href = "tel:14566";
  }

  const NAV_ITEMS = [
    { href: "/home",        label: t.home,    icon: "🏠" },
    { href: "/checkin",     label: t.chat,    icon: "💬" },
    { href: "/buddy-voice", label: t.voice,   icon: "🎙️" },
    { href: "/breathing",   label: t.breathe, icon: "🌬️" },
    { href: "/grounding",   label: t.ground,  icon: "🌿" },
  ];

  const MORE_LINKS = [
    { href: "/legal-aid",          label: t.legalAid,          icon: "⚖️" },
    { href: "/witness-protection", label: t.witnessProtection, icon: "🛡️" },
    { href: "/my-progress",        label: t.myProgress,        icon: "📈" },
    { href: "/consent",            label: t.privacy,           icon: "🔒" },
  ];

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <button
          className={styles.topbarLogoBtn}
          onClick={handleLogoClick}
          aria-label={t.brand}
        >
          <span className={styles.logoBadge} aria-hidden>💜</span>
          <span className={styles.logoText}>
            TRAC<span className={styles.logoAccent}>-Mind</span>
          </span>
        </button>

        <div className={styles.topbarActions}>
          {/* Functional Language selector (Req 2) */}
          <select
            className={styles.langSelect}
            aria-label="Select language"
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>

          <button
            type="button"
            className={styles.sosTopbar}
            onClick={() => setShowSosModal(true)}
            aria-label={t.emergencyHotline}
          >
            {t.emergencyHotline}
          </button>

          <button
            type="button"
            className={styles.quickExit}
            onClick={() => setShowExitModal(true)}
            aria-label={t.exit}
            title={t.exit}
          >
            {t.exit}
          </button>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div className={styles.main}>{children}</div>

      {/* ── Bottom navigation ────────────────────────────────────────────── */}
      <nav className={styles.bottomNav} aria-label="Survivor navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return item.href === "/home" ? (
            <button
              key={item.href}
              onClick={handleNavHomeClick}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && <span className={styles.activeIndicator} />}
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && <span className={styles.activeIndicator} />}
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
        <div className={styles.moreDropdownWrapper}>
          <button className={styles.navItem} aria-label={t.more}>
            <span className={styles.navIcon}>⋯</span>
            <span className={styles.navLabel}>{t.more}</span>
          </button>
          <div className={styles.moreDropdown} role="menu">
            {MORE_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={styles.moreItem} role="menuitem">
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Floating SOS Button ─────────────────────────────────────────── */}
      <button
        type="button"
        className="sos-btn-float"
        onClick={() => setShowSosModal(true)}
        aria-label="Emergency SOS — Call 14566"
      >
        🆘 SOS
      </button>

      {/* ── Exit Confirmation Modal (Req 1, 3) ──────────────────────────────── */}
      {showExitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExitModal(false)} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
          >
            <div className={styles.modalIconBadge}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h2 id="exit-modal-title" className={styles.modalTitle}>{t.exitModalTitle}</h2>
            <p className={styles.modalDesc}>{t.exitModalDesc}</p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowExitModal(false)}
                style={{ flex: 1 }}
              >
                {t.stay}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmExit}
                style={{ flex: 1 }}
              >
                {t.confirmExit}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Home Confirmation Modal (Req 2, 12, 13) ─────────────────────────── */}
      {showHomeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowHomeModal(false)} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-modal-title"
          >
            {/* Custom TRAC-Mind sanctuary icon (Req 13) */}
            <div className={styles.modalIconBadge} style={{ background: "rgba(139,116,201,0.14)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h2 id="home-modal-title" className={styles.modalTitle}>{t.homeModalTitle}</h2>
            <p className={styles.modalDesc}>{t.homeModalDesc}</p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowHomeModal(false)}
                style={{ flex: 1 }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmGoHome}
                style={{ flex: 1 }}
              >
                {t.goHome}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SOS Confirmation Modal (Req 13) ──────────────────────────────── */}
      {showSosModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSosModal(false)} role="presentation">
          <div
            className={`${styles.glassModal} ${styles.sosModalCard}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-modal-title"
          >
            <div className={styles.modalIconBadge} style={{ background: "rgba(201,82,107,0.15)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--risk-high)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 id="sos-modal-title" className={styles.modalTitle} style={{ color: "var(--risk-high)" }}>
              {t.sosModalTitle}
            </h2>
            <p className={styles.modalDesc}>{t.sosModalDesc}</p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSosModal(false)}
                style={{ flex: 1 }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmSosCall}
                style={{ flex: 1 }}
              >
                {t.callNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
