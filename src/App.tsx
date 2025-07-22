import React, { useRef, useEffect, useState } from 'react';
import UnityGame from './components/UnityGame';
import Header from './components/Header';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './App.css';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

function App() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [showGame, setShowGame] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // Desktop is defined as screens larger than typical tablets (> 1024px)
      setIsDesktop(window.innerWidth > 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const isMobile = window.innerWidth <= 768;
      let headerOffset = isMobile ? 120 : 80;
      
      // Track section navigation
      const sectionName = getSectionName(ref);
      if (sectionName && window.gtag) {
        window.gtag('event', 'section_navigation', {
          event_category: 'engagement',
          event_label: sectionName,
          value: 1
        });
      }
      
      // Use scrollIntoView then adjust for header
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Adjust for fixed header
      setTimeout(() => {
        window.scrollBy({ top: -headerOffset, behavior: 'smooth' });
      }, 100);
    }
  };

  const getSectionName = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref === aboutRef) return 'About';
    if (ref === educationRef) return 'Education';
    if (ref === experienceRef) return 'Experience';
    if (ref === skillsRef) return 'Skills';
    if (ref === projectsRef) return 'Projects';
    if (ref === contactRef) return 'Contact';
    return null;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // If desktop and user wants game, show Unity game without header
  if (isDesktop && showGame) {
    return (
      <div className="App game-mode">
        <UnityGame onQuitGame={() => setShowGame(false)} />
      </div>
    );
  }

  // Show portfolio (for mobile/tablet OR desktop users who quit the game)
  return (
    <div className="App">
      <Header 
        onScrollToSection={scrollToSection}
        onScrollToTop={scrollToTop}
        aboutRef={aboutRef}
        educationRef={educationRef}
        experienceRef={experienceRef}
        skillsRef={skillsRef}
        projectsRef={projectsRef}
        contactRef={contactRef}
        showPlayGameButton={isDesktop && !showGame}
        onPlayGame={() => setShowGame(true)}
      />
      <div className="portfolio-content">
        <About ref={aboutRef} />
        <Education ref={educationRef} />
        <Experience ref={experienceRef} />
        <Skills ref={skillsRef} />
        <Projects ref={projectsRef} />
        <Contact ref={contactRef} />
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Portfolio by Jai Li. Built with React.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
