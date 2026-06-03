import React, { useRef } from 'react';

const students = [
  'Aleyna Taşçı',
  'Ali Ayhan',
  'Ali Karahan',
  'Ayşe Miray Bahar',
  'Bora Demir',
  'Cemal Kaan Karakurum',
  'Dağcan Hanifi Sonat',
  'Dicle Deran',
  'Duru Kadıoğlu',
  'Duygu Kavak',
  'Ece Ertunç',
  'Fevzi Birdoğan',
  'Furkan Baysal',
  'İlkay Topatan',
  'İrem Çetin',
  'Nida Ata',
  'Tuğçe Subatan',
  'Yaren Keleş',
  'Yusuf Çiçek',
];

const About: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const teamList = [
    { type: 'instructor', name: 'Gülnur Kaplan Esen', role: 'Yürütücü Hoca' },
    ...students.map(s => ({ type: 'student', name: s, role: 'Öğrenci' }))
  ];

  return (
    <section id="about" style={{ padding: '100px 5% 60px', background: 'var(--bg-light)' }}>
      {/* ── Başlık ──────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          display: 'inline-block',
          padding: '6px 18px',
          borderRadius: '99px',
          background: 'rgba(0,136,90,0.08)',
          color: 'var(--yesilay-green)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          <i className="fa-solid fa-info-circle" style={{ marginRight: '6px' }} />
          Hakkımızda
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '0',
          lineHeight: 1.2,
        }}>
          Proje Hakkında
        </h2>
      </div>

      {/* ── Açıklama Metni ──────────────────────────────────────── */}
      <p style={{
        maxWidth: '760px',
        margin: '0 auto 60px',
        textAlign: 'center',
        fontSize: '1.08rem',
        lineHeight: '1.9',
        color: 'var(--text-secondary)',
        padding: '0 16px',
      }}>
        Bu platform, Çukurova Üniversitesi İletişim Fakültesi bünyesinde yürütülen{' '}
        <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Sağlık İletişimi Uygulamaları</strong>{' '}
        dersi kapsamında hazırlanan bir sosyal sorumluluk ve farkındalık projesidir.
        Temel amacımız, bireyleri günümüzün en büyük tehditlerinden biri olan dijital kumar ve bahis bağımlılığı
        tuzaklarına karşı bilinçlendirmektir. Akademik bilgi birikimini ve modern iletişim araçlarını
        (podcast, videocast, interaktif testler) bir araya getirerek, toplumsal farkındalık oluşturmayı
        ve daha sağlıklı alışkanlıkları teşvik etmeyi hedefliyoruz.
      </p>

      {/* ── Özellik Kartları ────────────────────────────────────── */}
      <div className="grid" style={{ maxWidth: '1100px', margin: '0 auto 80px' }}>
        {[
          {
            icon: 'fa-graduation-cap',
            color: 'var(--yesilay-green)',
            bgColor: 'rgba(0,136,90,0.06)',
            title: 'Eğitim Odaklı',
            desc: 'Gençlerin dijital mecralardaki oyun ve bahis tuzaklarına karşı farkındalıklarını artırıyoruz.',
          },
          {
            icon: 'fa-shield-halved',
            color: 'var(--isbank-blue)',
            bgColor: 'rgba(222,53,60,0.05)',
            title: 'Uzman Rehberliği',
            desc: 'Bağımlılık uzmanları ve akademisyenlerin katkılarıyla hazırlanan bilimsel içerikler ve rehberlik yolları.',
          },
          {
            icon: 'fa-users-gear',
            color: 'var(--yesilay-green)',
            bgColor: 'rgba(0,136,90,0.06)',
            title: 'Katılımcı Yaklaşım',
            desc: 'Podcast ve Videocast serileriyle gerçek hikayeleri ve çözüm yollarını gençlerin dilinden anlatıyoruz.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '36px 32px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              background: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1.6rem', color: item.color }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Ekibimiz (Carousel) ─────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Ekip Başlığı */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: '99px',
            background: 'rgba(0,136,90,0.08)',
            color: 'var(--yesilay-green)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            <i className="fa-solid fa-people-group" style={{ marginRight: '6px' }} />
            Ekibimiz
          </span>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Proje Ekibi
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Çukurova Üniversitesi İletişim Fakültesi
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', padding: '0 40px' }}>
          {/* Sol Buton */}
          <button
            onClick={() => scrollCarousel('left')}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {/* Kaydırılabilir Alan */}
          <div
            ref={carouselRef}
            className="carousel-track"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '10px 4px',
              // Hide scrollbar inline
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {teamList.map((member, i) => {
              const isInstructor = member.type === 'instructor';
              const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              const gradients = [
                'linear-gradient(135deg, #00885a, #00b876)',
                'linear-gradient(135deg, #0f766e, #2dd4bf)',
                'linear-gradient(135deg, #1d4ed8, #60a5fa)',
                'linear-gradient(135deg, #7c3aed, #a78bfa)',
                'linear-gradient(135deg, #be185d, #f472b6)',
                'linear-gradient(135deg, #c2410c, #fb923c)',
                'linear-gradient(135deg, #0369a1, #38bdf8)',
                'linear-gradient(135deg, #4338ca, #818cf8)',
                'linear-gradient(135deg, #059669, #34d399)',
                'linear-gradient(135deg, #b91c1c, #f87171)',
              ];
              // Hoca için her zaman özel bir gradient (örn: accent gradient)
              const gradient = isInstructor ? 'var(--accent-gradient)' : gradients[i % gradients.length];

              return (
                <div
                  key={i}
                  className="flip-card"
                  style={{
                    flex: '0 0 auto',
                    width: '200px', // Kart genişliği
                    height: '240px', // Kart yüksekliği
                    perspective: '800px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="flip-card-inner"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Ön yüz */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: '16px',
                      background: gradient,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      gap: '12px',
                      padding: '20px',
                      border: isInstructor ? '2px solid rgba(255,255,255,0.2)' : 'none',
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        border: '2px solid rgba(255,255,255,0.3)',
                      }}>
                        {isInstructor ? <i className="fa-solid fa-chalkboard-user" /> : initials}
                      </div>
                      <div style={{
                        fontSize: isInstructor ? '1rem' : '0.9rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}>
                        {isInstructor ? member.name : member.name.split(' ')[0]}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontWeight: 600,
                      }}>
                        {member.role}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        fontSize: '0.65rem',
                        opacity: 0.6,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        <i className="fa-solid fa-rotate" style={{ marginRight: '4px', fontSize: '0.6rem' }} />
                        Çevir
                      </div>
                    </div>

                    {/* Arka yüz */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: '16px',
                      background: 'white',
                      transform: 'rotateY(180deg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      padding: '24px 16px',
                      gap: '10px',
                    }}>
                      <i 
                        className={isInstructor ? "fa-solid fa-chalkboard-user" : "fa-solid fa-user-graduate"} 
                        style={{ fontSize: '1.8rem', color: 'var(--yesilay-green)' }} 
                      />
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}>
                        {member.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}>
                        {isInstructor ? 'Çukurova Üniversitesi İletişim Fakültesi' : 'Çukurova Üniversitesi'}
                      </div>
                      <div style={{
                        width: '32px',
                        height: '4px',
                        borderRadius: '99px',
                        background: gradient,
                        marginTop: 'auto',
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sağ Buton */}
          <button
            onClick={() => scrollCarousel('right')}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* Flip Card & Carousel CSS */}
      <style>{`
        .carousel-track::-webkit-scrollbar {
          display: none;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card:focus-within .flip-card-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default About;
