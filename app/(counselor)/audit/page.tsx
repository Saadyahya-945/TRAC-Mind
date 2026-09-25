"use client";

import { MOCK_AUDIT } from "@/lib/mock-data";
import styles from "./audit.module.css";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLogPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className="text-h1">Audit Log</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
            Every access and action is permanently recorded.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm">Export CSV</button>
      </div>

      <div className={styles.tableCard}>
        <table className="data-table" aria-label="Audit log">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Entity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.map((entry) => (
              <tr key={entry.id} style={{ cursor: "default" }}>
                <td className={`text-sm ${styles.timestamp}`}>{formatDateTime(entry.createdAt)}</td>
                <td>
                  <span className={styles.actor}>{entry.actorName}</span>
                </td>
                <td className={`text-sm ${styles.entity}`}>{entry.entity}</td>
                <td className="text-sm text-muted">{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.notice}>
        🔒 Audit logs are immutable and tamper-evident. Retained per DPDP Act 2023 and internal policy.
      </div>
    </div>
  );
}
