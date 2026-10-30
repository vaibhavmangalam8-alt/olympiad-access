"use client";

import { motion } from "framer-motion";
import LectureRow from "@/components/LectureRow";
import type { LectureDTO, UnitDTO } from "@/lib/queries";

interface Props {
  unit: UnitDTO;
  index: number;
  nextLectureId: number | null;
  highlightedId: number | null;
  lockedIds: Set<number>;
  onToggle: (lecture: LectureDTO, ev: React.MouseEvent) => void;
  onToggleHw: (lecture: LectureDTO, ev: React.MouseEvent) => void;
  onPlay: (lecture: LectureDTO) => void;
}

export default function UnitSection({
  unit,
  index,
  nextLectureId,
  highlightedId,
  lockedIds,
  onToggle,
  onToggleHw,
  onPlay,
}: Props) {
  const done = unit.lectures.filter((l) => l.completedAt !== null).length;
  const total = unit.lectures.length;
  const pct = total === 0 ? 0 : (done / total) * 100;
  const complete = done === total;

  return (
    <section aria-label={`Chapter ${index + 1}: ${unit.name}`}>
      {/* sticky chapter header */}
      <header className="sticky top-14 z-20 border-y hairline bg-(--color-ink)/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-3.5 sm:px-8">
          <p className="mono-label text-(--color-volt)">
            CH {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="font-serif-d text-2xl italic sm:text-3xl">
            {unit.name}
          </h2>
          <div className="ms-auto flex items-center gap-3">
            <div className="hidden h-[3px] w-24 overflow-hidden rounded-full bg-(--color-ink-3) sm:block">
              <motion.div
                className={`h-full rounded-full ${
                  complete ? "bg-(--color-volt)" : "bg-(--color-ember)"
                }`}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
            </div>
            <p className="mono-label text-(--color-mist)">
              {done}/{total}
              {complete && (
                <span className="text-(--color-volt)"> · COMPLETE</span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* lectures */}
      <ul className="mx-auto mt-2 max-w-6xl border-t hairline">
        {unit.lectures.map((lec) => (
          <LectureRow
            key={lec.id}
            lecture={lec}
            locked={lockedIds.has(lec.id)}
            isNext={lec.id === nextLectureId}
            highlighted={lec.id === highlightedId}
            onToggle={onToggle}
            onToggleHw={onToggleHw}
            onPlay={onPlay}
          />
        ))}
      </ul>
    </section>
  );
}
