'use client';
import { useEffect, useRef } from 'react';
import { CoreMark } from './Logo';

const BARS = 84;

/** Visualizador de áudio circular. Simulado: reage ao estado "tocando", não ao som real. */
export default function Visualizer({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, energy = 0.3, raf = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      const target = reduce ? 0.45 : playingRef.current ? 1 : 0.3;
      energy += (target - energy) * 0.06;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, inner = W * 0.245, maxLen = W * 0.235;
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(3, W * 0.0085);
      for (let i = 0; i < BARS; i++) {
        const a = (i / BARS) * Math.PI * 2 - Math.PI / 2;
        let v = 0.5 + 0.5 * Math.sin(t * 2.1 + i * 0.55) * Math.sin(t * 1.3 + i * 0.21 + 1.7);
        const s = Math.sin(t * 0.9 + i * 0.17);
        v = 0.25 * v + 0.55 * Math.abs(Math.sin(t * 3.2 + i * 0.9)) * (0.4 + 0.6 * s * s);
        const len = W * 0.012 + v * maxLen * energy;
        const x1 = cx + Math.cos(a) * inner, y1 = cy + Math.sin(a) * inner;
        const x2 = cx + Math.cos(a) * (inner + len), y2 = cy + Math.sin(a) * (inner + len);
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, '#a855f7');
        g.addColorStop(1, '#ff5d9e');
        ctx.strokeStyle = g;
        ctx.globalAlpha = 0.55 + 0.45 * Math.min(1, len / (maxLen * 0.6));
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    size();
    window.addEventListener('resize', size);
    if (reduce) draw(1200); else raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', size); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={playing ? 'stage playing' : 'stage'}>
      <i className="ripple" />
      <i className="ripple r2" />
      <canvas ref={ref} aria-hidden="true" />
      <div className="core">
        <div className="coreInner">
          <CoreMark />
          <span>{playing ? 'Tocando' : 'Rádio ao vivo'}</span>
        </div>
      </div>
    </div>
  );
}
