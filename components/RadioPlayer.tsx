'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Pause } from 'lucide-react';

type CurrentSong = {
  title: string;
  artist: string;
  artwork: string;
  videoId: string;
};

type RadioPlayerProps = {
  streamUrl?: string;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  onRequestChange: (playing: boolean) => void;
  stationName: string;
  currentSong: CurrentSong | null;
  songPlaying: boolean;
  onSongPlayingChange: (playing: boolean) => void;
  onToggleSong: () => void;
  visible: boolean;
};

export default function RadioPlayer({ streamUrl, playing, onPlayingChange, onRequestChange, stationName, currentSong, songPlaying, onSongPlayingChange, onToggleSong, visible }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubeFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!streamUrl) return;
    const audio = new Audio();
    setError(false);
    setConnected(false);
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    const onPlay = () => setError(false);
    const onPlaying = () => { setConnected(true); onPlayingChange(true); };
    const onPause = () => { setConnected(false); onPlayingChange(false); onRequestChange(false); };
    const onError = () => { setError(true); setConnected(false); onPlayingChange(false); onRequestChange(false); };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [streamUrl, onPlayingChange, onRequestChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted, streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (playing) {
      setError(false);
      if (audio.src !== streamUrl) audio.src = streamUrl;
      audio.play().catch(() => {
        setError(true);
        setConnected(false);
        onPlayingChange(false);
        onRequestChange(false);
      });
    } else {
      audio.pause();
    }
  }, [playing, streamUrl, onPlayingChange, onRequestChange]);

  const toggle = () => currentSong ? onToggleSong() : onRequestChange(!playing);
  const radioIsPlaying = playing && !currentSong;

  const sendYouTubeCommand = useCallback((command: 'playVideo' | 'pauseVideo') => {
    youtubeFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
  }, []);

  useEffect(() => {
    if (currentSong) sendYouTubeCommand(songPlaying ? 'playVideo' : 'pauseVideo');
  }, [currentSong, sendYouTubeCommand, songPlaying]);

  useEffect(() => {
    const onYouTubeMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== youtubeFrameRef.current?.contentWindow || !event.origin.endsWith('youtube-nocookie.com')) return;
      if (typeof event.data !== 'string') return;

      let message: { event?: string; info?: number | { playerState?: number } };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      const state = message.event === 'onStateChange'
        ? message.info
        : message.event === 'infoDelivery' && typeof message.info === 'object'
          ? message.info.playerState
          : undefined;
      if (typeof state === 'number' && [0, 1, 2].includes(state)) onSongPlayingChange(state === 1);
    };

    window.addEventListener('message', onYouTubeMessage);
    return () => window.removeEventListener('message', onYouTubeMessage);
  }, [onSongPlayingChange]);

  const subscribeToYouTubeState = () => {
    youtubeFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
      '*'
    );
  };

  return (
    <div className={`radioPlayerControl${currentSong ? ' songMode' : ''}${songPlaying ? ' songPlaying' : ''}${visible ? '' : ' playerHidden'}`} aria-hidden={!visible}>
      <button className="radioPlay" onClick={toggle} aria-label={currentSong ? `${songPlaying ? 'Pausar' : 'Tocar'} ${currentSong.title}` : radioIsPlaying ? 'Pausar rádio' : 'Ouvir rádio'}>
        {currentSong && songPlaying || radioIsPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
      </button>
      {currentSong && <>
        <iframe
          key={currentSong.videoId}
          ref={youtubeFrameRef}
          className="playerVideo"
          src={`https://www.youtube-nocookie.com/embed/${currentSong.videoId}?autoplay=1&controls=1&enablejsapi=1`}
          title={`Clipe de ${currentSong.title} — ${currentSong.artist}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={subscribeToYouTubeState}
        />
        <img className="playerArtwork" src={currentSong.artwork} alt={`Capa de ${currentSong.title}`} />
      </>}
      <div className="radioMeta">
        {currentSong ? <>
          <div><span>{songPlaying ? 'TOCANDO AGORA' : 'MÚSICA PAUSADA'}</span></div>
          <small>{currentSong.title} • {currentSong.artist}</small>
        </> : <>
          <div><Radio /> <span>{connected ? 'AO VIVO' : playing ? 'CONECTANDO' : 'RÁDIO ONLINE'}</span></div>
          {error ? <small>Não foi possível conectar. Tente outra emissora.</small> : <small>{stationName} • transmissão oficial</small>}
        </>}
      </div>
      {!currentSong && <div className="volumeControl">
        <button onClick={() => setMuted(!muted)} aria-label={muted ? 'Ativar som' : 'Silenciar'}>{muted || volume === 0 ? <VolumeX /> : <Volume2 />}</button>
        <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }} />
      </div>}
    </div>
  );
}
