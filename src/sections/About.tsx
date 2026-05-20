import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about">
      <div className="section-title">Proje Hakkında</div>
      <div className="grid">
        <div className="card">
          <i className="fa-solid fa-graduation-cap fa-3x icon-green"></i>
          <h3>Eğitim Odaklı</h3>
          <p>Gençlerin dijital mecralardaki oyun ve bahis tuzaklarına karşı farkındalıklarını artırıyoruz.</p>
        </div>
        <div className="card">
          <i className="fa-solid fa-shield-halved fa-3x icon-blue"></i>
          <h3>Uzman Rehberliği</h3>
          <p>Bağımlılık uzmanları ve akademisyenlerin katkılarıyla hazırlanan bilimsel içerikler ve rehberlik yolları.</p>
        </div>
        <div className="card">
          <i className="fa-solid fa-users-gear fa-3x icon-green"></i>
          <h3>Katılımcı Yaklaşım</h3>
          <p>Podcast ve Videocast serileriyle gerçek hikayeleri ve çözüm yollarını gençlerin dilinden anlatıyoruz.</p>
        </div>
      </div>
    </section>
  );
};

export default About;
