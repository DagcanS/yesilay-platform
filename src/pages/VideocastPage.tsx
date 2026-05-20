import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ─── YouTube ID Çıkarma ──────────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ─── Video Oynatıcı Bileşeni ─────────────────────────────────────────────────
const VideoPlayer: React.FC<{ video: any }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const ytId = getYouTubeId(video.video_url);

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.04)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
    >
      {/* Video Alanı */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#0f172a' }}>
        {ytId ? (
          !playing ? (
            // YouTube Thumbnail Önizleme
            <div
              onClick={() => setPlaying(true)}
              style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                alt={video.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
              <div style={{
                position: 'relative', width: '68px', height: '68px', borderRadius: '50%',
                background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(255,0,0,0.5)', transition: 'transform 0.2s',
              }}>
                <i className="fa-solid fa-play" style={{ fontSize: '1.4rem', color: 'white', marginLeft: '4px' }} />
              </div>
            </div>
          ) : (
            // YouTube Embed
            <iframe
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          )
        ) : (
          // Normal MP4 Video
          <video
            controls
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#0f172a' }}
          >
            <source src={video.video_url} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Bilgi Alanı */}
      <div style={{ padding: '20px' }}>
        <span style={{
          background: video.categoryColor || '#003DA5',
          color: 'white', padding: '3px 12px', borderRadius: '99px',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
        }}>
          {video.category}
        </span>
        <h3 style={{ fontSize: '1.15rem', margin: '10px 0 6px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {video.title}
        </h3>
        {video.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{video.description}</p>
        )}
        {ytId && (
          <a
            href={video.video_url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#FF0000', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
          >
            <i className="fa-brands fa-youtube" /> YouTube'da İzle
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ background: '#f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
    <div style={{ paddingTop: '56.25%', background: '#e2e8f0', position: 'relative' }} />
    <div style={{ padding: '20px' }}>
      <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '99px', width: '80px', marginBottom: '12px' }} />
      <div style={{ height: '22px', background: '#e2e8f0', borderRadius: '6px', width: '80%', marginBottom: '8px' }} />
      <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '6px', width: '60%' }} />
    </div>
  </div>
);

// ─── Ana Sayfa ───────────────────────────────────────────────────────────────
const VideocastPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('videocasts').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-video"></i> Videocast Serileri</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Görsel dünyada bağımlılığın yüzü. Sokak röportajları, paneller ve çarpıcı kısa belgeseller.
        </p>
      </section>

      <section style={{ padding: '60px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} />)
          ) : videos.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
              <i className="fa-solid fa-video" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }} />
              <p style={{ fontSize: '1.1rem' }}>Henüz videocast eklenmemiş.</p>
            </div>
          ) : videos.map(v => (
            <VideoPlayer key={v.id} video={v} />
          ))}
        </div>
      </section>
    </>
  );
};

export default VideocastPage;
