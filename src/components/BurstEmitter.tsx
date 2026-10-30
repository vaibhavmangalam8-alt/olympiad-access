"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface BurstHandle {
  burst: (x: number, y: number, scale?: number) => void;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
}

const COLORS = ["#d8ff3e", "#ff9e5e", "#8ed0ff", "#f0ece0"];

const BurstEmitter = forwardRef<BurstHandle>(function BurstEmitter(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const loop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.current = sparks.current.filter((s) => s.life > 0);
    for (const s of sparks.current) {
      s.life -= 1;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.16;
      s.vx *= 0.985;
      s.rot += s.vr;
      const a = Math.max(0, s.life / s.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = s.color;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size * 0.7);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (sparks.current.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useImperativeHandle(ref, () => ({
    burst(x, y, scale = 1) {
      const n = Math.floor(26 * scale);
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const sp = (2.4 + Math.random() * 4.2) * scale;
        sparks.current.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 1.6,
          life: 44 + Math.random() * 22,
          max: 66,
          size: 3 + Math.random() * 5,
          color: COLORS[i % COLORS.length],
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
        });
      }
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
    },
  }));

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[80]"
      aria-hidden="true"
    />
  );
});

export default BurstEmitter;
