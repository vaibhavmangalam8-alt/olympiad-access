"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

export default function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (spanRef.current) spanRef.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, mv]);

  return (
    <span ref={spanRef} className={className}>
      {value}
    </span>
  );
}
