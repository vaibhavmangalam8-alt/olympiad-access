"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  FileText,
  Lock,
  NotebookPen,
  Play,
} from "lucide-react";
import { resolveVideoId } from "@/lib/video";
import type { LectureDTO } from "@/lib/queries";

interface Props {
  lecture: LectureDTO;
  locked: boolean;
  isNext: boolean;
  highlighted: boolean;
  onToggle: (lecture: LectureDTO, ev: React.MouseEvent) => void;
  onToggleHw: (lecture: LectureDTO, ev: React.MouseEvent) => void;
  onPlay: (lecture: LectureDTO) => void;
}

export default function LectureRow({
  lecture,
  locked,
  isNext,
  highlighted,
  onToggle,
  onToggleHw,
  onPlay,
}: Props) {
  const done = lecture.completedAt !== null;
  const isPractice = lecture.kind === "practice";
  const isExternal = lecture.kind === "external";
  const resolvedVideoId = resolveVideoId(lecture);
  const hasHw = !!(lecture.hwText || lecture.hwUrl);
  const hwDone = lecture.hwCompletedAt !== null;
  const hwOpen = done && !hwDone;
  const { chips: hwChips, count: problemCount } = renderHw(lecture.hwText, lecture.hwUrl);

  return (
    <motion.li
      id={`lecture-${lecture.id}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sweep group border-b hairline transition-shadow ${
        highlighted ? "shadow-[inset_0_0_0_1.5px_var(--color-volt)]" : ""
      } ${locked ? "opacity-45" : ""}`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-6 sm:px-8 sm:py-4">
        {/* toggle */}
        <input
          type="checkbox"
          className="chk"
          checked={done}
          disabled={locked}
          onChange={(e) => e.preventDefault()}
          onClick={(e) => onToggle(lecture, e)}
          aria-label={`Mark ${lecture.topic} as ${done ? "not done" : "done"}`}
        />

        {/* day */}
        <div className="hidden w-16 flex-none sm:block">
          <p className="mono-label text-(--color-faint)">
            {isPractice ? "SET" : "STEP"}
          </p>
          <p
            className={`font-serif-d text-xl leading-none ${
              done ? "text-(--color-volt)" : "text-(--color-paper)"
            }`}
          >
            {String(lecture.dayNumber).padStart(2, "0")}
          </p>
        </div>

        {/* topic */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3
              className={`font-serif-d text-lg leading-snug transition-colors duration-300 sm:text-[1.3rem] ${
                done
                  ? "text-(--color-faint) line-through decoration-(--color-volt)/40"
                  : "text-(--color-paper) group-hover:italic"
              }`}
            >
              {lecture.topic}
            </h3>
            {isPractice && (
              <span className="rounded-sm border border-(--color-ember)/50 bg-(--color-ember)/10 px-1.5 py-px mono-label text-[0.6rem] text-(--color-ember)">
                PROBLEM SET
              </span>
            )}
            {isNext && !done && (
              <span className="relative flex items-center gap-1.5 rounded-full border border-(--color-volt)/40 px-2 py-0.5 mono-label text-(--color-volt)">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-(--color-volt)" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--color-volt)" />
                </span>
                NEXT UP
              </span>
            )}
            {done && (
              <span className="inline-flex -rotate-3 items-center gap-1 rounded-sm border border-(--color-volt)/50 px-1.5 py-px mono-label text-[0.6rem] text-(--color-volt)">
                <Check size={10} strokeWidth={3} /> DONE
              </span>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 mono-label text-[0.6rem] text-(--color-faint)">
                <Lock size={10} /> LOCKED
              </span>
            )}
          </div>
          {lecture.sub && (
            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-(--color-mist)">
              {lecture.sub}
            </p>
          )}
          <p className="mono-label mt-1 sm:hidden">
            STEP {String(lecture.dayNumber).padStart(2, "0")}
            <span className="text-(--color-faint)">
              {" "}· {done ? "COMPLETED" : locked ? "LOCKED" : "IN QUEUE"}
            </span>
          </p>
        </div>

        {/* thumbnail / emblem */}
        {isPractice ? (
          <div className="relative hidden h-14 w-24 flex-none overflow-hidden rounded-lg border border-(--color-ember)/30 lg:grid place-items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-(--color-ember)/25 via-(--color-ember)/5 to-transparent" />
            <FileText size={18} className="relative text-(--color-ember)" />
          </div>
        ) : resolvedVideoId && !locked ? (
          <div
            className="relative hidden h-14 w-24 flex-none cursor-pointer overflow-hidden rounded-lg border hairline opacity-70 transition duration-300 hover:opacity-100 lg:block"
            onClick={() => onPlay({ ...lecture, videoId: resolvedVideoId })}
          >
            <img
              src={`https://i.ytimg.com/vi/${resolvedVideoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 grid place-items-center bg-black/35">
              <Play size={14} className="fill-white text-white" />
            </div>
          </div>
        ) : (
          <div className="relative hidden h-14 w-24 flex-none overflow-hidden rounded-lg border hairline lg:grid place-items-center">
            <Lock size={14} className="text-(--color-faint)" />
          </div>
        )}

        {/* actions */}
        <div className="flex flex-none items-center gap-2">
          {isPractice ? (
            (lecture.hwUrl || lecture.notesUrl) && (
              <a
                href={lecture.hwUrl || lecture.notesUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-2 rounded-full bg-(--color-ember) px-4 text-[0.72rem] font-semibold tracking-[0.14em] text-(--color-ink) transition hover:brightness-110"
              >
                <ArrowUpRight size={13} strokeWidth={3} /> OPEN PDF
              </a>
            )
          ) : isExternal && lecture.videoUrl ? (
            <>
              {lecture.notesUrl && (
                <a
                  href={lecture.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border hairline text-(--color-mist) transition hover:border-(--color-volt)/60 hover:text-(--color-volt)"
                  title="Open lecture notes"
                  aria-label={`Notes for ${lecture.topic}`}
                >
                  <NotebookPen size={14} />
                </a>
              )}
              {locked ? (
                <span
                  className="flex h-9 items-center gap-2 rounded-full border hairline px-3 mono-label text-(--color-faint) sm:px-4"
                  title="Finish the previous step to unlock"
                >
                  <Lock size={12} /> SEALED
                </span>
              ) : (
                <a
                  href={lecture.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 flex-none items-center gap-2 rounded-full bg-(--color-paper) px-4 text-[0.72rem] font-semibold tracking-[0.14em] text-(--color-ink) transition hover:bg-(--color-volt)"
                >
                  <ExternalLink size={12} strokeWidth={2.5} /> OPEN
                </a>
              )}
            </>
          ) : (
            <>
              {lecture.notesUrl ? (
                <a
                  href={lecture.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border hairline text-(--color-mist) transition hover:border-(--color-volt)/60 hover:text-(--color-volt)"
                  title="Open lecture notes"
                  aria-label={`Notes for ${lecture.topic}`}
                >
                  <NotebookPen size={14} />
                </a>
              ) : (
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border border-transparent text-(--color-faint)/40"
                  title="No notes attached"
                >
                  <NotebookPen size={14} />
                </span>
              )}
              {locked ? (
                <span
                  className="flex h-9 items-center gap-2 rounded-full border hairline px-3 mono-label text-(--color-faint) sm:px-4"
                  title="Finish the previous step to unlock"
                >
                  <Lock size={12} /> SEALED
                </span>
              ) : (
                <>
                  <button
                    onClick={() => onPlay(lecture)}
                    className="hidden h-9 items-center gap-2 rounded-full bg-(--color-paper) px-4 text-[0.72rem] font-semibold tracking-[0.14em] text-(--color-ink) transition hover:bg-(--color-volt) sm:flex"
                  >
                    <Play size={12} strokeWidth={3} /> WATCH
                  </button>
                  <button
                    onClick={() => onPlay(lecture)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-(--color-paper) text-(--color-ink) sm:hidden"
                    aria-label={`Watch ${lecture.topic}`}
                  >
                    <Play size={13} strokeWidth={3} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* homework strip */}
      {hasHw && (
        <div
          className={`relative border-t hairline px-4 py-3 sm:px-8 sm:ps-[7.75rem] transition-colors ${
            hwOpen ? "bg-(--color-volt)/4" : "bg-transparent"
          } ${!done ? "opacity-50" : ""}`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className={`inline-flex items-center gap-1.5 mono-label ${
                hwDone
                  ? "text-(--color-volt)"
                  : hwOpen
                    ? "text-(--color-ember)"
                    : "text-(--color-faint)"
              }`}
            >
              <NotebookPen size={12} />
              HW{problemCount > 1 ? ` · ${problemCount} PROBLEMS` : problemCount === 1 ? " · 1 PROBLEM" : ""}
            </span>
            {lecture.hwUrl && (
              <a
                href={lecture.hwUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label flex-none text-(--color-sky) underline-offset-4 transition hover:text-(--color-volt) hover:underline"
              >
                OPEN SET →
              </a>
            )}
            <label
              className={`ms-auto flex flex-none cursor-pointer items-center gap-2 ${!done ? "pointer-events-none" : ""}`}
              title={done ? "Mark homework done" : "Finish the lecture first"}
            >
              <input
                type="checkbox"
                className="chk scale-[0.85]"
                checked={hwDone}
                disabled={!done}
                onChange={(e) => e.preventDefault()}
                onClick={(e) => onToggleHw(lecture, e)}
                aria-label={`Mark homework for ${lecture.topic} done`}
              />
              <span
                className={`mono-label ${hwDone ? "text-(--color-volt)" : "text-(--color-faint)"}`}
              >
                {hwDone ? "HW DONE" : done ? "MARK HW" : "AFTER LECTURE"}
              </span>
            </label>
          </div>

          {/* source-grouped question chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {hwChips.map((chip, i) =>
              chip.nums ? (
                <span
                  key={i}
                  className={`inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 rounded-md border hairline px-2 py-1 ${
                    hwDone ? "opacity-40" : "bg-(--color-ink-2)/80"
                  }`}
                >
                  <span className="mono-label text-[0.55rem] tracking-[0.14em] text-(--color-ember)">
                    {chip.label.toUpperCase()}
                  </span>
                  <span className="font-mono text-[0.7rem] leading-snug text-(--color-paper)">
                    {chip.nums}
                  </span>
                </span>
              ) : (
                <span
                  key={i}
                  className={`text-xs leading-relaxed ${
                    hwDone ? "text-(--color-faint) line-through" : "text-(--color-mist)"
                  }`}
                >
                  {chip.label}
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </motion.li>
  );
}

/* ---------- homework text helpers ---------- */

interface HwChip {
  label: string;
  nums: string | null;
}

interface HwRender {
  chips: HwChip[];
  count: number;
}

function renderHw(hwText: string | null, hwUrl: string | null): HwRender {
  if (!hwText) {
    return { chips: [{ label: "Homework attached", nums: null }], count: hwUrl ? 1 : 0 };
  }
  const chips: HwChip[] = hwText.split(" · ").map((chunk) => {
    const idx = chunk.indexOf(":");
    if (idx === -1) return { label: chunk, nums: null };
    return { label: chunk.slice(0, idx).trim(), nums: chunk.slice(idx + 1).trim() };
  });

  let count = 0;
  for (const chip of chips) {
    if (!chip.nums) continue;
    if (!/^(irodov|hcv|pf)\b/i.test(chip.label)) continue; // only structured sets
    const re = /(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(chip.nums)) !== null) {
      if (m[2]) {
        const a = m[1], b = m[2];
        if (!a.includes(".") && !b.includes(".")) {
          count += Math.max(1, parseInt(b, 10) - parseInt(a, 10) + 1);
          continue;
        }
        const [ap, at] = a.split(".");
        const [bp, bt] = b.split(".");
        count += ap === bp ? Math.max(1, parseInt(bt, 10) - parseInt(at, 10) + 1) : 2;
      } else {
        count += 1;
      }
    }
  }
  return { chips, count };
}
