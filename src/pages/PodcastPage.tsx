import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ─── Özel Audio Player Bileşeni ─────────────────────────────────────────────
interface AudioPlayerProps {
  ep: any;
  isActive: boolean;
  onActivate: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ ep, isActive, onActivate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isActive && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    onActivate();
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: isActive ? 'var(--isbank-blue)' : 'var(--bg-card)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: isActive ? '0 8px 32px rgba(0,61,165,0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.04)',
    }}>
      {/* Kapak */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '12px', flexShrink: 0,
        overflow: 'hidden', background: 'linear-gradient(135deg, #003DA5, #2563eb)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ep.image_url
          ? <img src={ep.image_url} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <i className="fa-solid fa-headphones" style={{ fontSize: '2rem', color: 'white', opacity: 0.8 }} />
        }
      </div>

      {/* İçerik */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: isActive ? '#93c5fd' : 'var(--yesilay-green)', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          BÖLÜM {ep.id} • {ep.duration}
        </span>
        <h3 style={{
          fontSize: '1.1rem', margin: '4px 0 10px',
          color: isActive ? 'white' : 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{ep.title}</h3>

        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          style={{ height: '5px', background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0', borderRadius: '99px', cursor: 'pointer', marginBottom: '6px', position: 'relative' }}
        >
          <div style={{ height: '100%', width: `${progress}%`, background: isActive ? 'white' : 'var(--isbank-blue)', borderRadius: '99px', transition: 'width 0.1s linear' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: isActive ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Play Butonu */}
      <button
        onClick={togglePlay}
        style={{
          width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
          background: isActive ? 'white' : 'var(--accent-gradient)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', transition: 'transform 0.2s',
          color: isActive ? 'var(--isbank-blue)' : 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'}`} />
      </button>

      <audio
        ref={audioRef}
        src={ep.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ background: '#f1f5f9', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#e2e8f0' }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', width: '120px', marginBottom: '10px' }} />
      <div style={{ height: '18px', background: '#e2e8f0', borderRadius: '6px', width: '70%', marginBottom: '12px' }} />
      <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '99px' }} />
    </div>
    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e2e8f0' }} />
  </div>
);

// ─── Ana Sayfa ───────────────────────────────────────────────────────────────
const PodcastPage: React.FC = () => {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
      if (data) setEpisodes(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-headphones"></i> Podcast Serileri</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Uzmanlarla derinlemesine sohbetler, gerçek hikayeler ve dijital dünyadaki riskleri tanıma rehberleri.
        </p>
      </section>

      <section style={{ padding: '60px 5%' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} />)
          ) : episodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
              <i className="fa-solid fa-headphones" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }} />
              <p style={{ fontSize: '1.1rem' }}>Henüz podcast eklenmemiş.</p>
            </div>
          ) : episodes.map(ep => (
            <AudioPlayer
              key={ep.id}
              ep={ep}
              isActive={activeId === ep.id}
              onActivate={() => setActiveId(ep.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default PodcastPage;
