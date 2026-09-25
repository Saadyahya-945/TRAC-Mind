// ─── TRAC-Mind Structured Survivor Check-in Memory ────────────────────────────
// Lightweight, privacy-first continuous memory across check-in sessions.
// Stored locally in the user's browser session / storage.
// Never exposes internal JSON to the user.

export interface CheckInRecord {
  id: string;
  date: string; // ISO string
  emotional_state: string; // e.g., "overwhelmed", "anxious", "calm", "improving"
  concerns: string[]; // e.g., ["sleep", "stress", "intimidation"]
  support_used?: string[]; // e.g., ["breathing", "grounding", "chat"]
  counselor_requested: boolean;
  safety_flag: boolean;
}

const MEMORY_STORAGE_KEY = "trac_buddy_checkin_memory";

export function loadCheckInMemory(): CheckInRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCheckInRecord(record: Omit<CheckInRecord, "id" | "date"> & { date?: string }): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCheckInMemory();
    const newEntry: CheckInRecord = {
      id: `chk-${Date.now()}`,
      date: record.date || new Date().toISOString(),
      emotional_state: record.emotional_state,
      concerns: record.concerns || [],
      support_used: record.support_used || [],
      counselor_requested: !!record.counselor_requested,
      safety_flag: !!record.safety_flag,
    };

    // Keep up to 10 historical check-ins
    const updated = [newEntry, ...existing.slice(0, 9)];
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("[BuddyMemory] Failed to save check-in record:", err);
  }
}

/**
 * Format previous check-in context for Gemini prompt injection.
 * Kept concise and non-intrusive (Req 6, 7, 8, 9).
 */
export function getRecentMemoryContext(): string | null {
  const records = loadCheckInMemory();
  if (records.length === 0) return null;

  const latest = records[0];
  const dateObj = new Date(latest.date);
  const now = new Date();
  const diffHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

  // Only provide memory context if the check-in was within the last 72 hours
  if (diffHours > 72) return null;

  const timeLabel = diffHours < 18 ? "earlier today" : diffHours < 36 ? "yesterday" : "a few days ago";

  return `PREVIOUS CHECK-IN CONTEXT (${timeLabel}):
- Emotional state: ${latest.emotional_state}
- Concerns mentioned: ${latest.concerns.length > 0 ? latest.concerns.join(", ") : "general stress"}
- Support tools used: ${latest.support_used && latest.support_used.length > 0 ? latest.support_used.join(", ") : "none"}
- Counselor requested: ${latest.counselor_requested ? "Yes" : "No"}
Guidance: If relevant, ask gently how they are doing today or follow up on their sleep/stress. Do not make them feel monitored or interrogative. If they feel better now, encourage them forward.`;
}
