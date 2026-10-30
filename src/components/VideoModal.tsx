"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { resolveVideoId } from "@/lib/video";
import type { LectureDTO } from "@/lib/queries";

export default function VideoModal({
  lecture,
  onClose,
}: {
  lecture: LectureDTO | null;
  onClose: () => void;
}) {
  const videoId = lecture ? resolveVideoId(lecture) : null;
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    setEmbedFailed(false);
  }, [videoId]);

  useEffect(() => {
    if (!lecture || !videoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lecture, onClose, videoId]);

  return (
    <AnimatePresence>
      {lecture && videoId && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border hairline bg-(--color-ink-2) shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            initial={{ y: 60, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Playing ${lecture.topic}`}
          >
            <div className="flex items-center justify-between gap-4 border-b hairline px-5 py-3.5">
              <div className="min-w-0">
                <p className="mono-label text-(--color-volt)">
                  DAY {String(lecture.dayNumber).padStart(2, "0")} — LECTURE
                </p>
                <p className="truncate font-serif-d text-lg italic">
                  {lecture.topic}
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-9 w-9 flex-none place-items-center rounded-full border hairline text-(--color-mist) transition hover:border-(--color-volt) hover:text-(--color-volt)"
                aria-label="Close player"
              >
                <X size={16} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {embedFailed ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#07090d] px-6 text-center text-(--color-paper)">
                  <p className="mono-label text-(--color-volt)">VIDEO UNAVAILABLE IN EMBED</p>
                  <p className="max-w-md text-sm text-(--color-mist)">
                    This video may be private, restricted, or not embeddable on YouTube.
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-(--color-volt) px-4 py-2 text-[0.7rem] font-semibold tracking-[0.14em] text-(--color-ink) transition hover:brightness-110"
                  >
                    OPEN ON YOUTUBE
                  </a>
                </div>
              ) : (
                <iframe
                  key={videoId}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={lecture.topic}
                  className="h-full w-full"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setEmbedFailed(true)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
