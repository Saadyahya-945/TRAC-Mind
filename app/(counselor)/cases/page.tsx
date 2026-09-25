"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CASES, Case } from "@/lib/mock-data";
import styles from "./cases.module.css";

export default function CasesPage() {
  const router = useRouter();
  const [filterTier, setFilterTier] = useState<"all" | "high" | "medium" | "low">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"ddi" | "activity" | "pseudo">("ddi");

  const filtered = MOCK_CASES.filter((c) => {
    if (filterTier !== "all" && c.tier !== filterTier) return false;
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
    if (sortBy === "ddi") return b.ddi - a.ddi;
    if (sortBy === "activity") return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    return a.pseudoId.localeCompare(b.pseudoId);
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 className="text-h1">All Caseload</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
            Complete registry of active survivor cases under care team monitoring.
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={`input ${styles.searchInput}`}
            placeholder="Search pseudo-ID, language, or counselor…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.tierChips}>
          {(["all", "high", "medium", "low"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.tierChip} ${filterTier === t ? styles.tierChipActive : ""}`}
              onClick={() => setFilterTier(t)}
            >
              {t === "all" ? "All Cases" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <select
          className={`input ${styles.sortSelect}`}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="ddi">Sort by Highest DDI</option>
          <option value="activity">Sort by Recent Activity</option>
          <option value="pseudo">Sort by Pseudo ID</option>
        </select>
      </div>

      {/* Case list */}
      <div className={styles.list}>
        {sorted.length === 0 ? (
          <div className={styles.emptyState}>No cases found matching your criteria.</div>
        ) : (
          sorted.map((c) => (
            <div
              key={c.id}
              className={styles.caseRow}
              onClick={() => router.push(`/cases/${c.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View case ${c.pseudoId}`}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/cases/${c.id}`)}
            >
              <div className={styles.caseLeft}>
                <span className={styles.caseId}>{c.pseudoId}</span>
                <span className={`risk-badge ${c.tier}`}>{c.tier.toUpperCase()}</span>
              </div>

              <div className={styles.caseMid}>
                <div className="text-sm font-semibold text-ink">
                  {c.channel.toUpperCase()} Check-in · {c.language}
                </div>
                <div className="text-xs text-muted">
                  Assigned: {c.assignedCounselor} · Status: <span style={{ textTransform: "capitalize" }}>{c.status.replace("_", " ")}</span>
                </div>
              </div>

              <div className={styles.caseRight}>
                <div className={styles.ddiScore} style={{
                  color: c.tier === "high" ? "var(--risk-high)" : c.tier === "medium" ? "var(--risk-medium)" : "var(--risk-low)"
                }}>
                  {c.ddi}
                </div>
                <span className="text-xs text-faint font-semibold">DDI SCORE</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
