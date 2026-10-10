'use client';
import { useEffect, useId, useState, type CSSProperties } from 'react';

const LENS = [64, 50, 36, 22, 8];
const DURS = ['2.6s', '3.1s', '2.2s', '2.9s', '2.4s'];
const DELAYS = ['0s', '-.4s', '-.8s', '-1.2s', '-1.6s'];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

const bars = (animated: boolean) =>
  LENS.map((l, i) => (
    <path
      key={i}
      className={animated ? 'b' : undefined}
      style={animated ? ({ '--d': DURS[i], '--dl': DELAYS[i] } as CSSProperties) : undefined}
      d={`M${i * 14} ${22 - l / 2} V${22 + l / 2}`}
    />
  ));

/** Logo completo: barras (marca) + "onplay" desenhado com traço uniforme, com brilho passando. */
export function Logo() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reduced = useReducedMotion();
  const grad = `lg${uid}`;
  const word = `lw${uid}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -26 372 96" role="img" aria-label="onplay">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#ff5d9e" />
        </linearGradient>
        <linearGradient id={word} x1="90" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".40" stopColor="#fff" />
          <stop offset=".47" stopColor="#d9b3ff" />
          <stop offset=".53" stopColor="#ff9ccc" />
          <stop offset=".60" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" />
          {!reduced && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-270 0;270 0;270 0"
              keyTimes="0;0.35;1"
              calcMode="spline"
              keySplines="0.4 0 0.2 1;0 0 1 1"
              dur="5s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <g className="headerLogoMark" stroke={`url(#${grad})`}>{bars(false)}</g>
        <g stroke={`url(#${word})`}>
          <circle cx="112" cy="22" r="16" />
          <path d="M148 6 V38 M148 22 A16 16 0 0 1 180 22 V38" />
          <path d="M200 6 V62" />
          <circle cx="216" cy="22" r="16" />
          <path d="M252 -18 V38" />
          <circle cx="288" cy="22" r="16" />
          <path d="M304 6 V38" />
          <path d="M320 6 L338.3 38 M352 6 L328 62" />
        </g>
      </g>
    </svg>
  );
}

/** Marca (só as barras) usada no centro do visualizador, com animação de equalizador via CSS. */
export function CoreMark() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const grad = `lc${uid}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -14 74 72" role="img" aria-label="onplay" className="coreMark">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#ff5d9e" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="9" strokeLinecap="round" stroke={`url(#${grad})`}>
        {bars(true)}
      </g>
    </svg>
  );
}
