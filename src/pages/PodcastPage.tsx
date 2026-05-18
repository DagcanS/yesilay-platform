import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PodcastPage: React.FC = () => {
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data, error } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
      if (error) console.error(error);
      else if (data) setEpisodes(data);
    };
    fetchPodcasts();
  }, []);

  const playAudio = (id: string) => {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      audio.play();
    }
  };

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-headphones"></i> Podcast Serileri</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Uzmanlarla derinlemesine sohbetler, gerçek hikayeler ve dijital dünyadaki riskleri tanıma rehberleri.
        </p>
      </section>

      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {episodes.map((ep) => (
            <div key={ep.id} className="episode-card" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-md)', transition: 'var(--transition)', display: 'flex', gap: '30px', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.02)' }}>
              <div 
                className="play-circle" 
                onClick={() => playAudio(`audio${ep.id}`)}
                style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.3s' }}
              >
                <i className="fa-solid fa-play"></i>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: 'var(--yesilay-green)', fontWeight: 600, fontSize: '0.85rem' }}>BÖLÜM {ep.id} • {ep.duration}</span>
                <h3 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{ep.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '15px' }}>{ep.description}</p>
                <audio id={`audio${ep.id}`} controls style={{ width: '100%', outline: 'none' }}>
                  <source src={ep.audio_url} type="audio/mpeg" />
                  Tarayıcınız ses öğesini desteklemiyor.
                </audio>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PodcastPage;
