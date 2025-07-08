import React, { useRef, useEffect } from 'react';
import UnityGame from './components/UnityGame';
import Header from './components/Header';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
// import ScrollDebugger from './components/ScrollDebugger'; // Uncomment for debugging
import { trackPageView } from './components/Analytics';
import './App.css';

function App() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    trackPageView('Portfolio Home');
  }, []);
  const aboutRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const isMobile = window.innerWidth <= 768;
      let headerOffset = isMobile ? 120 : 80;
      
      // All sections now have consistent padding, no special offset needed
      
      // Use scrollIntoView then adjust for header
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Adjust for fixed header
      setTimeout(() => {
        window.scrollBy({ top: -headerOffset, behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <UnityGame onSkip={scrollToPortfolio} />
      <Header 
        onScrollToSection={scrollToSection}
        onScrollToTop={scrollToTop}
        aboutRef={aboutRef}
        educationRef={educationRef}
        experienceRef={experienceRef}
        skillsRef={skillsRef}
        projectsRef={projectsRef}
        contactRef={contactRef}
      />
      {/* <ScrollDebugger 
        refs={[
          { name: 'About', ref: aboutRef },
          { name: 'Education', ref: educationRef },
          { name: 'Experience', ref: experienceRef },
          { name: 'Skills', ref: skillsRef },
          { name: 'Projects', ref: projectsRef },
          { name: 'Contact', ref: contactRef }
        ]}
      /> */}
      <div ref={portfolioRef} className="portfolio-content">
        <About ref={aboutRef} />
        <Education ref={educationRef} />
        <Experience ref={experienceRef} />
        <Skills ref={skillsRef} />
        <Projects ref={projectsRef} />
        <Contact ref={contactRef} />
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Portfolio by Jai Li. Built with React & Unity.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
