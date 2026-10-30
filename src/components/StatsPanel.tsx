"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Flame, Layers, NotebookPen } from "lucide-react";
import CountUp from "@/components/CountUp";
import ProgressRing from "@/components/ProgressRing";
import type { StatsDTO } from "@/lib/queries";

export default function StatsPanel({ stats }: { stats: StatsDTO }) {
  const max = Math.max(1, ...stats.week.map((d) => d.count));

  return (
    <div className="relative overflow-hidden rounded-3xl border hairline bg-(--color-ink-2)/80 p-6 backdrop-blur-xl sm:p-8">
      {/* ring */}
      <div className="relative mx-auto grid w-fit place-items-center">
        <ProgressRing percent={stats.percent} size={230} stroke={10} />
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-serif-d text-6xl leading-none sm:text-7xl">
              <CountUp value={stats.percent} />
              <span className="text-2xl align-top text-(--color-mist)">%</span>
            </p>
            <p className="mono-label mt-2 text-(--color-mist)">COURSE DONE</p>
          </div>
        </div>
      </div>

      {/* stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-(--color-line)">
        <Tile
          icon={<Flame size={14} className="text-(--color-ember)" />}
          label="DAY STREAK"
          value={stats.streak}
          suffix={stats.streak === 1 ? "DAY" : "DAYS"}
        />
        <Tile
          icon={<Layers size={14} className="text-(--color-volt)" />}
          label="STEPS DONE"
          value={stats.done}
          suffix={`/ ${stats.total}`}
        />
        <Tile
          icon={<CalendarCheck2 size={14} className="text-(--color-sky)" />}
          label="DONE TODAY"
          value={stats.todayCount}
          suffix={stats.todayCount === 1 ? "LECTURE" : "LECTURES"}
        />
        {stats.hwTotal > 0 ? (
          <Tile
            icon={<NotebookPen size={14} className="text-(--color-ember)" />}
            label="HOMEWORK"
            value={stats.hwDone}
            suffix={`/ ${stats.hwTotal} SETS`}
          />
        ) : (
          <Tile
            icon={<NotebookPen size={14} className="text-(--color-mist)" />}
            label="RESOURCES"
            value={stats.notesCount}
            suffix="LINKED"
          />
        )}
      </div>

      {/* week chart */}
      <div className="mt-6">
        <p className="mono-label text-(--color-faint)">LAST 7 DAYS</p>
        <div className="mt-3 flex h-20 items-end gap-2">
          {stats.week.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-12 w-full items-end">
                <motion.div
                  className={`w-full rounded-t-sm ${
                    d.count > 0 ? "bg-(--color-volt)" : "bg-(--color-ink-3)"
                  } ${d.isToday ? "ring-1 ring-(--color-volt)/50" : ""}`}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${d.count === 0 ? 12 : 14 + (d.count / max) * 86}%`,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <p
                className={`mono-label text-[0.58rem] ${
                  d.isToday ? "text-(--color-volt)" : "text-(--color-faint)"
                }`}
              >
                {d.isToday ? "NOW" : d.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="bg-(--color-ink-2) p-4">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="mono-label text-[0.6rem] text-(--color-faint)">{label}</p>
      </div>
      <p className="mt-2 font-serif-d text-3xl leading-none">
        <CountUp value={value} />
        <span className="ml-1 text-xs text-(--color-faint)">{suffix}</span>
      </p>
    </div>
  );
}
