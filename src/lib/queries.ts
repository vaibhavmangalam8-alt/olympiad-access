import { db } from "@/db";
import { courses, lectureProgress, lectures, units } from "@/db/schema";
import { CATALOG } from "@/lib/catalog";
import { CURATED_IOQM25 } from "@/lib/curriculum";
import { asc, eq, sql } from "drizzle-orm";

/* ================= DTOs ================= */

export interface LectureDTO {
  id: number;
  dayNumber: number;
  topic: string;
  sub: string | null;
  kind: "lecture" | "external" | "practice";
  videoId: string | null;
  videoUrl: string | null;
  notesUrl: string | null;
  hwText: string | null;
  hwUrl: string | null;
  completedAt: string | null;
  hwCompletedAt: string | null;
}

export interface UnitDTO {
  id: number;
  name: string;
  code: string;
  lectures: LectureDTO[];
}

export interface CourseDTO {
  id: number;
  code: string;
  name: string;
  tag: string;
  blurb: string;
}

export interface WeekDay {
  key: string;
  label: string;
  count: number;
  isToday: boolean;
}

export interface StatsDTO {
  total: number;
  done: number;
  hwDone: number;
  hwTotal: number;
  percent: number;
  todayCount: number;
  streak: number;
  week: WeekDay[];
  notesCount: number;
}

export interface WorkspaceDTO {
  course: CourseDTO;
  units: UnitDTO[];
  stats: StatsDTO;
}

export interface CatalogCourseDTO extends CourseDTO {
  total: number;
  done: number;
  externalCount: number;
}

export interface CatalogDTO {
  courses: CatalogCourseDTO[];
  stats: StatsDTO;
}

/* ================= Seeding ================= */

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const existing = await db.select({ id: courses.id }).from(courses).limit(1);
      if (existing.length > 0) return;

      await db.transaction(async (tx) => {
        for (let c = 0; c < CATALOG.length; c++) {
          const cat = CATALOG[c];
          const [courseRow] = await tx
            .insert(courses)
            .values({
              code: cat.code,
              name: cat.name,
              tag: cat.tag,
              blurb: cat.blurb,
              sortOrder: c + 1,
            })
            .returning({ id: courses.id });

          // curated course: fall back to the hand-verified lecture list
          const catUnits =
            cat.curated || cat.units.length === 0
              ? CURATED_IOQM25.map((u) => ({
                  title: u.name,
                  lectures: u.lectures.map((l) => ({
                    topic: l.topic,
                    kind: "lecture" as const,
                    videoId: l.videoId,
                    videoUrl: l.videoUrl,
                    notesUrl: l.notesUrl,
                    hwText: null,
                    hwUrl: null,
                  })),
                }))
              : cat.units;

          let day = 1;
          for (let u = 0; u < catUnits.length; u++) {
            const cu = catUnits[u];
            if (cu.lectures.length === 0) continue;
            const [unitRow] = await tx
              .insert(units)
              .values({
                courseId: courseRow.id,
                name: cu.title,
                code: `CH${String(u + 1).padStart(2, "0")}`,
                sortOrder: u + 1,
              })
              .returning({ id: units.id });

            for (let l = 0; l < cu.lectures.length; l++) {
              const lec = cu.lectures[l];
              await tx.insert(lectures).values({
                unitId: unitRow.id,
                dayNumber: day++,
                topic: lec.topic,
                sub: "sub" in lec ? (lec.sub ?? null) : null,
                kind: lec.kind,
                videoId: lec.videoId,
                videoUrl: lec.videoUrl,
                notesUrl: lec.notesUrl,
                hwText: lec.hwText,
                hwUrl: lec.hwUrl,
                sortOrder: l + 1,
              });
            }
          }
        }
      });
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

/* ================= Stats ================= */

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function buildStats(
  rows: {
    completedAt: Date | null;
    hwCompletedAt: Date | null;
    notesUrl: string | null;
    hwText: string | null;
    hwUrl?: string | null;
  }[],
): StatsDTO {
  const total = rows.length;
  const doneDates = rows.filter((r) => r.completedAt).map((r) => r.completedAt as Date);
  const hwDates = rows.filter((r) => r.hwCompletedAt).map((r) => r.hwCompletedAt as Date);
  const done = doneDates.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const counts = new Map<string, number>();
  for (const d of doneDates) {
    const k = dayKey(d);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const now = new Date();
  const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const week: WeekDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = dayKey(d);
    week.push({ key, label: labels[d.getDay()], count: counts.get(key) ?? 0, isToday: i === 0 });
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
    hwDone: hwDates.length,
    hwTotal: rows.filter((r) => r.hwText || r.hwUrl).length,
    percent,
    todayCount: counts.get(dayKey(now)) ?? 0,
    streak,
    week,
    notesCount: rows.filter((r) => r.notesUrl).length,
  };
}

/* ================= Queries ================= */

