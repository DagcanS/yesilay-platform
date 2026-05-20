import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/#about', label: 'Proje' },
  { to: '/#test', label: 'Test' },
  { to: '/makaleler', label: 'Makaleler' },
  { to: '/podcast', label: 'Podcast' },
  { to: '/videocast', label: 'Videocast' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sayfa değişince menüyü kapat
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Menü açıkken scroll kilitle
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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

      {/* Desktop Nav */}
      <nav className="desktop-nav">
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.to}>
              <Link to={item.to} className="nav-link">{item.label}</Link>
            </li>
          ))}
          <li><a href="/#support" className="btn btn-primary btn-nav">ÜCRETSİZ DESTEK AL</a></li>
        </ul>
      </nav>

      {/* Hamburger Butonu */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'currentColor', borderRadius: '2px', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'transform 0.3s' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'currentColor', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'currentColor', borderRadius: '2px', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'transform 0.3s' }} />
        </span>
      </button>

      {/* Mobile Menü */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--isbank-blue)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          gap: '8px',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.3rem',
              fontWeight: 600,
              padding: '16px 0',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {item.label}
          </Link>
        ))}
        <a
          href="/#support"
          className="btn btn-primary"
          style={{ marginTop: '24px', textAlign: 'center', padding: '16px' }}
        >
          <i className="fa-solid fa-phone" /> ÜCRETSİZ DESTEK AL
        </a>
      </div>
    </header>
  );
};

export default Header;
