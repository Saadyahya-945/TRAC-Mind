"use client";

import { MOCK_ANALYTICS } from "@/lib/mock-data";
import styles from "./analytics.module.css";

function BarChart({ data, valueKey, labelKey, colorKey }: {
  data: Record<string, unknown>[];
  valueKey: string;
  labelKey: string;
  colorKey?: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className={styles.barChart}>
      {data.map((d, i) => {
        const pct = (Number(d[valueKey]) / max) * 100;
        const color = colorKey ? String(d[colorKey]) : "var(--brand)";
        return (
          <div key={i} className={styles.barItem}>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${pct}%`, background: color }}
                title={`${d[labelKey]}: ${d[valueKey]}`}
              />
            </div>
            <div className={styles.barLabel}>
              <span>{String(d[labelKey])}</span>
              <span className={styles.barValue}>{String(d[valueKey])}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const a = MOCK_ANALYTICS;

  return (
    <div className="animate-fade-in">
      <h1 className="text-h1" style={{ marginBottom: "var(--sp-8)" }}>Analytics</h1>

      {/* KPI stat row */}
      <div className={styles.kpiRow}>
        <div className="stat-card">
          <span className="stat-value">{a.totalCases}</span>
          <span className="stat-label">Total cases</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: "var(--risk-medium)" }}>{a.activeCases}</span>
          <span className="stat-label">Active cases</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: "var(--risk-low)" }}>{a.slaCompliance}%</span>
          <span className="stat-label">SLA compliance</span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Risk distribution */}
        <div className="card-elevated">
          <h2 className={`text-h2 ${styles.chartTitle}`}>Risk distribution</h2>
          <BarChart
            data={a.riskDistribution}
            valueKey="count"
            labelKey="tier"
            colorKey="color"
          />
          <div className={styles.legend}>
            {a.riskDistribution.map((d) => (
              <div key={d.tier} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: d.color }} />
                <span className="text-sm text-muted">{d.tier}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel mix */}
        <div className="card-elevated">
          <h2 className={`text-h2 ${styles.chartTitle}`}>Channel mix</h2>
          <BarChart
            data={a.channelMix}
            valueKey="count"
            labelKey="channel"
          />
        </div>

        {/* Weekly volume */}
        <div className="card-elevated" style={{ gridColumn: "span 2" }}>
          <h2 className={`text-h2 ${styles.chartTitle}`}>Weekly volume</h2>
          <div className={styles.weekChart}>
            {a.weeklyVolume.map((w) => {
              const max = Math.max(...a.weeklyVolume.map((v) => v.count));
              const h = (w.count / max) * 120;
              return (
                <div key={w.week} className={styles.weekBar}>
                  <div className={styles.weekCount}>{w.count}</div>
                  <div
                    className={styles.weekFill}
                    style={{ height: `${h}px` }}
                    title={`${w.week}: ${w.count} cases`}
                  />
                  <div className={styles.weekLabel}>{w.week}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
