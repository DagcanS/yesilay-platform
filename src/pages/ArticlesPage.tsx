import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const readingTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
    <div style={{ height: '200px', background: '#e2e8f0' }} />
    <div style={{ padding: '20px' }}>
      <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '6px', width: '75%', marginBottom: '12px' }} />
      <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '8px' }} />
      <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '6px', width: '60%' }} />
    </div>
  </div>
);

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.author || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-file-lines"></i> Makaleler</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px' }}>
          Bağımlılık, dijital riskler ve kurtuluş yolları üzerine uzman yazıları.
        </p>
        {/* Arama Kutusu */}
        <div style={{ maxWidth: '440px', margin: '0 auto', position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Makale veya yazar ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 44px', borderRadius: '99px',
              border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)',
              color: 'white', fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(8px)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </section>

      <section style={{ padding: '60px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {!loading && articles.length > 0 && (
            <p style={{ marginBottom: '28px', color: '#64748b', fontSize: '0.9rem' }}>
              {filtered.length} makale bulundu
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {loading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
                <i className="fa-solid fa-file-lines" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }} />
                <p style={{ fontSize: '1.1rem' }}>
                  {search ? `"${search}" için sonuç bulunamadı.` : 'Henüz makale yayınlanmamış.'}
                </p>
              </div>
            ) : (
              filtered.map(article => (
                <Link
                  to={`/makale/${article.id}`}
                  key={article.id}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
                >
                  <div
                    style={{
                      background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)',
                      height: '100%', display: 'flex', flexDirection: 'column', width: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  >
                    {/* Kapak */}
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, var(--isbank-blue), #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-newspaper" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.5)' }} />
                      </div>
                    )}

                    {/* İçerik */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {article.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '16px' }}>
                        {article.content.substring(0, 120)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <span><i className="fa-solid fa-user" /> {article.author || 'Anonim'}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span><i className="fa-regular fa-clock" /> {readingTime(article.content)} dk okuma</span>
                          <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticlesPage;
