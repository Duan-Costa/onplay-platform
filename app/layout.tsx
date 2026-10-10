import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Unbounded, Figtree } from 'next/font/google';
import './globals.css';

const display = Unbounded({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'ONPLAY — Música, rádio, clipes e notícias',
  description: 'A sua experiência de música e rádio online.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#08090c' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
