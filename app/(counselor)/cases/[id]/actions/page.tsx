"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MOCK_CASES } from "@/lib/mock-data";
import styles from "./actions.module.css";

const ACTIONS = [
  {
    id: "legal-escort",
    icon: "⚖️",
    title: "Dispatch Legal Escort",
    desc: "Request a legal aid officer and police escort to the survivor's location within 2 hours.",
    warning: "This will contact state authorities. A counselor must confirm before dispatch.",
    tier: "medium" as const,
  },
  {
    id: "safe-haven",
    icon: "🏠",
    title: "Safe-Haven Relocation",
    desc: "Initiate emergency relocation to a state-registered safe house. Available for High Risk cases only.",
    warning: "This action is irreversible once confirmed. Ensure survivor consent is recorded.",
    tier: "high" as const,
  },
  {
    id: "phc-referral",
    icon: "🏥",
    title: "PHC Psychiatric Referral",
    desc: "Refer the survivor to the nearest Primary Health Centre for immediate psychiatric assessment.",
    warning: "This will share the case summary with the PHC. Verify data sharing consent.",
    tier: "medium" as const,
  },
];

export default function ClinicalActionsPage() {
  const params    = useParams();
  const router    = useRouter();
  const caseData  = MOCK_CASES.find((c) => c.id === params.id);

  const [pending,   setPending]   = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  function confirmAction(id: string) {
    setConfirmed(id);
    setPending(null);
  }

  if (!caseData) {
    return <p style={{ padding: "var(--sp-8)" }}>Case not found.</p>;
  }

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/cases/${caseData.id}`)}>
          ← Back to case
        </button>
        <div>
          <h1 className="text-h1">Clinical Action Center</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
            Case {caseData.pseudoId} · DDI {caseData.ddi} ·{" "}
            <span className={`risk-badge ${caseData.tier}`}>{caseData.tier}</span>
          </p>
        </div>
      </div>

      <div className={styles.warningBanner}>
        <span>⚠️</span>
        <p className="text-sm">
          All actions require counselor confirmation and are permanently logged in the audit trail. The safety layer may independently escalate High Risk cases.
        </p>
      </div>

      <div className={styles.actionCards}>
        {ACTIONS.map((action) => {
          const isConfirmed = confirmed === action.id;
          const isPending   = pending === action.id;

          return (
            <div
              key={action.id}
              className={`${styles.actionCard} ${isConfirmed ? styles.confirmed : ""}`}
            >
              <div className={styles.actionHeader}>
                <div className={styles.actionIcon}>{action.icon}</div>
                <div className={styles.actionMeta}>
                  <div className={styles.actionTitle}>{action.title}</div>
                  <div className={`text-sm text-muted ${styles.actionDesc}`}>{action.desc}</div>
                </div>
              </div>

              {!isConfirmed && !isPending && (
                <button
                  className={`btn ${action.tier === "high" ? "btn-danger" : "btn-secondary"}`}
                  onClick={() => setPending(action.id)}
                  style={{ alignSelf: "flex-start" }}
                >
                  Initiate
                </button>
              )}

              {isPending && (
                <div className={styles.confirmStep}>
                  <div className={styles.confirmWarning}>
                    <span>⚠️</span>
                    <p className="text-sm">{action.warning}</p>
                  </div>
                  <div className={styles.confirmBtns}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmAction(action.id)}
                    >
                      Confirm {action.title}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setPending(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isConfirmed && (
                <div className={styles.confirmedMsg}>
                  <span>✅</span>
                  <span className="text-sm">
                    <strong>{action.title}</strong> dispatched and logged in audit trail.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.noteSection}>
        <h2 className="text-h2" style={{ marginBottom: "var(--sp-4)" }}>Counselor note</h2>
        <textarea
          className="input"
          rows={4}
          placeholder="Add a confidential note about this session or action…"
          style={{ borderRadius: "var(--r-md)", resize: "vertical" }}
          aria-label="Counselor note"
        />
        <button className="btn btn-secondary btn-sm" style={{ marginTop: "var(--sp-3)", alignSelf: "flex-start" }}>
          Save note (encrypted)
        </button>
      </div>
    </div>
  );
}
