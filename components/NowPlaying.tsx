'use client';
import { useEffect, useState } from 'react';

type Props = { streamUrl: string; fallbackTitle: string; fallbackArtist: string };
export default function NowPlaying({ streamUrl, fallbackTitle, fallbackArtist }: Props) {
  const [title, setTitle] = useState(fallbackTitle);
  const [artist, setArtist] = useState(fallbackArtist);

  useEffect(() => {
    // Até conectarmos metadados próprios para cada emissora, mostramos o nome real da estação.
    setTitle(fallbackTitle);
    setArtist(fallbackArtist);
  }, [streamUrl, fallbackTitle, fallbackArtist]);

  return <><strong>{title}</strong><span>{artist}</span></>;
}
