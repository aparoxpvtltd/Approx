import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('no-scroll');
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove('no-scroll');
  };

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <a href="#" className="logo serif" onClick={closeMenu}>
        <img src="/logo.png" alt="Aparox AI Logo" id="site-logo" />
      </a>
      <nav className={`mono ${menuOpen ? 'active' : ''}`} id="main-nav">
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#analytics" onClick={closeMenu}>Analytics</a>
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>
      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        id="menu-toggle"
        aria-label="Toggle Menu"
        onClick={toggleMenu}
      >
        <div className="line"></div>
        <div className="line"></div>
      </button>
    </header>
  );
};

export default Navbar;
