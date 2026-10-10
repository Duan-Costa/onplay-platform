'use client';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Bell, ChevronLeft, ChevronRight, Headphones, Heart, Home as HomeIcon, Instagram, Menu, Newspaper, Pause, Play, Radio, Search, Sparkles, UserRound, Video, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import Visualizer from '../components/Visualizer';
import RadioPlayer from '../components/RadioPlayer';
import NowPlaying from '../components/NowPlaying';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3.5a12.3 12.3 0 0 0-10.6 18.5L4 28l6.2-1.6A12.5 12.5 0 1 0 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 10.5c-.4-.8-.8-.8-1.2-.8h-.9c-.3 0-.8.1-1.2.6s-1.6 1.6-1.6 3.8 1.6 4.4 1.8 4.7 3.1 5 7.7 6.8c3.8 1.5 4.6 1.2 5.4 1.1s2.5-1 2.9-2 .4-1.9.3-2.1-.5-.3-1.1-.6-2.5-1.2-2.9-1.3-.7-.2-1 .3-1.1 1.3-1.4 1.6-.5.3-1.1 0a11.2 11.2 0 0 1-3.3-2 12.4 12.4 0 0 1-2.3-2.9c-.2-.5 0-.7.2-.9l.7-.8c.2-.3.3-.5.5-.8s0-.6 0-.8-.9-2.1-1.2-2.9Z" fill="currentColor" transform="translate(2 -1) scale(.9)" />
    </svg>
  );
}

type Song = [rank: string, title: string, artist: string, genre: string, artwork: string];
const songs: Song[] = [
  ['01','Blinding Lights','The Weeknd','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6f/bc/e6/6fbce6c4-c38c-72d8-4fd0-66cfff32f679/20UMGIM12176.rgb.jpg/100x100bb.jpg'],
  ['02','APT.','ROSÉ & Bruno Mars','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/1a/7d/2d1a7d91-587e-0ceb-d434-327bd66d9e86/075679628312.jpg/100x100bb.jpg'],
  ['03','Beautiful Things','Benson Boone','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/54/f4/92/54f49210-e260-b519-ebbd-f4f40ee710cd/054391342751.jpg/100x100bb.jpg'],
  ['04','Espresso','Sabrina Carpenter','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/100x100bb.jpg'],
  ['05','Die With A Smile','Lady Gaga & Bruno Mars','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/100x100bb.jpg'],
  ['06','Lose Control','Teddy Swims','Soul','https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/36/19/66/36196640-1561-dc5e-c6bc-1e5f4befa583/093624856771.jpg/100x100bb.jpg'],
  ['07','Birds of a Feather','Billie Eilish','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/100x100bb.jpg'],
  ['08','I Had Some Help','Post Malone','Country','https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/df/b9/84dfb96b-27c8-4d40-4780-b65ff22790e4/24UMGIM50612.rgb.jpg/100x100bb.jpg'],
  ['09','Stargazing','Myles Smith','Pop','https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/36/2d/75/362d75b7-9be2-ef72-5204-6888731cf077/196872051872.jpg/100x100bb.jpg'],
  ['10','End of Beginning','Djo','Alternative','https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9d/58/bb/9d58bb3a-c6b5-4c3d-fbba-50872d2712f4/5056494917336.jpg/100x100bb.jpg'],
];
type Clip = { title: string; artist: string; videoId: string; label: string };
const clips: Clip[] = [
  { title: 'Blinding Lights', artist: 'The Weeknd', videoId: '4NRXx6U8ABQ', label: 'Videoclipe oficial' },
  { title: 'Beautiful Things', artist: 'Benson Boone', videoId: 'Oa_RSwwpPaA', label: 'Videoclipe oficial' },
  { title: 'APT.', artist: 'ROSÉ & Bruno Mars', videoId: 'ekr2nIex040', label: 'Videoclipe oficial' },
  { title: 'Flowers', artist: 'Miley Cyrus', videoId: 'G7KNmW9a75Y', label: 'Videoclipe oficial' },
  { title: 'As It Was', artist: 'Harry Styles', videoId: 'H5v3kku4y6Q', label: 'Videoclipe oficial' },
  { title: 'Anti-Hero', artist: 'Taylor Swift', videoId: 'b1kbLwvqugk', label: 'Videoclipe oficial' },
  { title: 'Levitating', artist: 'Dua Lipa', videoId: 'TUVcZfQe-Kw', label: 'Videoclipe oficial' },
  { title: 'Heat Waves', artist: 'Glass Animals', videoId: 'mRD0-GxqHVo', label: 'Videoclipe oficial' },
  { title: 'good 4 u', artist: 'Olivia Rodrigo', videoId: 'gNi_6U5Pm_o', label: 'Videoclipe oficial' },
  { title: 'drivers license', artist: 'Olivia Rodrigo', videoId: 'ZmDBbnmKpqQ', label: 'Videoclipe oficial' },
];
const stations = [
  { name: 'KEXP 90.3 • Indie & descoberta', shortName: 'KEXP 90.3', url: 'https://kexp.streamguys1.com/kexp160.aac', site: 'https://www.kexp.org/streaming-urls/' },
  { name: 'Radio Paradise • Main Mix', shortName: 'Radio Paradise Main Mix', url: 'https://stream.radioparadise.com/mp3-192', site: 'https://radioparadise.com/' },
  { name: 'Radio Paradise • Rock Mix', shortName: 'Radio Paradise Rock Mix', url: 'https://stream.radioparadise.com/rock-128', site: 'https://radioparadise.com/' },
  { name: 'Radio Paradise • Mellow Mix', shortName: 'Radio Paradise Mellow Mix', url: 'https://stream.radioparadise.com/mellow-128', site: 'https://radioparadise.com/' },
  { name: 'Radio Paradise • World/Etc Mix', shortName: 'Radio Paradise World/Etc Mix', url: 'https://stream.radioparadise.com/world-etc-128', site: 'https://radioparadise.com/' },
];

