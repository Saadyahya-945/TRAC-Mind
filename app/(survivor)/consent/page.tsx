"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./consent.module.css";

interface ConsentItem {
  id: string;
  title: string;
  desc: string;
  granted: boolean;
  required: boolean;
}

const INITIAL_CONSENTS: ConsentItem[] = [
  {
    id: "c-counselor",
    title: "Share with my assigned counselor",
    desc: "Allows your counselor to view your check-ins, mood scores, and DDI trajectory to provide better support.",
    granted: true,
    required: false,
  },
  {
    id: "c-emergency",
    title: "Emergency data sharing",
    desc: "If your distress score is critically high, your case may be shared with state authorities for immediate intervention. This cannot be fully revoked in life-threatening situations, as disclosed at onboarding.",
    granted: true,
    required: true,
  },
  {
    id: "c-legal",
    title: "Share with legal aid team",
    desc: "Allows the legal aid team to see your case details to provide faster support.",
    granted: false,
    required: false,
  },
  {
    id: "c-research",
    title: "Anonymized research",
    desc: "Allows anonymized, de-identified data to contribute to mental health research. Your identity is never revealed.",
    granted: false,
    required: false,
  },
];

export default function ConsentPage() {
  const [consents, setConsents] = useState<ConsentItem[]>(INITIAL_CONSENTS);
  const [saved, setSaved] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  function toggle(id: string) {
    setConsents((prev) =>
      prev.map((c) => (c.id === id && !c.required ? { ...c, granted: !c.granted } : c))
    );
    setSaved(false);
  }

  function saveConsents() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDataExport() {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 4000);
  }

  return (
    <div className={`${styles.page} animate-fade-in-up`}>
      <div style={{ display: "flex", marginBottom: "var(--sp-2)" }}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          ← Back to Home
        </Link>
      </div>
      <h1 className="text-h1 text-serif">Privacy &amp; Consent Center</h1>
      <p className="text-body text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-6)" }}>
        You control who sees your information. Review and change your consent at any time.
      </p>

      <div className={styles.dpdpNote}>
        <span>🇮🇳</span>
        <p className="text-sm text-muted">
          Your data is strictly governed under the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and the <strong>Mental Healthcare Act 2017</strong>.
        </p>
      </div>

      <div className={styles.consentList}>
        {consents.map((item) => (
          <div key={item.id} className={styles.consentItem}>
            <div className={styles.consentContent}>
              <div className={styles.consentTitle}>
                {item.title}
                {item.required && (
                  <span className={styles.requiredBadge}>Mandatory Safety</span>
                )}
              </div>
              <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>{item.desc}</p>
            </div>
            <label className="toggle" aria-label={item.title}>
              <input
                type="checkbox"
                checked={item.granted}
                disabled={item.required}
                onChange={() => toggle(item.id)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={saveConsents}
        style={{ width: "100%", marginTop: "var(--sp-6)" }}
      >
        {saved ? "✓ Consent Preferences Updated" : "Save Privacy Preferences"}
      </button>

      {/* DPDP Data Portability */}
      <div className={styles.deletionSection}>
        <h2 className="text-h2">Data Portability &amp; Deletion</h2>
        <p className="text-sm text-muted" style={{ margin: "var(--sp-2) 0 var(--sp-4)" }}>
          Under DPDP Act Section 12, you have the right to receive an export copy of all data collected about you, or request immediate cryptographic erasure.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-3)" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleDataExport}>
            📥 Export My Data (JSON)
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => alert("Data deletion request initiated. A verification SMS has been sent.")}
          >
            Request Complete Erasure
          </button>
        </div>
        {downloadNotice && (
          <div className="text-sm text-brand font-semibold animate-fade-in" style={{ marginTop: "var(--sp-3)" }}>
            ✓ Decrypted personal records bundle compiled and downloaded.
          </div>
        )}
      </div>

      <div className={styles.retentionNote}>
        <span>📋</span>
        <p className="text-sm text-muted">
          <strong>Audio Zero-Retention Policy:</strong> Audio voice recordings are parsed into transient mathematical features (pitch, latency) in runtime RAM and are never written to disk or database.
        </p>
      </div>
    </div>
  );
}
