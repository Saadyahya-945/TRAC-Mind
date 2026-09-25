"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./counselor.module.css";

const COUNSELOR_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", badge: 2 },
  { href: "/cases",     label: "Cases",     icon: "📁" },
  { href: "/sessions",  label: "Sessions",  icon: "📅" },
];

const ADMIN_NAV = [
  { href: "/analytics", label: "Analytics",  icon: "📈" },
  { href: "/audit",     label: "Audit Log",  icon: "🔍" },
  { href: "/settings",  label: "Settings",   icon: "⚙️" },
];

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  // Modals state
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal]     = useState(false);
  const [showSurvivorModal, setShowSurvivorModal]   = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDashboardModal(false);
        setShowSignoutModal(false);
        setShowSurvivorModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pathname === "/dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOpen(false);
      return;
    }
    setShowDashboardModal(true);
    setOpen(false);
  }

  function confirmGoDashboard() {
    setShowDashboardModal(false);
    router.push("/dashboard");
  }

  function confirmSignout() {
    setShowSignoutModal(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("trac_user");
    }
    router.push("/login");
  }

  function confirmSwitchToSurvivor() {
    setShowSurvivorModal(false);
    router.push("/");
  }

  const SidebarContent = () => (
    <>
      <div className={styles.sidebarLogoRow}>
        <button
          className={styles.sidebarLogoBtn}
          onClick={handleLogoClick}
          aria-label="Counsellor dashboard"
        >
          <span className={styles.logoMark}>
            TRAC<span className={styles.logoAccent}>-Mind</span>
          </span>
          <span className={styles.logoSub}>Care Team Portal</span>
        </button>
        {/* Mobile close */}
        <button
          className={styles.closeSidebar}
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <span className="sidebar-section-label">Triage</span>
      {COUNSELOR_NAV.map((item) => {
        const isDash = item.href === "/dashboard";
        const isActive = isDash ? pathname === "/dashboard" : pathname.startsWith(item.href);

        return isDash ? (
          <button
            key={item.href}
            onClick={handleLogoClick}
            className={`sidebar-link ${isActive ? "active" : ""} ${styles.dashNavBtn}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span aria-hidden>{item.icon}</span>
            <span className={styles.navLinkLabel}>{item.label}</span>
            {item.badge && (
              <span className={styles.navBadge}>{item.badge}</span>
            )}
          </button>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden>{item.icon}</span>
            <span className={styles.navLinkLabel}>{item.label}</span>
            {item.badge && (
              <span className={styles.navBadge}>{item.badge}</span>
            )}
          </Link>
        );
      })}

      <span className="sidebar-section-label">Administration</span>
      {ADMIN_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
          aria-current={pathname === item.href ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          <span aria-hidden>{item.icon}</span>
          <span className={styles.navLinkLabel}>{item.label}</span>
        </Link>
      ))}

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>👤</div>
          <div>
            <div className={styles.userName}>Dr. Priya Nair</div>
            <div className={styles.userRole}>Counsellor · NIMHANS</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowSignoutModal(true)}
          style={{ width: "100%" }}
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.layout}>
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <nav className={`sidebar ${styles.desktopSidebar}`} aria-label="Counselor navigation">
        <SidebarContent />
      </nav>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <header className={styles.mobileTopbar}>
        <button
          className={styles.hamburger}
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <span /><span /><span />
        </button>
        <button className={styles.mobileLogoBtn} onClick={handleLogoClick}>
          TRAC<span className={styles.logoAccent}>-Mind</span>
        </button>
        <button
          className={styles.mobilePortalLink}
          onClick={() => setShowSurvivorModal(true)}
        >
          Survivor portal
        </button>
      </header>

      {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <nav
        className={`sidebar ${styles.mobileSidebar} ${open ? styles.mobileSidebarOpen : ""}`}
        aria-label="Counselor navigation"
        aria-hidden={!open}
      >
        <SidebarContent />
      </nav>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {children}
      </main>

      {/* ── Return to Dashboard Confirmation Modal (Req 2) ────────────────── */}
      {showDashboardModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDashboardModal(false)} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-modal-title"
          >
            <div className={styles.modalIconBadge}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="9"/>
                <rect x="14" y="3" width="7" height="5"/>
                <rect x="14" y="12" width="7" height="9"/>
                <rect x="3" y="16" width="7" height="5"/>
              </svg>
            </div>
            <h2 id="dash-modal-title" className={styles.modalTitle}>Return to Dashboard?</h2>
            <p className={styles.modalDesc}>
              Are you sure you want to return to the Counsellor Dashboard?
            </p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDashboardModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmGoDashboard}
                style={{ flex: 1 }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sign out Confirmation Modal (Req 1, 3) ────────────────────────── */}
      {showSignoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSignoutModal(false)} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
          >
            <div className={styles.modalIconBadge}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 id="signout-modal-title" className={styles.modalTitle}>Sign Out?</h2>
            <p className={styles.modalDesc}>
              Are you sure you want to sign out of the Counsellor Portal? Your active session will be ended.
            </p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSignoutModal(false)}
                style={{ flex: 1 }}
              >
                Stay
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmSignout}
                style={{ flex: 1 }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Switch to Survivor Portal Modal (Req 3, 4) ────────────────────── */}
      {showSurvivorModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSurvivorModal(false)} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="switch-modal-title"
          >
            <div className={styles.modalIconBadge}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 id="switch-modal-title" className={styles.modalTitle}>Switch to Survivor Portal?</h2>
            <p className={styles.modalDesc}>
              Are you sure you want to leave the Counsellor Portal and open the Survivor Safe Space?
            </p>
            <div className={styles.modalBtns}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSurvivorModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmSwitchToSurvivor}
                style={{ flex: 1 }}
              >
                Go to Survivor Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
