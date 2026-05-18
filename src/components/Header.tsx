import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src="/logo.svg" alt="Proje Logosu" className="logo-img" />
          <div className="logo-text-container">
            <div className="logo-text-top">Kontrolsüz müsünüz?</div>
            <div className="logo-text-bottom">Kontrol siz misiniz?</div>
          </div>
        </Link>
      </div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/#about" className="nav-link">Proje</Link></li>
          <li><Link to="/#test" className="nav-link">Test</Link></li>
          <li><Link to="/makaleler" className="nav-link">Makaleler</Link></li>
          <li><Link to="/podcast" className="nav-link">Podcast</Link></li>
          <li><Link to="/videocast" className="nav-link">Videocast</Link></li>
          <li><a href="/#support" className="btn btn-primary btn-nav">ÜCRETSİZ DESTEK AL</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
