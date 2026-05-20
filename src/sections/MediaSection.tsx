import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MediaSection: React.FC = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const [podRes, vidRes] = await Promise.all([
        supabase.from('podcasts').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('videocasts').select('*').order('created_at', { ascending: false }).limit(2),
      ]);
      if (podRes.data) setPodcasts(podRes.data);
      if (vidRes.data) setVideos(vidRes.data);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  const toggleAudio = (id: string) => {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (!audio) return;
    if (activeAudio === id) {
      audio.pause();
      setActiveAudio(null);
    } else {
      // Diğer sesleri durdur
      if (activeAudio) {
        const prev = document.getElementById(activeAudio) as HTMLAudioElement;
        prev?.pause();
      }
      audio.play();
      setActiveAudio(id);
    }
  };

  // ─── Skeleton ──────────────────────────────────────────────────────────────
  const PodSkeleton = () => (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '6px', width: '70%', marginBottom: '8px' }} />
        <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', width: '45%' }} />
      </div>
    </div>
  );

  const VidSkeleton = () => (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ paddingTop: '56.25%', background: '#e2e8f0' }} />
      <div style={{ padding: '16px' }}>
        <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '6px', width: '80%', marginBottom: '8px' }} />
        <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', width: '50%' }} />
      </div>
    </div>
  );

  return (
    <section id="podcasts" className="media-section">
      <div className="media-container">

        {/* ── Podcast Bloku ─────────────────────────────────────────────────── */}
        <div className="media-block">
          <h3><i className="fa-solid fa-podcast" /> Podcast Serileri</h3>
          <div className="podcast-list">
            {loading ? (
              [1, 2, 3].map(i => <PodSkeleton key={i} />)
            ) : podcasts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', background: 'var(--bg-card)', borderRadius: '12px' }}>
                <i className="fa-solid fa-headphones" style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'block' }} />
                <p style={{ fontSize: '0.9rem' }}>Henüz podcast eklenmemiş</p>
              </div>
            ) : podcasts.map(ep => {
              const audioId = `media-audio-${ep.id}`;
              const isPlaying = activeAudio === audioId;
              return (
                <div key={ep.id} className="media-item" style={{ transition: 'all 0.2s', border: isPlaying ? '2px solid var(--yesilay-green)' : '2px solid transparent' }}>
                  <button
                    className="play-btn"
                    onClick={() => toggleAudio(audioId)}
                    style={{ background: isPlaying ? 'var(--yesilay-green)' : 'var(--isbank-blue)', border: 'none', cursor: 'pointer', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                  >
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                  </button>
                  <div className="media-info">
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>{ep.title}</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{ep.duration}</p>
                  </div>
                  <audio id={audioId} src={ep.audio_url} preload="metadata" onEnded={() => setActiveAudio(null)} />
                </div>
              );
            })}
            <Link to="/podcast" className="media-link link-blue">
              Tüm Podcastleri Dinle <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>

        {/* ── Videocast Bloku ────────────────────────────────────────────────── */}
        <div id="videocasts" className="media-block">
          <h3><i className="fa-solid fa-video" /> Videocast Serileri</h3>
          <div className="videocast-list">
            {loading ? (
              [1, 2].map(i => <VidSkeleton key={i} />)
            ) : videos.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', background: 'var(--bg-card)', borderRadius: '12px' }}>
                <i className="fa-solid fa-video" style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'block' }} />
                <p style={{ fontSize: '0.9rem' }}>Henüz videocast eklenmemiş</p>
              </div>
            ) : videos.map(video => {
              const ytMatch = video.video_url?.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
              const ytId = ytMatch?.[1];
              return (
                <div key={video.id} className="media-item videocast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 0, overflow: 'hidden' }}>
                  {ytId ? (
                    <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}>
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={video.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <a href={video.video_url} target="_blank" rel="noreferrer" style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                          <i className="fa-brands fa-youtube" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <video controls style={{ width: '100%', aspectRatio: '16/9', background: '#0f172a' }}>
                      <source src={video.video_url} type="video/mp4" />
                    </video>
                  )}
                  <div className="videocast-info" style={{ padding: '14px 16px' }}>
                    <span style={{ color: 'var(--isbank-blue)', fontWeight: 700, fontSize: '0.75rem' }}>{video.category}</span>
                    <strong style={{ display: 'block', marginTop: '4px', fontSize: '0.95rem' }}>{video.title}</strong>
                  </div>
                </div>
              );
            })}
            <Link to="/videocast" className="media-link link-green">
              Tüm Videocastleri İzle <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MediaSection;
