import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-subtle)',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '500px' }}>
        {/* 404 Büyük Numara */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
          userSelect: 'none',
        }}>
          404
        </div>

        <i className="fa-solid fa-compass-drafting" style={{ fontSize: '2.5rem', color: '#94a3b8', marginBottom: '20px', display: 'block' }} />

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
          Sayfa Bulunamadı
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '40px' }}>
          Aradığınız sayfa taşınmış, silinmiş ya da hiç olmamış olabilir.
          Ana sayfaya dönerek devam edebilirsiniz.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <i className="fa-solid fa-house" /> Ana Sayfaya Dön
          </Link>
          <button
            className="btn btn-outline"
            style={{ border: '2px solid #e2e8f0', color: 'var(--text-secondary)', background: 'white' }}
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left" /> Geri Git
          </button>
        </div>

        {/* Hızlı Linkler */}
        <div style={{ marginTop: '48px', paddingTop: '28px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>
            POPÜLER SAYFALAR
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { to: '/makaleler', label: 'Makaleler', icon: 'fa-file-lines' },
              { to: '/podcast', label: 'Podcast', icon: 'fa-headphones' },
              { to: '/videocast', label: 'Videocast', icon: 'fa-video' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '99px',
                  background: '#f1f5f9', color: 'var(--text-secondary)',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--isbank-blue)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >
                <i className={`fa-solid ${link.icon}`} /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
