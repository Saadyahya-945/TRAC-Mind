"use client";

import { useState, useEffect } from "react";
import { MOCK_CASES } from "@/lib/mock-data";
import styles from "./sessions.module.css";

const INITIAL_SESSIONS = [
  { id: "s-1", caseId: "case-001", date: "2026-09-26", time: "10:00", mode: "Online", status: "upcoming", counselor: "Dr. Priya Nair" },
  { id: "s-2", caseId: "case-002", date: "2026-09-26", time: "14:30", mode: "Offline", status: "upcoming", counselor: "Dr. Priya Nair" },
  { id: "s-3", caseId: "case-003", date: "2026-09-24", time: "11:00", mode: "Online", status: "completed", counselor: "Dr. Priya Nair" },
  { id: "s-4", caseId: "case-005", date: "2026-09-23", time: "15:00", mode: "Online", status: "completed", counselor: "Dr. Priya Nair" },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [tab, setTab] = useState<"all" | "upcoming" | "completed">("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ caseId: "", date: "", time: "", mode: "Online" });
  const [formErrors, setFormErrors] = useState<{ caseId?: string; date?: string; time?: string }>({});
  const [toastMsg, setToastMsg] = useState("");

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  function openModal() {
    setForm({ caseId: "", date: "", time: "", mode: "Online" });
    setFormErrors({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setFormErrors({});
  }

  function handleScheduleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Explicit validation as per Requirement 7
    const errors: { caseId?: string; date?: string; time?: string } = {};
    if (!form.caseId.trim()) {
      errors.caseId = "Please select a survivor case.";
    }
    if (!form.date.trim()) {
      errors.date = "Please select a date.";
    }
    if (!form.time.trim()) {
      errors.time = "Please select a time.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success: add session to upcoming
    setSessions((prev) => [
      { id: `s-${Date.now()}`, ...form, status: "upcoming", counselor: "Dr. Priya Nair" },
      ...prev,
    ]);
    closeModal();
    showToast("✓ Clinical consultation scheduled and confirmation SMS dispatched.");
  }

  function handleCancelSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session cancelled and slot cleared.");
  }

  const displayedSessions = sessions.filter((s) => {
    if (tab === "upcoming") return s.status === "upcoming";
    if (tab === "completed") return s.status === "completed";
    return true;
  });

  function getCasePseudo(caseId: string) {
    return MOCK_CASES.find((c) => c.id === caseId)?.pseudoId ?? caseId;
  }

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-h1">Clinical Care Sessions</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
            Tele-MANAS and in-person psychiatric counseling schedules.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + Schedule New Session
        </button>
      </div>

      {toastMsg && (
        <div className={styles.toastAlert} role="status" aria-live="polite">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabStrip}>
        {(["all", "upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "all" ? "All Sessions" : t.charAt(0).toUpperCase() + t.slice(1)} ({
              t === "all" ? sessions.length : sessions.filter((s) => s.status === t).length
            })
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className={styles.sessionList}>
        {displayedSessions.length === 0 ? (
          <div className={styles.emptyState}>No sessions found for this filter.</div>
        ) : (
          displayedSessions.map((s) => (
            <div key={s.id} className={`${styles.sessionCard} ${s.status === "completed" ? styles.completedCard : ""}`}>
              <div className={styles.sessionDate}>
                <div className={styles.sessionDay}>{new Date(s.date).getDate()}</div>
                <div className={styles.sessionMonth}>
                  {new Date(s.date).toLocaleString("en-IN", { month: "short" })}
                </div>
              </div>

              <div className={styles.sessionInfo}>
                <div className={styles.sessionCase}>Case {getCasePseudo(s.caseId)}</div>
                <div className="text-sm text-muted">
                  {s.time} · {s.mode} {s.mode === "Online" ? "📹 Tele-health" : "🏢 Clinic"} · {s.counselor}
                </div>
              </div>

              <div className={styles.sessionActions}>
                {s.status === "upcoming" ? (
                  <>
                    <span className={styles.upcomingBadge}>Upcoming</span>
                    {s.mode === "Online" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => showToast(`Launching secure video session with Case ${getCasePseudo(s.caseId)}…`)}
                      >
                        Join Call
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => showToast(`SMS reminder sent to survivor for Case ${getCasePseudo(s.caseId)}.`)}
                      title="Send SMS reminder"
                    >
                      📲 Remind
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleCancelSession(s.id)}
                      title="Cancel session"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className={styles.completedBadge}>✓ Completed</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Consultation Modal (Req 7, 8, 9) */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal} role="presentation">
          <div
            className={styles.glassModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sched-modal-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalIconBadge}>📅</div>
              <div>
                <h2 id="sched-modal-title" className={styles.modalTitle}>Schedule Clinical Consultation</h2>
                <p className="text-xs text-muted">Case triage session with automated SMS dispatch</p>
              </div>
            </div>

            <form onSubmit={handleScheduleSubmit} className={styles.modalForm} noValidate>
              {/* Select Case */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Select Case <span className={styles.reqStar}>*</span>
                </label>
                <select
                  className={`input ${formErrors.caseId ? styles.inputError : ""}`}
                  value={form.caseId}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, caseId: e.target.value }));
                    if (formErrors.caseId) setFormErrors((err) => ({ ...err, caseId: undefined }));
                  }}
                >
                  <option value="">Select survivor case…</option>
                  {MOCK_CASES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.pseudoId} (DDI {c.ddi} · {c.tier.toUpperCase()})
                    </option>
                  ))}
                </select>
                {formErrors.caseId && (
                  <span className={styles.errorText} role="alert">{formErrors.caseId}</span>
                )}
              </div>

              {/* Date & Time */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Date <span className={styles.reqStar}>*</span>
                  </label>
                  <input
                    type="date"
                    className={`input ${formErrors.date ? styles.inputError : ""}`}
                    value={form.date}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, date: e.target.value }));
                      if (formErrors.date) setFormErrors((err) => ({ ...err, date: undefined }));
                    }}
                  />
                  {formErrors.date && (
                    <span className={styles.errorText} role="alert">{formErrors.date}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Time <span className={styles.reqStar}>*</span>
                  </label>
                  <input
                    type="time"
                    className={`input ${formErrors.time ? styles.inputError : ""}`}
                    value={form.time}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, time: e.target.value }));
                      if (formErrors.time) setFormErrors((err) => ({ ...err, time: undefined }));
                    }}
                  />
                  {formErrors.time && (
                    <span className={styles.errorText} role="alert">{formErrors.time}</span>
                  )}
                </div>
              </div>

              {/* Mode */}
              <div className={styles.field}>
                <label className={styles.label}>Consultation Mode</label>
                <select
                  className="input"
                  value={form.mode}
                  onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                >
                  <option value="Online">Online (Tele-MANAS Video / Audio Call)</option>
                  <option value="Offline">In-Person (District PHC / Clinical Safe-Haven)</option>
                </select>
              </div>

              <div className={styles.modalBtns}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm &amp; Send SMS Invite
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
