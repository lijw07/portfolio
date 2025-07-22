import React, { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  onScrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onScrollToTop: () => void;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  educationRef: React.RefObject<HTMLDivElement | null>;
  experienceRef: React.RefObject<HTMLDivElement | null>;
  skillsRef: React.RefObject<HTMLDivElement | null>;
  projectsRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  showPlayGameButton?: boolean;
  onPlayGame?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onScrollToSection,
  onScrollToTop,
  aboutRef,
  educationRef,
  experienceRef,
  skillsRef,
  projectsRef,
  contactRef,
  showPlayGameButton,
  onPlayGame
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (ref: React.RefObject<HTMLDivElement | null>) => {
    onScrollToSection(ref);
    setMobileMenuOpen(false); // Close menu after clicking
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button onClick={onScrollToTop} className="logo">Jai Li</button>
            
            {/* Desktop Navigation */}
            <nav className="navigation desktop-nav">
              <button onClick={() => onScrollToSection(aboutRef)} className="nav-link">About</button>
              <button onClick={() => onScrollToSection(educationRef)} className="nav-link">Education</button>
              <button onClick={() => onScrollToSection(experienceRef)} className="nav-link">Experience</button>
              <button onClick={() => onScrollToSection(skillsRef)} className="nav-link">Skills</button>
              <button onClick={() => onScrollToSection(projectsRef)} className="nav-link">Projects</button>
              <button onClick={() => onScrollToSection(contactRef)} className="nav-link">Contact</button>
              {showPlayGameButton && (
                <button onClick={onPlayGame} className="nav-link play-game-button">
                  🎮 Play Game
                </button>
              )}
            </nav>

            {/* Hamburger Menu Button */}
            <button 
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <button onClick={() => handleNavClick(aboutRef)} className="mobile-nav-link">About</button>
          <button onClick={() => handleNavClick(educationRef)} className="mobile-nav-link">Education</button>
          <button onClick={() => handleNavClick(experienceRef)} className="mobile-nav-link">Experience</button>
          <button onClick={() => handleNavClick(skillsRef)} className="mobile-nav-link">Skills</button>
          <button onClick={() => handleNavClick(projectsRef)} className="mobile-nav-link">Projects</button>
          <button onClick={() => handleNavClick(contactRef)} className="mobile-nav-link">Contact</button>
        </div>
      </nav>
    </>
  );
};

export default Header;