export async function getCourseWorkspace(code: string): Promise<WorkspaceDTO | null> {
  await ensureSeeded();

  const [course] = await db.select().from(courses).where(eq(courses.code, code)).limit(1);
  if (!course) return null;

  const unitRows = await db
    .select()
    .from(units)
    .where(eq(units.courseId, course.id))
    .orderBy(asc(units.sortOrder));

  const lectureRows = await db
    .select({
      id: lectures.id,
      unitId: lectures.unitId,
      dayNumber: lectures.dayNumber,
      topic: lectures.topic,
      sub: lectures.sub,
      kind: lectures.kind,
      videoId: lectures.videoId,
      videoUrl: lectures.videoUrl,
      notesUrl: lectures.notesUrl,
      hwText: lectures.hwText,
      hwUrl: lectures.hwUrl,
      completedAt: lectureProgress.completedAt,
      hwCompletedAt: lectureProgress.hwCompletedAt,
    })
    .from(lectures)
    .leftJoin(lectureProgress, eq(lectureProgress.lectureId, lectures.id))
    .orderBy(asc(lectures.dayNumber))
    .where(eq(units.courseId, course.id))
    .innerJoin(units, eq(lectures.unitId, units.id));

  const unitMap = new Map<number, UnitDTO>();
  for (const u of unitRows) {
    unitMap.set(u.id, { id: u.id, name: u.name, code: u.code, lectures: [] });
  }
  for (const l of lectureRows) {
    unitMap.get(l.unitId)?.lectures.push({
      id: l.id,
      dayNumber: l.dayNumber,
      topic: l.topic,
      sub: l.sub,
      kind: l.kind as LectureDTO["kind"],
      videoId: l.videoId,
      videoUrl: l.videoUrl,
      notesUrl: l.notesUrl,
      hwText: l.hwText,
      hwUrl: l.hwUrl,
      completedAt: l.completedAt ? l.completedAt.toISOString() : null,
      hwCompletedAt: l.hwCompletedAt ? l.hwCompletedAt.toISOString() : null,
    });
  }

  return {
    course: { id: course.id, code: course.code, name: course.name, tag: course.tag, blurb: course.blurb },
    units: Array.from(unitMap.values()),
    stats: buildStats(
      lectureRows.map((l) => ({
        completedAt: l.completedAt,
        hwCompletedAt: l.hwCompletedAt,
        notesUrl: l.notesUrl,
        hwText: l.hwText,
      })),
    ),
  };
}

export async function getCatalog(): Promise<CatalogDTO> {
  await ensureSeeded();

  const courseRows = await db.select().from(courses).orderBy(asc(courses.sortOrder));
  const rows = await db
    .select({
      courseId: units.courseId,
      kind: lectures.kind,
      completedAt: lectureProgress.completedAt,
      hwCompletedAt: lectureProgress.hwCompletedAt,
      notesUrl: lectures.notesUrl,
      hwText: lectures.hwText,
    })
    .from(lectures)
    .innerJoin(units, eq(lectures.unitId, units.id))
    .leftJoin(lectureProgress, eq(lectureProgress.lectureId, lectures.id));

  const byCourse = new Map<number, typeof rows>();
  for (const r of rows) {
    if (!byCourse.has(r.courseId)) byCourse.set(r.courseId, []);
    byCourse.get(r.courseId)!.push(r);
  }

  const out: CatalogCourseDTO[] = courseRows.map((c) => {
    const rr = byCourse.get(c.id) ?? [];
    const done = rr.filter((r) => r.completedAt).length;
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      tag: c.tag,
      blurb: c.blurb,
      total: rr.length,
      done,
      externalCount: rr.filter((r) => r.kind !== "lecture").length,
    };
  });

  return {
    courses: out,
    stats: buildStats(rows),
  };
}

/* ================= Mutations ================= */

export async function setLectureCompleted(lectureId: number, completed: boolean) {
  await ensureSeeded();
  if (completed) {
    await db
      .insert(lectureProgress)
      .values({ lectureId, completedAt: new Date() })
      .onConflictDoNothing({ target: lectureProgress.lectureId });
    const [row] = await db
      .select({ completedAt: lectureProgress.completedAt })
      .from(lectureProgress)
      .where(eq(lectureProgress.lectureId, lectureId));
    return { ok: true as const, completedAt: row?.completedAt?.toISOString() ?? null };
  }
  await db.delete(lectureProgress).where(eq(lectureProgress.lectureId, lectureId));
  return { ok: true as const, completedAt: null };
}

export async function setHomeworkDone(lectureId: number, done: boolean) {
  await ensureSeeded();
  if (done) {
    await db
      .insert(lectureProgress)
      .values({ lectureId, completedAt: new Date(), hwCompletedAt: new Date() })
      .onConflictDoUpdate({
        target: lectureProgress.lectureId,
        set: { hwCompletedAt: new Date() },
      });
  } else {
    await db
      .update(lectureProgress)
      .set({ hwCompletedAt: null })
      .where(eq(lectureProgress.lectureId, lectureId));
  }
  const [row] = await db
    .select({ hwCompletedAt: lectureProgress.hwCompletedAt })
    .from(lectureProgress)
    .where(eq(lectureProgress.lectureId, lectureId));
  return { ok: true as const, hwCompletedAt: row?.hwCompletedAt?.toISOString() ?? null };
}
