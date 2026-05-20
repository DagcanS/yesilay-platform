import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const readingTime = (text: string) => Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ maxWidth: '760px', margin: '120px auto 60px', padding: '0 5%' }}>
    <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '8px', width: '80%', marginBottom: '20px' }} />
    <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '8px', width: '40%', marginBottom: '40px' }} />
    {Array(6).fill(0).map((_, i) => (
      <div key={i} style={{ height: '16px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '12px', width: i % 3 === 2 ? '70%' : '100%' }} />
    ))}
  </div>
);

// ─── Paragraf Renderer ────────────────────────────────────────────────────────
const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split(/\n+/).filter(p => p.trim());
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--text-primary)', margin: 0 }}>
          {para}
        </p>
      ))}
    </div>
  );
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error || !data) setLoading(false);
      else { setArticle(data); setLoading(false); }
    };
    fetchArticle();
  }, [id]);

  // Okuma ilerlemesi
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <Skeleton />;

  if (!article) return (
    <div style={{ padding: '140px 5%', textAlign: 'center' }}>
      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '20px', display: 'block' }} />
      <h2 style={{ marginBottom: '16px' }}>Makale bulunamadı</h2>
      <Link to="/makaleler" className="btn btn-primary">
        <i className="fa-solid fa-arrow-left" /> Makalelere Dön
      </Link>
    </div>
  );

  return (
    <>
      {/* Okuma ilerleme çubuğu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '3px', zIndex: 9999,
        width: `${scrollProgress}%`, background: 'var(--accent-gradient)',
        transition: 'width 0.1s linear',
      }} />

      {/* Hero Kapak */}
      {article.image_url && (
        <div style={{
          width: '100%', height: '420px',
          backgroundImage: `url(${article.image_url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative', marginTop: '70px',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)' }} />
          {/* Başlık kapak üzerinde */}
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, padding: '0 5%', maxWidth: '860px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '12px' }}>
              {article.title}
            </h1>
          </div>
        </div>
      )}

      {/* İçerik Kartı */}
      <div style={{ maxWidth: '780px', margin: article.image_url ? '-60px auto 80px' : '120px auto 80px', padding: '0 20px', position: 'relative' }}>
        <article style={{
          background: 'white', borderRadius: '20px',
          padding: 'clamp(28px, 5vw, 56px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}>
          {/* Başlık (kapak yoksa) */}
          {!article.image_url && (
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.3 }}>
              {article.title}
            </h1>
          )}

          {/* Meta Bilgiler */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-user" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{article.author || 'Anonim'}</span>
            </div>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              <i className="fa-regular fa-calendar" /> {new Date(article.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              <i className="fa-regular fa-clock" /> {readingTime(article.content)} dk okuma
            </span>
          </div>

          {/* Makale İçeriği */}
          <ContentRenderer content={article.content} />

          {/* Alt Bölüm */}
          <div style={{ marginTop: '56px', paddingTop: '28px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <Link
              to="/makaleler"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--isbank-blue)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
            >
              <i className="fa-solid fa-arrow-left" /> Tüm Makaleler
            </Link>
            <a
              href="tel:115"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent-gradient)', color: 'white', padding: '10px 20px', borderRadius: '99px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            >
              <i className="fa-solid fa-phone" /> Ücretsiz Destek: 115
            </a>
          </div>
        </article>
      </div>
    </>
  );
};

export default ArticleDetail;
