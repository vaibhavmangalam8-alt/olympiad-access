"use client";

import { useEffect, useRef } from "react";

interface Particle {
  orbit: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  wobble: number;
}

const COLORS = ["#d8ff3e", "#f0ece0", "#ff9e5e", "#8ed0ff"];

export default function OrbitCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const orbits = [0.62, 0.82, 1.0];
    const particles: Particle[] = Array.from({ length: 48 }, (_, i) => ({
      orbit: i % orbits.length,
      angle: Math.random() * Math.PI * 2,
      speed: (0.0016 + Math.random() * 0.0035) * (i % 2 === 0 ? 1 : -1),
      size: 0.6 + Math.random() * 1.7,
      color: COLORS[i % COLORS.length],
      wobble: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.44;

      // orbit rings
      orbits.forEach((o, idx) => {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          R * o,
          R * o * (0.52 + idx * 0.12),
          t * 0.18 + idx * 0.8,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = "rgba(240,236,224,0.09)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // particles
      for (const p of particles) {
        p.angle += p.speed;
        const o = orbits[p.orbit];
        const rot = t * 0.18 + p.orbit * 0.8;
        const ex = Math.cos(p.angle) * R * o;
        const ey = Math.sin(p.angle) * R * o * (0.52 + p.orbit * 0.12);
        const x = cx + ex * Math.cos(rot) - ey * Math.sin(rot);
        const y = cy + ex * Math.sin(rot) + ey * Math.cos(rot);
        const tw =
          0.35 + 0.65 * Math.abs(Math.sin(t * 2.4 + p.wobble));
        ctx.globalAlpha = tw;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // nucleus glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.42);
      g.addColorStop(0, "rgba(216,255,62,0.16)");
      g.addColorStop(1, "rgba(216,255,62,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
