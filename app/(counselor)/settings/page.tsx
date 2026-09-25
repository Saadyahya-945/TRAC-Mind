"use client";

import styles from "./settings.module.css";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-h1" style={{ marginBottom: "var(--sp-8)" }}>Settings</h1>

      <div className={styles.settingsGrid}>
        <section className="card-elevated">
          <h2 className={`text-h2 ${styles.sectionTitle}`}>DDI Thresholds</h2>
          <p className="text-sm text-muted" style={{ marginBottom: "var(--sp-5)" }}>
            Configure risk tier boundaries. Changes require admin approval and are logged.
          </p>
          <div className={styles.thresholdRow}>
            <label className={styles.label}>Low → Medium threshold</label>
            <input type="number" className={`input ${styles.numInput}`} defaultValue={40} min={1} max={99} />
          </div>
          <div className={styles.thresholdRow}>
            <label className={styles.label}>Medium → High threshold</label>
            <input type="number" className={`input ${styles.numInput}`} defaultValue={70} min={1} max={99} />
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: "var(--sp-5)" }}>
            Save thresholds (admin only)
          </button>
        </section>

        <section className="card-elevated">
          <h2 className={`text-h2 ${styles.sectionTitle}`}>Model weights</h2>
          <p className="text-sm text-muted" style={{ marginBottom: "var(--sp-5)" }}>
            DDI = weighted blend of LLM consensus, biomarkers and recurrence.
          </p>
          <div className={styles.weightRow}>
            <label className={styles.label}>LLM consensus weight</label>
            <input type="range" min={0} max={1} step={0.05} defaultValue={0.5} className={styles.slider} />
            <span className="text-sm text-muted">50%</span>
          </div>
          <div className={styles.weightRow}>
            <label className={styles.label}>Vocal biomarkers weight</label>
            <input type="range" min={0} max={1} step={0.05} defaultValue={0.3} className={styles.slider} />
            <span className="text-sm text-muted">30%</span>
          </div>
          <div className={styles.weightRow}>
            <label className={styles.label}>Recurrence weight</label>
            <input type="range" min={0} max={1} step={0.05} defaultValue={0.2} className={styles.slider} />
            <span className="text-sm text-muted">20%</span>
          </div>
          <p className="text-xs text-faint" style={{ marginTop: "var(--sp-4)" }}>
            Weights must sum to 1.0. Backend validates before applying.
          </p>
        </section>

        <section className="card-elevated">
          <h2 className={`text-h2 ${styles.sectionTitle}`}>SLA configuration</h2>
          <div className={styles.thresholdRow}>
            <label className={styles.label}>High Risk response SLA (minutes)</label>
            <input type="number" className={`input ${styles.numInput}`} defaultValue={5} />
          </div>
          <div className={styles.thresholdRow}>
            <label className={styles.label}>Medium Risk session SLA (hours)</label>
            <input type="number" className={`input ${styles.numInput}`} defaultValue={24} />
          </div>
        </section>

        <section className="card-elevated">
          <h2 className={`text-h2 ${styles.sectionTitle}`}>Notification channels</h2>
          <div className={styles.toggleRow}>
            <span className={styles.label}>Email alerts for High Risk</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className={styles.toggleRow}>
            <span className={styles.label}>SMS alerts for SLA breach</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className={styles.toggleRow}>
            <span className={styles.label}>Model disagreement flag notifications</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider" />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
