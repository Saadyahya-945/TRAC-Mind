"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Mock credentials
  const MOCK_USERS: Record<string, { role: string; name: string }> = {
    "counselor@trac.mind": { role: "counselor", name: "Dr. Priya Nair" },
    "admin@trac.mind":     { role: "admin",     name: "Admin Sharma" },
  };

  function performLogin(uEmail: string, uPass: string) {
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = MOCK_USERS[uEmail.toLowerCase()];
      if (user && uPass === "tracmind2026") {
        sessionStorage.setItem("trac_user", JSON.stringify(user));
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Try counselor@trac.mind / tracmind2026");
        setLoading(false);
      }
    }, 600);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    performLogin(email, password);
  }

  function handleQuickFill(role: "counselor" | "admin") {
    const credEmail = role === "counselor" ? "counselor@trac.mind" : "admin@trac.mind";
    setEmail(credEmail);
    setPassword("tracmind2026");
    performLogin(credEmail, "tracmind2026");
  }

  return (
    <div className={styles.page}>
      <div className={styles.blob} aria-hidden />

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>
            TRAC<span className="text-brand">-Mind</span>
          </span>
          <span className={styles.logoSub}>Care Team Portal</span>
        </div>

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.sub}>Access your counsellor or admin triage dashboard.</p>

        {/* 1-Tap Quick Demo Fill Buttons (prevents browser save password popups) */}
        <div style={{ display: "flex", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickFill("counselor")}
            style={{ flex: 1, fontSize: "0.75rem" }}
          >
            ⚡ Fast Demo: Counsellor
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickFill("admin")}
            style={{ flex: 1, fontSize: "0.75rem" }}
          >
            ⚡ Fast Demo: Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className={styles.form} noValidate autoComplete="off">
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organisation.in"
              autoComplete="off"
              required
              aria-required="true"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              aria-required="true"
            />
          </div>

          {error && (
            <div className={styles.errorMsg} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className={styles.mfaNote}>
          🔐 MFA role-based access for SIH 2026.
        </div>

        <div className={styles.demoNote}>
          <strong>Demo credentials:</strong>
          <div>Counsellor: counselor@trac.mind</div>
          <div>Admin: admin@trac.mind</div>
          <div>Password: tracmind2026</div>
        </div>

        <div className={styles.backLink}>
          <Link href="/" className="text-sm text-brand font-semibold">
            ← Back to survivor portal
          </Link>
        </div>
      </div>
    </div>
  );
}