const grad = (i: number) => {
  const h = (265 + i * 37) % 360;
  return `linear-gradient(135deg,hsl(${h},62%,42%),hsl(${(h + 50) % 360},70%,24%))`;
};

export default function Page() {
  const [playing, setPlaying] = useState(false);
  const [radioConnected, setRadioConnected] = useState(false);
  const [current, setCurrent] = useState(-1); // -1 = rádio ao vivo
  const [songPlaying, setSongPlaying] = useState(false);
  const [stationIndex, setStationIndex] = useState(1);
  const [activeVideo, setActiveVideo] = useState<Clip | null>(null);
  const [clipIndex, setClipIndex] = useState(0);
  const [maxClipIndex, setMaxClipIndex] = useState(0);
  const clipsTrackRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);
  const [devotionalOpen, setDevotionalOpen] = useState(false);
  const [request, setRequest] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [showFixedPlayer, setShowFixedPlayer] = useState(true);
  const whatsappNumber = process.env.NEXT_PUBLIC_ONPLAY_WHATSAPP;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Vim pelo site da ONPLAY.')}`;
  const activeStation = stations[stationIndex];
  const streamUrl = activeStation.url;
  const handlePlayingChange = useCallback((value: boolean) => setRadioConnected(value), []);
  const handleRequestChange = useCallback((value: boolean) => {
    setPlaying(value);
    if (!value) setRadioConnected(false);
  }, []);

  useEffect(() => {
    const track = clipsTrackRef.current;
    if (!track) return;
    const updateMaxIndex = () => {
      const card = track.querySelector<HTMLElement>('.clip');
      if (!card) return;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const step = card.offsetWidth + gap;
      if (step > 0) setMaxClipIndex(Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step)));
    };
    updateMaxIndex();
    const observer = new ResizeObserver(updateMaxIndex);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try { setFavorites(JSON.parse(localStorage.getItem('onplay:favorites') || '[]')); } catch {}
  }, []);

  useEffect(() => {
    const sections = [document.querySelector('.heroBroadcast'), document.querySelector('.quickSection')].filter((section): section is HTMLElement => section instanceof HTMLElement);
    const updatePlayerVisibility = () => {
      const topContentVisible = sections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      setShowFixedPlayer(!topContentVisible);
    };
    updatePlayerVisibility();
    window.addEventListener('scroll', updatePlayerVisibility, { passive: true });
    window.addEventListener('resize', updatePlayerVisibility);
    return () => {
      window.removeEventListener('scroll', updatePlayerVisibility);
      window.removeEventListener('resize', updatePlayerVisibility);
    };
  }, []);

  const toggleFavorite = (title: string) => {
    setFavorites(prev => {
      const next = prev.includes(title) ? prev.filter(x => x !== title) : [...prev, title];
      localStorage.setItem('onplay:favorites', JSON.stringify(next));
      return next;
    });
  };

  const filteredSongs = useMemo(() => songs.map((song, index) => ({ song, index })).filter(({song}) => `${song[1]} ${song[2]}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const visibleSongs = favoritesOpen ? filteredSongs.filter(({song}) => favorites.includes(song[1])) : filteredSongs;
  const playSong = (i: number) => {
    const item = songs[i];
    if (!item) return;
    const clip = clips.find((candidate) => candidate.title === item[1]);
    if (!clip) {
      setCurrent(-1);
      setSongPlaying(false);
      setActiveVideo(null);
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(`${item[1]} ${item[2]} official video`)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    if (current === i && songPlaying) {
      setSongPlaying(false);
      return;
    }
    setCurrent(i);
    setPlaying(false);
    setRadioConnected(false);
    setSongPlaying(true);
    setActiveVideo(null);
  };
  const closeActiveVideo = () => setActiveVideo(null);
  const openClip = (clip: Clip) => {
    setCurrent(-1);
    setSongPlaying(false);
    setActiveVideo(clip);
  };
  const toggleRadio = () => {
    setCurrent(-1);
    setSongPlaying(false);
    const next = !playing;
    setPlaying(next);
    if (!next) setRadioConnected(false);
  };
  const chooseStation = (value: string) => {
    setStationIndex(Number(value));
    setCurrent(-1);
    setSongPlaying(false);
    setPlaying(false);
    setRadioConnected(false);
  };
  const currentTrack = current >= 0 ? songs[current] : undefined;
  const currentClip = currentTrack ? clips.find((clip) => clip.title === currentTrack[1]) : undefined;
  const currentSong = currentTrack && currentClip
    ? { title: currentTrack[1], artist: currentTrack[2], artwork: currentTrack[4], videoId: currentClip.videoId }
    : null;
  const scrollClips = (direction: -1 | 1) => {
    const track = clipsTrackRef.current;
    const card = track?.querySelector<HTMLElement>('.clip');
    if (!track || !card) return;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = card.offsetWidth + gap;
    const target = Math.max(0, Math.min(maxClipIndex, Math.round(track.scrollLeft / step) + direction));
    setClipIndex(target);
    track.scrollTo({ left: target * step, behavior: 'smooth' });
  };
  const updateClipIndex = () => {
    const track = clipsTrackRef.current;
    const card = track?.querySelector<HTMLElement>('.clip');
    if (!track || !card) return;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    setClipIndex(Math.min(maxClipIndex, Math.max(0, Math.round(track.scrollLeft / (card.offsetWidth + gap)))));
  };

  return (
    <main>
      <header className="header">
        <button className="mobileMenu" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        <a className="logo" href="#radio" aria-label="ONPLAY"><Logo /></a>
        <nav className={menu ? 'nav open' : 'nav'}>
          <a className="active" href="#radio" onClick={() => setMenu(false)}><HomeIcon />Início</a>
          <a href="#radio" onClick={() => setMenu(false)}><Radio />Rádio</a>
          <a href="#music" onClick={() => setMenu(false)}><Headphones />Músicas</a>
          <a href="#clips" onClick={() => setMenu(false)}><Video />Clipes</a>
          <a href="#news" onClick={() => setMenu(false)}><Newspaper />Notícias</a>
        </nav>
        <div className="actions">
          <button aria-label="Buscar" onClick={() => document.getElementById('music')?.scrollIntoView({behavior:'smooth'})}><Search /></button>
          <button aria-label="Notificações"><Bell /></button>
          <button className="profile"><UserRound /> <span>Entrar</span></button>
        </div>
      </header>

      <section id="radio" className="hero heroBroadcast">
        <div className="heroCopy">
          <div className="live"><i />AO VIVO • ONPLAY</div>
          <h1>Conecte-se ao<br /><span>melhor da música.</span></h1>
          <p>Uma nova experiência para ouvir, descobrir e viver a música. Entre na transmissão ao vivo e fique conectado com a ONPLAY.</p>
          <div className="heroButtons">
            <button className="primary" onClick={toggleRadio}>{playing && current < 0 ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}{playing && current < 0 ? 'Pausar ao vivo' : 'Ouvir ao vivo'}</button>
          </div>
          <div className="stationPicker"><label htmlFor="station-select"><Radio size={16} /> Escolha uma rádio ao vivo</label><select id="station-select" value={stationIndex} onChange={(e) => chooseStation(e.target.value)}>{stations.map((station, index) => <option key={station.name} value={index}>{station.name}</option>)}</select><a href={activeStation.site} target="_blank" rel="noreferrer">Site oficial da emissora ↗</a></div>
          <div className="heroStatus"><span className="statusDot" />{radioConnected && current < 0 ? `Conectado: ${activeStation.shortName}` : playing ? `Conectando: ${activeStation.shortName}` : `Pronto para ouvir: ${activeStation.shortName}`}</div>
        </div>
        <div className="heroVisual heroRadioStage">
          <div className="broadcastGlow" />
          <div className="broadcastOrb">
            <div className="micIcon"><img src="/images/microfone-dourado.png" alt="Microfone dourado da ONPLAY" /></div>
            <span className="orbRing ringOne" /><span className="orbRing ringTwo" /><span className="orbRing ringThree" />
          </div>
          <Visualizer playing={radioConnected} />
          <div className="nowCard">
            <div className="nowBadge"><i /> NO AR</div>
            <div className="nowText"><small>{radioConnected && current < 0 ? 'Transmissão ao vivo' : playing ? 'Conectando à transmissão' : 'Rádio selecionada'}</small><NowPlaying streamUrl={streamUrl} fallbackTitle={activeStation.shortName} fallbackArtist="Rádio externa • transmissão ao vivo" /></div>
            <button className="roundPlay" onClick={toggleRadio} aria-label={playing && current < 0 ? 'Pausar rádio' : 'Ouvir rádio'}>{playing && current < 0 ? '❚❚' : '▶'}</button>
          </div>
        </div>
      </section>

      <section className="quickSection">
        <div className="quickGrid">
          <button className="quickCard" onClick={toggleRadio}><span className="quickIcon liveIcon"><Radio /></span><span><strong>Ao vivo</strong><small>Ouça a rádio agora</small></span><ChevronRight /></button>
          <button className="quickCard whatsappQuickCard" onClick={() => setRequestOpen(true)}><span className="quickIcon"><WhatsAppIcon /></span><span><strong>Pedir música</strong><small>Envie seu pedido pelo WhatsApp</small></span><ChevronRight /></button>
          <button className="quickCard" onClick={() => setDevotionalOpen(true)}><span className="quickIcon"><Sparkles /></span><span><strong>Devocional</strong><small>Uma mensagem para hoje</small></span><ChevronRight /></button>
          <button className="quickCard" onClick={() => setFavoritesOpen(!favoritesOpen)}><span className="quickIcon"><Heart /></span><span><strong>Favoritos</strong><small>{favorites.length ? `${favorites.length} salvos` : 'Seus sons preferidos'}</small></span><ChevronRight /></button>
        </div>
      </section>

      <section id="music" className="section">
        <div className="sectionHead"><div><h2>{favoritesOpen ? 'Seus favoritos' : 'Músicas em destaque'}</h2><p className="sectionNote">Seleção editorial; não é um ranking real de reproduções.</p><input className="musicSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar música ou artista" /></div><button onClick={() => setFavoritesOpen(false)}>{favoritesOpen ? 'Voltar à seleção' : 'Ver seleção completa'} <ChevronRight /></button></div>
        <div className="songs">
          {visibleSongs.map(({song: [n, title, artist, genre, artwork], index}) => (
            <article className={current === index ? 'song current' : 'song'} key={n} onClick={() => playSong(index)}>
              <span className="rank">{current === index && songPlaying ? <span className="songEqualizer" role="img" aria-label="Tocando agora"><i /><i /><i /><i /></span> : n}</span>
              <div className="thumb" style={{ background: grad(index) }}><img src={artwork} alt={`Capa de ${artist}`} loading="lazy" width="50" height="50" /></div>
              <div className="songText"><strong title={title}>{title}</strong><span title={artist}>{artist}</span></div>
              <span className="genre" title={genre}>{genre}</span>
              <button className="favoriteBtn" aria-label={favorites.includes(title) ? `Remover ${title} dos favoritos` : `Adicionar ${title} aos favoritos`} onClick={(e) => { e.stopPropagation(); toggleFavorite(title); }}><Heart fill={favorites.includes(title) ? 'currentColor' : 'none'} /></button><button className="miniPlay" aria-label={`Tocar ${title}`} onClick={(e) => { e.stopPropagation(); playSong(index); }}><Play fill="currentColor" /></button>
            </article>
          ))}
        </div>
      </section>

      <section id="clips" className="section">
        <div className="sectionHead clipsHead">
          <div><h2>Clipes oficiais em destaque</h2><p className="sectionNote">Reproduzidos pelo player oficial do YouTube.</p></div>
          <div className="carouselControls" aria-label="Controles do carrossel de clipes">
            <span className="carouselCount">{String(clipIndex + 1).padStart(2, '0')} <span>/ {String(clips.length).padStart(2, '0')}</span></span>
            <button type="button" aria-label="Clipe anterior" onClick={() => scrollClips(-1)} disabled={clipIndex === 0}><ChevronLeft /></button>
            <button type="button" aria-label="Próximo clipe" onClick={() => scrollClips(1)} disabled={clipIndex >= maxClipIndex}><ChevronRight /></button>
          </div>
        </div>
        <div className="clips" ref={clipsTrackRef} onScroll={updateClipIndex} aria-label="Carrossel com 10 videoclipes">
          {clips.map((clip, i) => (
            <article className="clip" key={clip.videoId} role="button" tabIndex={0} onClick={() => openClip(clip)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openClip(clip); } }}>
              <div className="clipImage" style={{ background: grad(i * 2 + 1) }}>
                <img src={`https://i.ytimg.com/vi/${clip.videoId}/hqdefault.jpg`} alt={`Capa do clipe ${clip.title}`} loading="lazy" />
                <button aria-label={`Assistir ${clip.title}`}><Play fill="currentColor" /></button>
              </div>
              <strong>{clip.title}</strong>
              <span>{clip.artist} · {clip.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="news" className="section news">
        <div className="sectionHead newsHead">
          <div>
            <p className="newsEyebrow">MUNDO DA MÚSICA</p>
            <h2>Últimas notícias</h2>
            <p className="sectionNote">Novidades, lançamentos e histórias que movimentam a música.</p>
          </div>
          <button type="button">Ver notícias <ChevronRight /></button>
        </div>
        <div className="newsGrid">
          <article>
            <div className="newsImage">
              <img src="/images/news-music.jpg" alt="Público reunido em um show de música ao vivo" loading="lazy" />
              <span className="newsImageTag">LANÇAMENTOS</span>
            </div>
            <div className="newsBody">
              <small>Música <span>·</span> Destaque ONPLAY</small>
              <h3>Os lançamentos que estão dominando as plataformas nesta semana</h3>
              <p>Confira os sons que ganharam destaque entre os ouvintes.</p>
            </div>
          </article>
          <article>
            <div className="newsImage n2">
              <img src="/images/news-entertainment.jpg" alt="Show ao vivo com luzes e público" loading="lazy" />
              <span className="newsImageTag">CENA MUSICAL</span>
            </div>
            <div className="newsBody">
              <small>Entretenimento <span>·</span> Destaque ONPLAY</small>
              <h3>Artistas anunciam novidades e movimentam a cena musical</h3>
              <p>As principais novidades do mundo da música.</p>
            </div>
          </article>
        </div>
      </section>

      {activeVideo && <div className="modalBackdrop videoBackdrop" onClick={closeActiveVideo}><div className="videoModal" onClick={e => e.stopPropagation()}><button className="modalClose" onClick={closeActiveVideo} aria-label="Fechar clipe"><X /></button><div className="videoFrame"><iframe src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`} title={`${activeVideo.title} — ${activeVideo.artist}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><div className="videoDetails"><strong>{activeVideo.title}</strong><span>{activeVideo.artist} · vídeo oficial do YouTube</span></div></div></div>}

      {requestOpen && <div className="modalBackdrop" onClick={() => setRequestOpen(false)}><div className="modal whatsappModal" onClick={e => e.stopPropagation()}><button className="modalClose" onClick={() => setRequestOpen(false)}><X /></button><WhatsAppIcon /><h2>Pedir música</h2><p>Escolha uma música e mande seu pedido para a equipe da ONPLAY.</p><input value={request} onChange={e => setRequest(e.target.value)} placeholder="Nome da música e artista" /><button className="primary modalAction" onClick={() => { window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Pedido ONPLAY: ${request}`)}`, '_blank', 'noopener,noreferrer'); setRequestOpen(false); }}>Enviar pedido</button></div></div>}
      {devotionalOpen && <div className="modalBackdrop" onClick={() => setDevotionalOpen(false)}><div className="modal devotional" onClick={e => e.stopPropagation()}><button className="modalClose" onClick={() => setDevotionalOpen(false)}><X /></button><Sparkles /><small>DEVOCIONAL DO DIA</small><h2>Continue conectado.</h2><p>Separe alguns minutos hoje para ouvir, refletir e fortalecer sua fé.</p><div className="verse">“Tudo posso naquele que me fortalece.”<span>Filipenses 4:13</span></div><button className="secondary modalAction" onClick={() => setDevotionalOpen(false)}>Fechar</button></div></div>}

      <footer>
        <div className="footerContent">
          <a className="logo" href="#radio" aria-label="ONPLAY"><Logo /></a>
          <p>Música, rádio, clipes e notícias em um só lugar.</p>
          <div className="footerSocials" role="group" aria-label="Redes sociais da ONPLAY">
            <span className="footerSocialsLabel">Siga a ONPLAY</span>
            <div className="socialIcons">
              <span className="socialIcon instagramIcon" role="img" aria-label="Instagram"><Instagram /></span>
              <span className="socialIcon facebookIcon" role="img" aria-label="Facebook">f</span>
            </div>
          </div>
          <div>© 2026 ONPLAY</div>
        </div>
      </footer>

      <a className="whatsappFloat" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a ONPLAY pelo WhatsApp" title="Conversar pelo WhatsApp">
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
      <RadioPlayer streamUrl={streamUrl} playing={playing && current < 0} onPlayingChange={handlePlayingChange} onRequestChange={handleRequestChange} stationName={activeStation.shortName} currentSong={currentSong} songPlaying={songPlaying} onSongPlayingChange={setSongPlaying} onToggleSong={() => { if (current >= 0) playSong(current); }} visible={showFixedPlayer} />
    </main>
  );
}
