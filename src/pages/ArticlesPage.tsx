import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) console.error(error);
      else if (data) setArticles(data);
    };
    fetchArticles();
  }, []);

  return (
    <>
      <section className="page-hero">
        <h1><i className="fa-solid fa-file-lines"></i> Makaleler</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Bağımlılık, dijital riskler ve kurtuluş yolları üzerine uzman yazıları ve bilgilendirici içerikler.
        </p>
      </section>

      <section style={{ padding: '80px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {articles.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>Henüz yayınlanmış bir makale bulunmuyor.</p>
          ) : (
            articles.map(article => (
              <Link to={`/makale/${article.id}`} key={article.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', border: '1px solid rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: 'var(--isbank-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <i className="fa-solid fa-newspaper fa-3x"></i>
                    </div>
                  )}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{article.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>
                      {article.content.substring(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                      <span><i className="fa-solid fa-user"></i> {article.author || 'Anonim'}</span>
                      <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ArticlesPage;
