import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/logo.svg" alt="Proje Logosu" className="footer-logo" />
          <p>
            12-25 yaş aralığındaki gençler için dijital bağımlılık
            farkındalığı oluşturmayı amaçlayan akademik bir proje.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Çukurova Üniversitesi İletişim Fakültesi<br />İletişim Bilimleri Öğrencileri
          </p>
          <div className="footer-socials">
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Hızlı Menü</h4>
          <ul>
            <li><Link to="/#about">Proje Hakkında</Link></li>
            <li><Link to="/#test">Bağımlılık Testi</Link></li>
            <li><Link to="/makaleler">Makaleler</Link></li>
            <li><Link to="/podcast">Podcast Serisi</Link></li>
            <li><Link to="/videocast">Videocast Serisi</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Acil Destek</h4>
          <p>Kendiniz veya bir yakınınız için hemen şimdi yardıma mı ihtiyacınız var?</p>
          
          <span className="footer-note">Tamamen ücretsiz ve gizlidir.</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p><strong>Çukurova Üniversitesi İletişim Fakültesi İletişim Bilimleri Öğrencileri</strong></p>
        <p className="copyright">&copy; 2026 Kontrolsüz müsünüz? Kontrol siz misiniz? Projesi. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
