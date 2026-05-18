import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VideocastPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from('videocasts').select('*').order('created_at', { ascending: false });
      if (error) console.error(error);
      else if (data) setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-video"></i> Videocast Serileri</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Görsel dünyada bağımlılığın yüzü. Sokak röportajları, paneller ve çarpıcı kısa belgeseller.
        </p>
      </section>

      <section style={{ padding: '80px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {videos.map(video => (
            <div key={video.id} className="video-card" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)', border: '1px solid rgba(0, 0, 0, 0.02)', cursor: 'pointer' }}>
              <video controls style={{ width: '100%', aspectRatio: '16/9', background: '#0f172a', outline: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <source src={video.video_url} type="video/mp4" />
                Tarayıcınız video öğesini desteklemiyor.
              </video>
              <div className="video-info" style={{ padding: '20px' }}>
                <span style={{ color: video.categoryColor, fontWeight: 600, fontSize: '0.85rem' }}>{video.category}</span>
                <h3 style={{ fontSize: '1.3rem', margin: '10px 0' }}>{video.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default VideocastPage;
