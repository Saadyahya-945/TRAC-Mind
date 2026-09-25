"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CASES, Case } from "@/lib/mock-data";
import styles from "./dashboard.module.css";

function formatSLA(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { label: "SLA breached", urgent: true };
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  if (hrs > 0) return { label: `${hrs}h ${mins % 60}m`, urgent: hrs < 1 };
  return { label: `${mins}m left`, urgent: mins < 30 };
}

function formatChannel(ch: string) {
  const MAP: Record<string, string> = { pwa: "PWA", sms: "SMS", voice: "Voice", ivrs: "IVRS" };
  return MAP[ch] ?? ch.toUpperCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [filterTier, setFilterTier] = useState<"all" | "high" | "medium" | "low">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_CASES.filter((c) => {
    if (filterTier !== "all" && c.tier !== filterTier) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.pseudoId.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q) ||
        c.assignedCounselor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const tierOrder = { high: 0, medium: 1, low: 2 };
    if (tierOrder[a.tier] !== tierOrder[b.tier]) return tierOrder[a.tier] - tierOrder[b.tier];
    return new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime();
  });

  const highCount   = MOCK_CASES.filter((c) => c.tier === "high").length;
  const mediumCount = MOCK_CASES.filter((c) => c.tier === "medium").length;
  const openCount   = MOCK_CASES.filter((c) => c.status === "open").length;

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-h1">Active Distress Triggers</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
            Dynamic clinical triage queue prioritizing high-risk cases and SLA deadlines.
          </p>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          Real-time Sync
        </div>
      </div>

      {/* Quick stats row */}
      <div className={styles.statsRow}>
        <div className="stat-card" onClick={() => setFilterTier("high")} style={{ cursor: "pointer" }}>
          <span className="stat-value" style={{ color: "var(--risk-high)" }}>{highCount}</span>
          <span className="stat-label">High Risk Cases</span>
        </div>
        <div className="stat-card" onClick={() => setFilterTier("medium")} style={{ cursor: "pointer" }}>
          <span className="stat-value" style={{ color: "var(--risk-medium)" }}>{mediumCount}</span>
          <span className="stat-label">Medium Risk</span>
        </div>
        <div className="stat-card" onClick={() => setFilterStatus("open")} style={{ cursor: "pointer" }}>
          <span className="stat-value">{openCount}</span>
          <span className="stat-label">Awaiting Triage</span>
        </div>
        <div className="stat-card" onClick={() => { setFilterTier("all"); setFilterStatus("all"); }} style={{ cursor: "pointer" }}>
          <span className="stat-value">{MOCK_CASES.length}</span>
          <span className="stat-label">Total Active</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={`input ${styles.searchInput}`}
            placeholder="Search pseudo-ID, language, counselor…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tier filter chips */}
        <div className={styles.filterChips} role="group" aria-label="Risk tier filter">
          {(["all", "high", "medium", "low"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.filterChip} ${filterTier === t ? styles.filterChipActive : ""}`}
              onClick={() => setFilterTier(t)}
            >
              {t === "all" ? "All Tiers" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Status filter dropdown */}
        <select
          className={`input ${styles.statusSelect}`}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Mobile Card View (renders on screens < 768px) */}
      <div className={styles.mobileCardList}>
        {sorted.length === 0 ? (
          <div className={styles.emptyState}>No cases match your active filters.</div>
        ) : (
          sorted.map((c) => {
            const sla = formatSLA(c.slaDueAt);
            return (
              <div
                key={c.id}
                className={styles.caseMobileCard}
                onClick={() => router.push(`/cases/${c.id}`)}
              >
                <div className={styles.mCardHead}>
                  <span className={styles.mCaseId}>{c.pseudoId}</span>
                  <span className={`risk-badge ${c.tier}`}>
                    {c.tier.toUpperCase()}
                  </span>
                </div>

                <div className={styles.mCardBody}>
                  <div className={styles.mDdiRow}>
                    <span className="text-xs text-muted">DDI Score</span>
                    <strong style={{
                      color: c.tier === "high" ? "var(--risk-high)" : c.tier === "medium" ? "var(--risk-medium)" : "var(--risk-low)",
                      fontSize: "1.25rem",
                    }}>{c.ddi}</strong>
                  </div>

                  <div className={styles.mMetaRow}>
                    <span>Channel: <strong>{formatChannel(c.channel)}</strong></span>
                    <span>Lang: <strong>{c.language}</strong></span>
                    <span>Counselor: <strong>{c.assignedCounselor}</strong></span>
                  </div>

                  <div className={styles.mSlaRow}>
                    <span className="text-xs text-muted">SLA Deadline:</span>
                    <span className={sla.urgent ? styles.slaUrgent : styles.slaNormal}>
                      {sla.label}
                    </span>
                  </div>
                </div>

                <div className={styles.mCardFoot}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Review Case →
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/cases/${c.id}/actions`);
                    }}
                  >
                    Action
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Triggers Table (hidden on mobile) */}
      <div className={styles.tableCard}>
        <table className="data-table" aria-label="Active triggers">
          <thead>
            <tr>
              <th>Pseudo-ID</th>
              <th>Risk Tier</th>
              <th>DDI Score</th>
              <th>Channel</th>
              <th>Language</th>
              <th>SLA Deadline</th>
              <th>Counselor</th>
              <th>Last Activity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "var(--sp-6)" }}>
                  No cases match your active filters.
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const sla = formatSLA(c.slaDueAt);
                return (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/cases/${c.id}`)}
                    aria-label={`View case ${c.pseudoId}`}
                  >
                    <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{c.pseudoId}</td>
                    <td>
                      <span className={`risk-badge ${c.tier}`}>
                        {c.tier.charAt(0).toUpperCase() + c.tier.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.ddiCell}>
                        <span style={{
                          color: c.tier === "high" ? "var(--risk-high)" : c.tier === "medium" ? "var(--risk-medium)" : "var(--risk-low)",
                          fontWeight: 700,
                        }}>{c.ddi}</span>
                        <div className={styles.ddiBar}>
                          <div
                            className={styles.ddiBarFill}
                            style={{
                              width: `${c.ddi}%`,
                              background: c.tier === "high" ? "var(--risk-high)" : c.tier === "medium" ? "var(--risk-medium)" : "var(--risk-low)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.channelTag}>{formatChannel(c.channel)}</span>
                    </td>
                    <td className="text-muted">{c.language}</td>
                    <td>
                      <span className={sla.urgent ? styles.slaUrgent : styles.slaNormal}>
                        {sla.label}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{c.assignedCounselor}</td>
                    <td className="text-sm text-muted">{formatTime(c.lastActivity)}</td>
                    <td>
                      <span className={`${styles.statusChip} ${styles[c.status.replace("_","")]}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cases/${c.id}`);
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
