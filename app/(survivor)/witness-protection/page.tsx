"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./witness.module.css";

const THREAT_LEVELS = [
  { level: "low", label: "Verbal Pressure", desc: "Pressure from community or family to withdraw FIR" },
  { level: "medium", label: "Stalking / Threats", desc: "Phone threats, surveillance, or intimidation at home" },
  { level: "high", label: "Imminent Danger", desc: "Direct physical threats, armed intimidation, or immediate violence" },
];

export default function WitnessProtectionPage() {
  const [step, setStep] = useState<"info" | "form" | "confirm">("info");
  const [threatLevel, setThreatLevel] = useState<"low" | "medium" | "high">("medium");
  const [formData, setFormData] = useState({ incident: "", when: "", anonymous: true, location: "" });
  const [refId, setRefId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRefId(`WP-${Math.floor(Math.random() * 90000) + 10000}`);
    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <div className={`${styles.page} animate-fade-in-up`}>
        <div className={styles.confirmState}>
          <div className={styles.confirmIcon}>🛡️</div>
          <h1 className="text-h1 text-serif">Protection Report Secured</h1>
          <p className="text-body text-muted" style={{ maxWidth: 440 }}>
            Your statement has been encrypted and dispatched to the designated District Witness Protection Cell under Section 15A of the PoA Act.
          </p>

          <div className={styles.caseRef}>
            Tracking Reference: <strong>{refId}</strong>
          </div>

          {threatLevel === "high" && (
            <div className={styles.urgentAlert}>
              <div style={{ fontWeight: 700, color: "var(--risk-high)" }}>⚠️ Imminent Threat Flagged</div>
              <p className="text-sm">
                Since you indicated imminent danger, an emergency police escort dispatch alert has been generated. If you are in immediate peril right now, do not wait:
              </p>
              <a href="tel:112" className="btn btn-danger btn-sm" style={{ width: "fit-content", marginTop: "var(--sp-2)" }}>
                🚨 Call 112 (Police Emergency)
              </a>
            </div>
          )}

          <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-4)" }}>
            <Link href="/home" className="btn btn-primary">Return Home</Link>
            <Link href="/buddy-voice" className="btn btn-secondary">Talk with Buddy</Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className={`${styles.page} animate-fade-in`}>
        <div className={styles.backBtn}>
          <button className="btn btn-ghost btn-sm" onClick={() => setStep("info")}>
            ← Back to Information
          </button>
        </div>
        <h1 className="text-h1 text-serif">Report Intimidation or Threat</h1>
        <p className="text-body text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-6)" }}>
          Your safety is prioritized. This report is shielded under Section 15A statutory privilege.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Threat Level Selection */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Estimated Threat Level</label>
            <div className={styles.threatSelector}>
              {THREAT_LEVELS.map((t) => (
                <button
                  key={t.level}
                  type="button"
                  className={`${styles.threatBtn} ${threatLevel === t.level ? styles.threatActive : ""}`}
                  onClick={() => setThreatLevel(t.level as any)}
                >
                  <div className="font-semibold text-ink">{t.label}</div>
                  <div className="text-xs text-muted">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="incident" className={styles.label}>
              Describe the incident in your own words
            </label>
            <textarea
              id="incident"
              className={`input ${styles.textarea}`}
              value={formData.incident}
              onChange={(e) => setFormData((f) => ({ ...f, incident: e.target.value }))}
              placeholder="e.g., Who approached you, what was said or done, any vehicles or identifiable details…"
              rows={4}
              required
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="when" className={styles.label}>When did it occur?</label>
              <input
                id="when"
                type="text"
                className="input"
                value={formData.when}
                onChange={(e) => setFormData((f) => ({ ...f, when: e.target.value }))}
                placeholder="e.g. Yesterday around 8:30 PM"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="loc" className={styles.label}>General Area / Village</label>
              <input
                id="loc"
                type="text"
                className="input"
                value={formData.location}
                onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Near district bus stop"
              />
            </div>
          </div>

          <label className={styles.toggleRow}>
            <div>
              <div className="font-semibold text-ink">Submit Anonymously</div>
              <div className="text-xs text-muted">Protects your name from all public records</div>
            </div>
            <span className="toggle">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData((f) => ({ ...f, anonymous: e.target.checked }))}
              />
              <span className="toggle-slider" />
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!formData.incident.trim()}
            style={{ width: "100%", marginTop: "var(--sp-2)" }}
          >
            Submit Confidential Report
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ display: "flex", marginBottom: "var(--sp-2)" }}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          ← Back to Home
        </Link>
      </div>
      <div className={styles.shield}>🛡️</div>
      <h1 className="text-h1 text-serif">Witness Protection Center</h1>
      <p className="text-body text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-6)" }}>
        Under Section 15A of the PoA Act, intimidation, threatening, or coercing a victim or witness is a severe non-bailable offense.
      </p>

      {/* Rights Cards */}
      <div className={styles.cards}>
        <div className="card">
          <div className={styles.cardIcon}>⚖️</div>
          <div className={styles.cardTitle}>Section 15A Rights Guaranteed</div>
          <p className="text-sm text-muted">
            The State is legally obligated to provide armed police protection, identity shielding, video deposition, and immediate relocation support if threatened.
          </p>
        </div>

        <div className="card">
          <div className={styles.cardIcon}>🏠</div>
          <div className={styles.cardTitle}>Emergency Safe-Haven Relocation</div>
          <p className="text-sm text-muted">
            If your residence is unsafe, state-sanctioned safe houses and transit accommodations are provided with food and medical supplies at zero cost.
          </p>
        </div>

        <div className="card">
          <div className={styles.cardIcon}>📞</div>
          <div className={styles.cardTitle}>Immediate Emergency Contacts</div>
          <p className="text-sm text-muted">
            Direct hotlines: <a href="tel:112" style={{ fontWeight: 700, color: "var(--risk-high)" }}>112 (Police)</a>,{" "}
            <a href="tel:14566" style={{ fontWeight: 700, color: "var(--risk-high)" }}>14566 (NHAA)</a>, or request safe escort.
          </p>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg"
        onClick={() => setStep("form")}
        style={{ width: "100%" }}
      >
        File Intimidation Report Now
      </button>
    </div>
  );
}
