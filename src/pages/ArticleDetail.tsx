import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error || !data) {
        console.error(error);
        setLoading(false);
      } else {
        setArticle(data);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Yükleniyor...</div>;
  if (!article) return <div style={{ padding: '100px', textAlign: 'center' }}>Makale bulunamadı. <br/><br/><Link to="/makaleler" className="btn btn-primary">Geri Dön</Link></div>;

  return (
    <>
      {article.image_url && (
        <div style={{ width: '100%', height: '400px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
        </div>
      )}
      
      <section style={{ padding: '60px 5%', maxWidth: '800px', margin: article.image_url ? '-100px auto 0' : '80px auto 0', position: 'relative', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--isbank-blue)' }}>{article.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span><i className="fa-solid fa-user"></i> Yazar: {article.author || 'Anonim'}</span>
            <span><i className="fa-solid fa-calendar"></i> Tarih: {new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        
        <div style={{ lineHeight: '1.8', color: 'var(--text-primary)', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center' }}>
          <Link to="/makaleler" style={{ color: 'var(--isbank-blue)', textDecoration: 'none', fontWeight: 600 }}>
            <i className="fa-solid fa-arrow-left"></i> Tüm Makalelere Dön
          </Link>
        </div>
      </section>
    </>
  );
};

export default ArticleDetail;
