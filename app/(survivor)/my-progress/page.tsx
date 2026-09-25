"use client";

import { useState } from "react";
import Link from "next/link";
import { SURVIVOR_TRAJECTORY } from "@/lib/mock-data";
import styles from "./progress.module.css";

function DDILineChart({
  data,
  selectedPoint,
  onSelectPoint,
}: {
  data: { day: string; ddi: number }[];
  selectedPoint: { day: string; ddi: number } | null;
  onSelectPoint: (p: { day: string; ddi: number }) => void;
}) {
  const W = 560, H = 200, PAD = { t: 20, r: 20, b: 40, l: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const maxDDI = 100;
  const xStep  = data.length > 1 ? innerW / (data.length - 1) : innerW;

  function x(i: number) { return PAD.l + i * xStep; }
  function y(v: number) { return PAD.t + innerH - (v / maxDDI) * innerH; }

  const points = data.map((d, i) => `${x(i)},${y(d.ddi)}`).join(" L ");
  const path = `M ${points}`;
  const area = `M ${x(0)},${y(0)} L ${points} L ${x(data.length - 1)},${PAD.t + innerH} L ${x(0)},${PAD.t + innerH} Z`;

  const y70 = y(70), y40 = y(40);
  const latestDDI = data[data.length - 1].ddi;
  const tier = latestDDI >= 70 ? "high" : latestDDI >= 40 ? "medium" : "low";
  const tierLabel = tier === "low" ? "Gentle — you are finding steady ground" : tier === "medium" ? "Moderate — steady breaths and support" : "Elevated — please talk with your counselor";

  return (
    <div className={styles.chartWrapper}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label="Wellbeing trend chart"
      >
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Risk zone background bands */}
        <rect x={PAD.l} y={y(100)}  width={innerW} height={y70 - y(100)} fill="rgba(201,82,107,.05)" />
        <rect x={PAD.l} y={y70}     width={innerW} height={y40 - y70}    fill="rgba(217,164,65,.05)" />
        <rect x={PAD.l} y={y40}     width={innerW} height={y(0) - y40}   fill="rgba(111,169,138,.05)" />

        {/* Gridlines */}
        {[0, 40, 70, 100].map((v) => (
          <line
            key={v}
            x1={PAD.l} x2={PAD.l + innerW}
            y1={y(v)} y2={y(v)}
            stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 40, 70, 100].map((v) => (
          <text key={v} x={PAD.l - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="var(--ink-faint)">{v}</text>
        ))}

        {/* Area fill */}
        <path d={area} fill="url(#area-fill)" />

        {/* Trend line */}
        <path d={path} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {data.map((d, i) => {
          const isSelected = selectedPoint?.day === d.day;
          return (
            <g key={d.day} onClick={() => onSelectPoint(d)} style={{ cursor: "pointer" }}>
              <circle
                cx={x(i)}
                cy={y(d.ddi)}
                r={isSelected ? 6 : 4}
                fill={isSelected ? "var(--risk-high)" : "#fff"}
                stroke={isSelected ? "var(--risk-high)" : "var(--brand)"}
                strokeWidth={isSelected ? 3 : 2}
              />
              <circle cx={x(i)} cy={y(d.ddi)} r={14} fill="transparent" />
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (data.length > 10 && i % 4 !== 0 && i !== data.length - 1) return null;
          return (
            <text key={d.day} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--ink-faint)">
              {d.day}
            </text>
          );
        })}
      </svg>

      {/* Selected point inspection tooltip */}
      {selectedPoint && (
        <div className={styles.activeTooltip}>
          <span>📅 {selectedPoint.day}</span>
          <span>·</span>
          <span>DDI Score: <strong>{selectedPoint.ddi}</strong></span>
          <span>·</span>
          <span>Status: <strong style={{ color: selectedPoint.ddi >= 70 ? "var(--risk-high)" : selectedPoint.ddi >= 40 ? "var(--risk-medium)" : "var(--risk-low)" }}>
            {selectedPoint.ddi >= 70 ? "High distress" : selectedPoint.ddi >= 40 ? "Moderate distress" : "Calm / Low distress"}
          </strong></span>
        </div>
      )}

      <div className={`risk-badge ${tier} ${styles.currentTier}`}>
        ● {tierLabel}
      </div>
    </div>
  );
}

export default function MyProgressPage() {
  const [timeframe, setTimeframe] = useState<7 | 14 | 30>(30);
  const slicedData = SURVIVOR_TRAJECTORY.slice(-timeframe);
  const [selectedPoint, setSelectedPoint] = useState<{ day: string; ddi: number } | null>(
    slicedData[slicedData.length - 1]
  );
  const [exportNotice, setExportNotice] = useState(false);

  const latestDDI = slicedData[slicedData.length - 1].ddi;
  const firstDDI  = slicedData[0].ddi;
  const delta     = latestDDI - firstDDI;

  function handleExport() {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  }

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ display: "flex", marginBottom: "var(--sp-1)" }}>
        <Link href="/home" className="btn btn-ghost btn-sm">
          ← Back to Home
        </Link>
      </div>

      <div className={styles.headerRow}>
        <div>
          <h1 className="text-h1 text-serif">My Wellbeing Journey</h1>
          <p className="text-body text-muted" style={{ marginTop: "var(--sp-1)" }}>
            A gentle reflection of your check-ins and recovery progress over time.
          </p>
        </div>

        {/* Timeframe pill tabs */}
        <div className={styles.timeTabs}>
          {[7, 14, 30].map((t) => (
            <button
              key={t}
              className={`${styles.timeTab} ${timeframe === t ? styles.timeTabActive : ""}`}
              onClick={() => {
                setTimeframe(t as 7 | 14 | 30);
                setSelectedPoint(null);
              }}
            >
              {t} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI stats */}
      <div className={styles.statsRow}>
        <div className={styles.statPill}>
          <div className={styles.statNum}>{latestDDI}</div>
          <div className={styles.statLbl}>Current DDI Score</div>
        </div>
        <div className={styles.statPill}>
          <div className={styles.statNum} style={{ color: delta <= 0 ? "var(--risk-low)" : "var(--risk-medium)" }}>
            {delta <= 0 ? `↓ ${Math.abs(delta)} pts` : `↑ ${delta} pts`}
          </div>
          <div className={styles.statLbl}>Net trend ({timeframe}d)</div>
        </div>
        <div className={styles.statPill}>
          <div className={styles.statNum}>18</div>
          <div className={styles.statLbl}>Check-ins completed</div>
        </div>
      </div>

      {/* Trajectory chart */}
      <DDILineChart
        data={slicedData}
        selectedPoint={selectedPoint}
        onSelectPoint={setSelectedPoint}
      />

      <div className={styles.disclaimer}>
        🔒 <strong>Private &amp; Trauma-Informed:</strong> This trajectory represents wellness trends from your voluntary check-ins and voice cadence. It is not an automated psychiatric diagnosis.
      </div>

      {/* Actionable Support Insights */}
      <div className={styles.insightsCard}>
        <div className={styles.insightHeader}>
          <span>💡</span>
          <h2 className="text-h2">Helpful routines for your score</h2>
        </div>
        <div className={styles.insightGrid}>
          <Link href="/buddy-voice" className={styles.insightItem}>
            <span>🎙️</span>
            <div>
              <div className="font-semibold text-ink">Voice check-ins with Buddy</div>
              <div className="text-xs text-muted">Speaking aloud releases vocal tension</div>
            </div>
          </Link>
          <Link href="/breathing" className={styles.insightItem}>
            <span>🌬️</span>
            <div>
              <div className="font-semibold text-ink">4-7-8 Deep breath cycles</div>
              <div className="text-xs text-muted">Reduces heart rate variability stress</div>
            </div>
          </Link>
          <Link href="/grounding" className={styles.insightItem}>
            <span>🌿</span>
            <div>
              <div className="font-semibold text-ink">5-4-3-2-1 Sensory Grounding</div>
              <div className="text-xs text-muted">Anchors attention to present safety</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Export / Share with counselor */}
      <div className={styles.exportSection}>
        <button className="btn btn-secondary btn-sm" onClick={handleExport}>
          📄 Download My Wellbeing Summary (PDF / Print)
        </button>
        {exportNotice && (
          <div className="text-sm text-brand animate-fade-in" style={{ fontWeight: 600 }}>
            ✓ Wellbeing summary compiled and ready for counselor review.
          </div>
        )}
      </div>
    </div>
  );
}
