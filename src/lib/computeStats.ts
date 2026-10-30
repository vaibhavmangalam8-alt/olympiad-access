import type { StatsDTO, UnitDTO } from "@/lib/queries";

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Recompute stats in the browser's local timezone from lecture state. */
export function computeStats(units: UnitDTO[]): StatsDTO {
  const all = units.flatMap((u) => u.lectures);
  const dates = all
    .filter((l) => l.completedAt)
    .map((l) => new Date(l.completedAt as string));

  const total = all.length;
  const done = dates.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const notesCount = all.filter((l) => l.notesUrl).length;

  const counts = new Map<string, number>();
  for (const d of dates) {
    const k = dayKey(d);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const now = new Date();
  const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const week = [] as StatsDTO["week"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = dayKey(d);
    week.push({
      key,
      label: labels[d.getDay()],
      count: counts.get(key) ?? 0,
      isToday: i === 0,
    });
  }

  let streak = 0;
  const cursor = new Date(now);
  if (!counts.has(dayKey(now))) cursor.setDate(cursor.getDate() - 1);
  while (counts.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    total,
    done,
    hwDone: all.filter((l) => l.hwCompletedAt).length,
    hwTotal: all.filter((l) => l.hwText || l.hwUrl).length,
    percent,
    todayCount: counts.get(dayKey(now)) ?? 0,
    streak,
    week,
    notesCount,
  };
}
