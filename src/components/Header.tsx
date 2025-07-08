import React from 'react';
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
}

const Header: React.FC<HeaderProps> = ({
  onScrollToSection,
  onScrollToTop,
  aboutRef,
  educationRef,
  experienceRef,
  skillsRef,
  projectsRef,
  contactRef
}) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <button onClick={onScrollToTop} className="logo">Jai Li</button>
          <nav className="navigation">
            <button onClick={() => onScrollToSection(aboutRef)} className="nav-link">About</button>
            <button onClick={() => onScrollToSection(educationRef)} className="nav-link">Education</button>
            <button onClick={() => onScrollToSection(experienceRef)} className="nav-link">Experience</button>
            <button onClick={() => onScrollToSection(skillsRef)} className="nav-link">Skills</button>
            <button onClick={() => onScrollToSection(projectsRef)} className="nav-link">Projects</button>
            <button onClick={() => onScrollToSection(contactRef)} className="nav-link">Contact</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;