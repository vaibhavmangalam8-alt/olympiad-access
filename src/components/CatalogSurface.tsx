"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Atom, GraduationCap } from "lucide-react";
import Marquee from "@/components/Marquee";
import OrbitCanvas from "@/components/OrbitCanvas";
import StatsPanel from "@/components/StatsPanel";
import type { CatalogDTO, CatalogCourseDTO } from "@/lib/queries";

const EASE = [0.22, 1, 0.36, 1] as const;

const TAG_ORDER = ["ALL", "PHYSICS", "CHEMISTRY", "MATH", "SCIENCE", "JEE", "FOUNDATION"];

const TAG_COLORS: Record<string, string> = {
  PHYSICS: "text-(--color-volt) border-(--color-volt)/40",
  CHEMISTRY: "text-(--color-sky) border-(--color-sky)/40",
  MATH: "text-(--color-ember) border-(--color-ember)/40",
  SCIENCE: "text-(--color-paper) border-(--color-line)",
  JEE: "text-(--color-sky) border-(--color-sky)/40",
  FOUNDATION: "text-(--color-mist) border-(--color-line)",
};

export default function CatalogSurface({ initial }: { initial: CatalogDTO }) {
  const [tag, setTag] = useState("ALL");
  const stats = initial.stats;

  const tags = useMemo(
    () => TAG_ORDER.filter((t) => t === "ALL" || initial.courses.some((c) => c.tag === t)),
    [initial.courses],
  );
  const courses = useMemo(
    () => (tag === "ALL" ? initial.courses : initial.courses.filter((c) => c.tag === tag)),
    [initial.courses, tag],
  );
  const totalLectures = stats.total;

  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <div className="relative min-h-screen">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-(--color-volt)"
        style={{ scaleX: barScale }}
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b hairline bg-(--color-ink)/78 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="absolute inset-0 rounded-full border border-(--color-volt)/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-(--color-volt)" />
            </span>
            <span className="mono-label text-(--color-paper)">OLY</span>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <a href="#tracks" className="mono-label text-(--color-mist) transition hover:text-(--color-volt)">
              TRACKS
            </a>
          </div>
          <div className="ms-auto">
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
        <div className="orb h-[360px] w-[360px] bg-(--color-sky)/8 top-40 right-[-120px]" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mono-label flex items-center gap-2 text-(--color-mist)"
            >
              <Atom size={14} className="text-(--color-volt)" />
              OLY · FULL STUDY ARCHIVE
            </motion.p>

            <h1 className="mt-6 font-serif-d text-[clamp(3rem,8.5vw,6.2rem)] leading-[0.98] tracking-tight">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
              >
                Every course,
              </motion.span>
              <motion.span
                className="block italic text-(--color-volt)"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
              >
                in sequence.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-(--color-mist)"
            >
              {initial.courses.length} tracks and {totalLectures} steps from the shared
              archive — physics olympiad lectures bound to NSEP homework, IOQM seasons,
              PRMO, RMO and the foundation class tracks. Steps unlock in order; homework
              comes before the next video.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#tracks"
                className="flex h-12 items-center gap-3 rounded-full bg-(--color-volt) px-6 text-[0.78rem] font-semibold tracking-[0.16em] text-(--color-ink) transition hover:brightness-110"
              >
                ENTER THE TRACKS
              </a>
              <Link
                href="/course/PHY"
                className="group flex h-12 items-center gap-3 rounded-full border border-(--color-volt)/40 px-6 text-[0.78rem] font-semibold tracking-[0.16em] text-(--color-volt) transition hover:bg-(--color-volt)/10"
              >
                PHYSICS OLYMPIAD
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mono-label mt-10 text-(--color-faint)"
            >
              SOURCE — SHARED STUDY SHEET + NSEP MECHANICS MASTER SET (501 PROBLEMS)
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 36, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-10 opacity-60">
              <OrbitCanvas />
            </div>
            <StatsPanel stats={stats} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Marquee />
        </motion.div>
      </section>

      {/* ============ COURSES ============ */}
      <main id="tracks" className="relative scroll-mt-16 pb-28">
        <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="mono-label text-(--color-volt)">THE ARCHIVE</p>
              <h2 className="mt-3 font-serif-d text-4xl italic sm:text-5xl">
                Choose your track.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`mono-label rounded-full border px-3.5 py-1.5 transition ${
                    tag === t
                      ? "border-(--color-volt) bg-(--color-volt) text-(--color-ink)"
                      : "hairline text-(--color-mist) hover:border-(--color-volt)/50 hover:text-(--color-paper)"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border hairline bg-(--color-line) sm:grid-cols-2">
            {courses.map((c, i) => (
              <CourseCard key={c.code} course={c} index={i} featured={c.code === "PHY"} />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <p className="mono-label flex items-center gap-2 text-(--color-faint)">
            <GraduationCap size={13} />
            OLY ARCHIVE — BUILT FOR DAILY PRACTICE · {new Date().getFullYear()}
          </p>
          <p className="mono-label text-(--color-faint)">
            STREAK {stats.streak} · {stats.percent}% OF EVERYTHING DONE
          </p>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({
  course,
  index,
  featured,
}: {
  course: CatalogCourseDTO;
  index: number;
  featured: boolean;
}) {
  const pct = course.total === 0 ? 0 : Math.round((course.done / course.total) * 100);
  const tagCls = TAG_COLORS[course.tag] ?? "text-(--color-mist) border-(--color-line)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link
        href={`/course/${course.code}`}
        className={`sweep group flex h-full flex-col bg-(--color-ink-2) p-6 transition-colors sm:p-7 ${
          featured ? "shadow-[inset_0_0_0_1px_rgba(216,255,62,0.25)]" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={`mono-label rounded-sm border px-1.5 py-px text-[0.6rem] ${tagCls}`}>
            {course.tag}
          </span>
          <span className="mono-label text-(--color-faint)">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-4 font-serif-d text-[1.7rem] italic leading-tight text-(--color-paper) transition-transform duration-300 group-hover:-translate-y-0.5">
          {course.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-(--color-mist)">
          {course.blurb}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 pt-2">
          <div>
            <p className="mono-label text-[0.6rem] text-(--color-faint)">
              {course.total} STEPS{course.externalCount > 0 ? ` · ${course.externalCount} EXTERNAL/PDF` : ""}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-[3px] w-28 overflow-hidden rounded-full bg-(--color-ink-3)">
                <motion.div
                  className={pct === 100 ? "bg-(--color-volt) h-full" : "bg-(--color-ember) h-full"}
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
              </div>
              <p className="mono-label text-(--color-mist)">
                {course.done}/{course.total}
              </p>
            </div>
          </div>
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full border hairline text-(--color-mist) transition group-hover:border-(--color-volt)/60 group-hover:text-(--color-volt)">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
