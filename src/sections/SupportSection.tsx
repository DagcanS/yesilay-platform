import React from 'react';

const SupportSection: React.FC = () => {
  return (
    <section id="support" className="support-section">
      <div className="support-container">
        {/* Puls animasyonlu ikon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <i className="fa-solid fa-phone-volume" style={{ fontSize: '2rem', color: 'white' }} />
          </div>
        </div>

        <h2>Yalnız Değilsin.</h2>
        <p>
          Bağımlılık danışmanlığı her an yanında.
          Ücretsiz, isimsiz ve tamamen gizli destek için uzmanlarımıza ulaşın.
        </p>

        {/* Bilgi Kartları */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {[
            { icon: 'fa-shield-halved', label: 'Gizli' },
            { icon: 'fa-user-slash', label: 'İsimsiz' },
            { icon: 'fa-circle-dollar-to-slot', label: 'Ücretsiz' },
            { icon: 'fa-clock', label: '7/24' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'white', fontWeight: 600, fontSize: '0.9rem',
            }}>
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </div>
          ))}
        </div>


      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(255,255,255,0); }
        }
      `}</style>
    </section>
  );
};

export default SupportSection;
