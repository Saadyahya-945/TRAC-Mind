// ─── TRAC-Mind Mock Data ────────────────────────────────────────────────────
// All data is fabricated for demo purposes only.

export type RiskTier = "low" | "medium" | "high";

export interface Case {
  id: string;
  pseudoId: string;
  channel: "sms" | "voice" | "pwa" | "ivrs";
  language: string;
  ddi: number;
  tier: RiskTier;
  slaDueAt: string; // ISO
  assignedCounselor: string;
  status: "open" | "in_progress" | "resolved";
  sanitizedTranscript: string[];
  trajectory: { day: string; ddi: number }[];
  biomarkers: {
    pitchVariance: number;
    hesitationLatency: number;
    shimmer: number;
    jitter: number;
  } | null;
  lastActivity: string;
}

export interface Counselor {
  id: string;
  name: string;
  role: "counselor" | "admin";
  caseCount: number;
}

export interface AuditEntry {
  id: string;
  actorName: string;
  entity: string;
  action: string;
  createdAt: string;
}

// ── 30-day DDI trajectories ───────────────────────────────────────────────

function generateTrajectory(
  baseScore: number,
  trend: "improving" | "worsening" | "stable"
): { day: string; ddi: number }[] {
  const days: { day: string; ddi: number }[] = [];
  let score = baseScore;
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const delta =
      trend === "improving"
        ? -Math.random() * 3 + 0.5
        : trend === "worsening"
        ? Math.random() * 3 - 0.5
        : (Math.random() - 0.5) * 2;
    score = Math.max(0, Math.min(100, score + delta));
    days.push({ day: label, ddi: Math.round(score) });
  }
  return days;
}

// ── Mock Cases ────────────────────────────────────────────────────────────

export const MOCK_CASES: Case[] = [
  {
    id: "case-001",
    pseudoId: "ANON-4821",
    channel: "pwa",
    language: "Hindi",
    ddi: 82,
    tier: "high",
    slaDueAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
    assignedCounselor: "Dr. Priya Nair",
    status: "open",
    sanitizedTranscript: [
      "I am feeling very unsafe at home.",
      "They threatened me again last night.",
      "I don't know who to call.",
      "I feel like no one will believe me.",
    ],
    trajectory: generateTrajectory(60, "worsening"),
    biomarkers: {
      pitchVariance: 4.2,
      hesitationLatency: 1.8,
      shimmer: 0.34,
      jitter: 0.09,
    },
    lastActivity: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "case-002",
    pseudoId: "ANON-7743",
    channel: "sms",
    language: "Marathi",
    ddi: 58,
    tier: "medium",
    slaDueAt: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
    assignedCounselor: "Rahul Mehta",
    status: "in_progress",
    sanitizedTranscript: [
      "Mala khup tras hoto ahe.",
      "Mazha mana swasth nahi.",
      "Counselor bhetaychi aahe mala.",
    ],
    trajectory: generateTrajectory(55, "stable"),
    biomarkers: {
      pitchVariance: 2.1,
      hesitationLatency: 1.1,
      shimmer: 0.18,
      jitter: 0.05,
    },
    lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "case-003",
    pseudoId: "ANON-3301",
    channel: "voice",
    language: "English",
    ddi: 31,
    tier: "low",
    slaDueAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    assignedCounselor: "Dr. Priya Nair",
    status: "in_progress",
    sanitizedTranscript: [
      "I feel a bit better this week.",
      "The breathing exercises really help.",
      "I want to continue the sessions.",
    ],
    trajectory: generateTrajectory(50, "improving"),
    biomarkers: null,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "case-004",
    pseudoId: "ANON-9912",
    channel: "ivrs",
    language: "Hindi",
    ddi: 74,
    tier: "high",
    slaDueAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    assignedCounselor: "Unassigned",
    status: "open",
    sanitizedTranscript: [
      "Mujhe darr lag raha hai.",
      "Koi meri madad karo.",
      "Mujhe ghar se bhaagna hai.",
    ],
    trajectory: generateTrajectory(70, "worsening"),
    biomarkers: {
      pitchVariance: 5.8,
      hesitationLatency: 2.4,
      shimmer: 0.51,
      jitter: 0.14,
    },
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "case-005",
    pseudoId: "ANON-2267",
    channel: "pwa",
    language: "English",
    ddi: 22,
    tier: "low",
    slaDueAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    assignedCounselor: "Rahul Mehta",
    status: "resolved",
    sanitizedTranscript: [
      "Things are much better now.",
      "I have connected with the legal aid team.",
      "Thank you for the support.",
    ],
    trajectory: generateTrajectory(65, "improving"),
    biomarkers: null,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Mock Counselors ───────────────────────────────────────────────────────

export const MOCK_COUNSELORS: Counselor[] = [
  { id: "c-001", name: "Dr. Priya Nair", role: "counselor", caseCount: 12 },
  { id: "c-002", name: "Rahul Mehta", role: "counselor", caseCount: 8 },
  { id: "c-003", name: "Admin Sharma", role: "admin", caseCount: 0 },
];

// ── Mock Audit Log ────────────────────────────────────────────────────────

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "a-001",
    actorName: "Dr. Priya Nair",
    entity: "Case ANON-4821",
    action: "Viewed case detail",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "a-002",
    actorName: "Rahul Mehta",
    entity: "Case ANON-7743",
    action: "Added counselor note",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "a-003",
    actorName: "Admin Sharma",
    entity: "Case ANON-9912",
    action: "Dispatched Legal Escort",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-004",
    actorName: "Dr. Priya Nair",
    entity: "Case ANON-3301",
    action: "Scheduled session",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-005",
    actorName: "System",
    entity: "Case ANON-4821",
    action: "Auto-escalated: SLA threshold crossed",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a-006",
    actorName: "Rahul Mehta",
    entity: "Case ANON-2267",
    action: "Marked case resolved",
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Mock Analytics ────────────────────────────────────────────────────────

export const MOCK_ANALYTICS = {
  totalCases: 214,
  activeCases: 47,
  slaCompliance: 91,
  channelMix: [
    { channel: "PWA", count: 98 },
    { channel: "SMS", count: 72 },
    { channel: "IVRS", count: 31 },
    { channel: "Voice Note", count: 13 },
  ],
  riskDistribution: [
    { tier: "Low", count: 131, color: "#6FA98A" },
    { tier: "Medium", count: 55, color: "#D9A441" },
    { tier: "High", count: 28, color: "#C9526B" },
  ],
  weeklyVolume: [
    { week: "W1", count: 48 },
    { week: "W2", count: 61 },
    { week: "W3", count: 53 },
    { week: "W4", count: 52 },
  ],
};

// ── Survivor mock DDI (for My Progress page) ────────────────────────────

export const SURVIVOR_TRAJECTORY = generateTrajectory(45, "improving");

// ── Mock chat messages (text check-in) ───────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "buddy";
  text: string;
  timestamp: string;
}

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "m-001",
    role: "buddy",
    text: "Hello. I'm here with you. How are you feeling today? You can share as much or as little as you'd like.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

export const BUDDY_RESPONSES: string[] = [
  "Thank you for sharing that with me. You're being very brave.",
  "I hear you. That sounds very difficult. You're not alone.",
  "It's okay to take a breath. Would you like to try the breathing exercise with me?",
  "You're doing the right thing by reaching out. I'm here to support you.",
  "Would you like me to connect you with a counselor, or would you prefer to talk more first?",
];
