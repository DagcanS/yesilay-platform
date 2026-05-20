import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Kontrolsüz müsünüz?</h2>
        <h1>KONTROL SİZ MİSİNİZ?</h1>
        <p>
          12-25 yaş aralığındaki gençler için dijital oyun ve bahis bağımlılığı
          farkındalık projesi. Çukurova Üniversitesi İletişim Fakültesi öğrencileri tarafından hazırlanmıştır.
        </p>
        <div className="hero-btns">
          <Link to="/#about" className="btn btn-primary">
            Harekete Geç <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <Link to="/podcast" className="btn btn-outline">Yayınlara Göz At</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
