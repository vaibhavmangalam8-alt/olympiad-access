"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ListChecks,
  Sparkles,
} from "lucide-react";
import BurstEmitter, { type BurstHandle } from "@/components/BurstEmitter";
import Marquee from "@/components/Marquee";
import OrbitCanvas from "@/components/OrbitCanvas";
import StatsPanel from "@/components/StatsPanel";
import UnitSection from "@/components/UnitSection";
import VideoModal from "@/components/VideoModal";
import { computeStats } from "@/lib/computeStats";
import { resolveVideoId } from "@/lib/video";
import type { LectureDTO, StatsDTO, UnitDTO, WorkspaceDTO } from "@/lib/queries";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CourseSurface({ initial }: { initial: WorkspaceDTO }) {
  const [units, setUnits] = useState<UnitDTO[]>(initial.units);
  const [stats, setStats] = useState<StatsDTO>(initial.stats);
  const [playing, setPlaying] = useState<LectureDTO | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [syncFailed, setSyncFailed] = useState(false);
  const burstRef = useRef<BurstHandle>(null);
  const course = initial.course;

  useEffect(() => {
    setStats(computeStats(units));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const flat = useMemo(() => units.flatMap((u) => u.lectures), [units]);

  const nextLectureId = useMemo(() => {
    const next = flat.find((l) => !l.completedAt);
    return next ? next.id : null;
  }, [flat]);

  // sequential gating: a step is locked until every step before it is done
  const lockedIds = useMemo(() => {
    const set = new Set<number>();
    let blocked = false;
    for (const l of flat) {
      if (blocked) set.add(l.id);
      else if (!l.completedAt) blocked = true;
    }
    return set;
  }, [flat]);

  const patchLecture = useCallback(
    (id: number, patch: Partial<Pick<LectureDTO, "completedAt" | "hwCompletedAt">>) => {
      setUnits((prev) =>
        prev.map((u) => ({
          ...u,
          lectures: u.lectures.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      );
    },
    [],
  );

  const handleToggle = useCallback(
    (lecture: LectureDTO, ev: React.MouseEvent) => {
      const willComplete = lecture.completedAt === null;
      if (willComplete) {
        const rect = ev.currentTarget.getBoundingClientRect();
        burstRef.current?.burst(
          ev.clientX || rect.left + rect.width / 2,
          ev.clientY || rect.top + rect.height / 2,
          1,
        );
      }
      patchLecture(lecture.id, { completedAt: willComplete ? new Date().toISOString() : null });
      fetch(`/api/lectures/${lecture.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: willComplete }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("sync failed");
          setSyncFailed(false);
        })
        .catch(() => {
          patchLecture(lecture.id, { completedAt: lecture.completedAt });
          setSyncFailed(true);
        });
    },
    [patchLecture],
  );

  const handleToggleHw = useCallback(
    (lecture: LectureDTO, ev: React.MouseEvent) => {
      const willDo = lecture.hwCompletedAt === null;
      if (willDo) {
        const rect = ev.currentTarget.getBoundingClientRect();
        burstRef.current?.burst(
          ev.clientX || rect.left + rect.width / 2,
          ev.clientY || rect.top + rect.height / 2,
          0.7,
        );
      }
      patchLecture(lecture.id, { hwCompletedAt: willDo ? new Date().toISOString() : null });
      fetch(`/api/lectures/${lecture.id}/hw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: willDo }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("sync failed");
          setSyncFailed(false);
        })
        .catch(() => {
          patchLecture(lecture.id, { hwCompletedAt: lecture.hwCompletedAt });
          setSyncFailed(true);
        });
    },
    [patchLecture],
  );

  const resumeNext = useCallback(() => {
    if (nextLectureId == null) return;
    const el = document.getElementById(`lecture-${nextLectureId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(nextLectureId);
    window.setTimeout(() => setHighlightedId(null), 2600);
  }, [nextLectureId]);

  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const hwOpen = stats.hwTotal - stats.hwDone;

  return (
    <div className="relative min-h-screen">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-(--color-volt)"
        style={{ scaleX: barScale }}
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b hairline bg-(--color-ink)/78 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="absolute inset-0 rounded-full border border-(--color-volt)/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-(--color-volt)" />
            </span>
            <span className="mono-label text-(--color-paper)">OLY</span>
          </Link>
          <Link
            href="/"
            className="mono-label flex items-center gap-1.5 text-(--color-mist) transition hover:text-(--color-volt)"
          >
            <ArrowLeft size={13} /> ALL TRACKS
          </Link>
          <span className="mono-label hidden text-(--color-faint) sm:block">/</span>
          <span className="mono-label hidden text-(--color-volt) sm:block">{course.code}</span>

          <div className="ms-auto flex items-center gap-3">
            {syncFailed && (
              <span className="mono-label rounded-full border border-(--color-ember)/50 px-2.5 py-1 text-(--color-ember)">
                SYNC FAILED — RETRY
              </span>
            )}
            <span className="mono-label rounded-full border hairline px-3 py-1.5 text-(--color-mist)">
              {stats.done}
              <span className="text-(--color-faint)"> / {stats.total} DONE</span>
            </span>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="orb h-[420px] w-[420px] bg-(--color-volt)/14 -top-40 -left-24" />
        <div className="orb h-[360px] w-[360px] bg-(--color-ember)/10 top-32 right-[-120px]" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mono-label flex items-center gap-2 text-(--color-mist)"
            >
              {course.tag} TRACK · {course.code}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
              className="mt-5 font-serif-d text-[clamp(2.6rem,7vw,5.2rem)] italic leading-[1.02] tracking-tight"
            >
              {course.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-(--color-mist)"
            >
              {course.blurb}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.8 }}
              className="mono-label mt-4 text-(--color-faint)"
            >
              {stats.total} STEPS · {units.length} CHAPTERS · {stats.hwTotal} HOMEWORK SETS
              {hwOpen > 0 && stats.done > 0 ? ` · ${hwOpen} HW OPEN` : ""}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.36 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={resumeNext}
                disabled={nextLectureId == null}
                className="group flex h-12 items-center gap-3 rounded-full bg-(--color-volt) px-6 text-[0.78rem] font-semibold tracking-[0.16em] text-(--color-ink) transition hover:brightness-110 disabled:opacity-40"
              >
                {nextLectureId == null ? "TRACK COMPLETE" : "RESUME NEXT STEP"}
                <ArrowDownRight
                  size={15}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </button>
              <a
                href="#syllabus"
                className="flex h-12 items-center gap-3 rounded-full border hairline px-6 text-[0.78rem] font-semibold tracking-[0.16em] text-(--color-paper) transition hover:border-(--color-volt)/60"
              >
                SYLLABUS
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 36, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-10 opacity-60">
              <OrbitCanvas />
            </div>
            <StatsPanel stats={stats} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Marquee />
        </motion.div>
      </section>

      {/* ============ SYLLABUS ============ */}
      <main id="syllabus" className="relative scroll-mt-16 pb-28">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="mono-label text-(--color-volt)">THE FULL PATH</p>
              <h2 className="mt-3 font-serif-d text-4xl italic sm:text-5xl">
                {stats.total} steps of practice.
              </h2>
            </div>
            <p className="mono-label mb-1 flex items-center gap-2 text-(--color-faint)">
              <ListChecks size={14} />
              {stats.done} / {stats.total} STEPS DONE
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 max-w-lg text-sm leading-relaxed text-(--color-mist)"
          >
            Steps unlock in order. Finish a lecture, clear its homework set, and the
            next video opens. No skipping ahead — that is the rule of this place.
          </motion.p>
        </div>

        <AnimatePresence>
          {stats.done === stats.total && stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-10 max-w-6xl px-4 sm:px-8"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-(--color-volt)/40 bg-(--color-volt)/10 px-6 py-4">
                <Sparkles size={18} className="text-(--color-volt)" />
                <p className="font-serif-d text-lg italic text-(--color-paper)">
                  Track complete. Every step in {course.name} is done.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 space-y-16">
          {units.map((unit, i) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              index={i}
              nextLectureId={nextLectureId}
              highlightedId={highlightedId}
              lockedIds={lockedIds}
              onToggle={handleToggle}
              onToggleHw={handleToggleHw}
              onPlay={(l) => {
                const videoId = resolveVideoId(l);
                if (videoId) setPlaying({ ...l, videoId });
              }}
            />
          ))}
        </div>
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <p className="mono-label text-(--color-faint)">
            OLY — {course.code} · BUILT FOR DAILY PRACTICE · {new Date().getFullYear()}
          </p>
          <p className="mono-label text-(--color-faint)">
            STREAK {stats.streak} · {stats.percent}% COMPLETE
          </p>
        </div>
      </footer>

      <VideoModal lecture={playing} onClose={() => setPlaying(null)} />
      <BurstEmitter ref={burstRef} />
    </div>
  );
}
