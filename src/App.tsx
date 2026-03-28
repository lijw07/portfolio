import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import SpriteAnimation from './components/SpriteAnimation';
import DJAnimation from './components/DJAnimation';
import CoinAnimation from './components/CoinAnimation';
import FloatingExp from './components/FloatingExp';
import Forest from './components/Forest';
import Clouds from './components/Clouds';
import Birds from './components/Birds';
import Worms from './components/Worms';
import Servers from './components/Servers';
import { useScrollFade } from './hooks/useScrollFade';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const charCount = text.length;
  const baseDelay = 0.008;
  
  return (
    <span className="project-text">
      {text.split('').map((char, index) => (
        <span 
          key={index} 
          className="char" 
          style={{ 
            '--hover-delay': `${index * baseDelay}s`,
            '--unhover-delay': `${(charCount - index - 1) * baseDelay}s`
          } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

interface DirectionalButtonProps {
  href: string;
  children: React.ReactNode;
  isEmail?: boolean;
}

const DirectionalButton: React.FC<DirectionalButtonProps> = ({ href, children, isEmail = false }) => {
  return (
    <a 
      href={href} 
      target={isEmail ? undefined : "_blank"} 
      rel={isEmail ? undefined : "noopener noreferrer"}
      className="connect-link"
    >
      <span>{children}</span>
    </a>
  );
};

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, trailerUrl }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      console.log('Modal opened, video URL:', trailerUrl);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, trailerUrl]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Paws and Hooves</span>
          <button className="modal-close" onClick={onClose} aria-label="Close video">
            X
          </button>
        </div>
        <div className="video-container">
          <video
            controls
            controlsList="nodownload noplaybackrate"
            playsInline
            disablePictureInPicture
            preload="metadata"
            className="trailer-video"
            src={trailerUrl}
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              video.volume = 0.05;
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch(() => {});
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              console.error('Video load failed for:', video.src);
            }}
          />
        </div>
        <div className="modal-footer">
          <a href="https://github.com/lijw07/paws-and-hooves" target="_blank" rel="noopener noreferrer" className="modal-link">&gt; GitHub</a>
        </div>
      </div>
    </div>
  );
};

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  title: string;
  githubUrl: string;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, gameUrl, title, githubUrl }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content game-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close game">
            X
          </button>
        </div>
        <div className="game-container" ref={gameContainerRef}>
          <iframe
            src={gameUrl}
            title={title}
            className="game-iframe"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="modal-footer">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="modal-link">&gt; GitHub</a>
          <button className="modal-link fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? '[ ] Exit Fullscreen' : '[ ] Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [displayText, setDisplayText] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showDJ] = useState<boolean>(() => Math.random() < 0.5);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'light';
  });
  const fullText = 'Portfolio';
  
  const aboutFade = useScrollFade();
  const educationFade = useScrollFade();
  const experienceFade = useScrollFade();
  const skillsFade = useScrollFade();
  const projectsFade = useScrollFade();
  const professionalFade = useScrollFade();
  const connectFade = useScrollFade();
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 200);
    
    return () => clearInterval(typingInterval);
  }, []);

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="App">
      <div className="theme-container">
        <div className="theme-sprite-container">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/sprites/${theme === 'light' ? 'sun.png' : 'moon.png'}`}
            alt={theme === 'light' ? 'Dark mode' : 'Light mode'}
            className="theme-sprite"
          />
          <button className="theme-text-button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? 'light' : 'dark'}
          </button>
        </div>
      </div>
      <div className="hero-section">
        <Clouds />
        <Birds />
        <h1>
          {displayText}
          <span className="cursor">|</span>
        </h1>
        <div className="sprite-animation-container">
          {showDJ ? (
            <DJAnimation key="dj-animation" />
          ) : (
            <SpriteAnimation key="sprite-animation" />
          )}
        </div>
      </div>
      
      <section ref={aboutFade.ref as React.RefObject<HTMLElement>} className={`about-section standalone fade-section ${aboutFade.isVisible ? 'visible' : ''}`}>
        <div className="about-header">
          <h2>My name is Jai Li</h2>
          <CoinAnimation />
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              I am an agile software engineer.<br />
              I build backend applications with Spring Boot and ASP.NET.<br />
              I make games with Unity.
            </p>
            <p>Agile software engineer and indie game developer with experience in microservice architecture, cloud-native pipelines, CI/CD automation, and Unity-based real-time 2D/3D game mechanics.</p>
          </div>
        </div>
      </section>
      
      <section ref={educationFade.ref as React.RefObject<HTMLElement>} className={`education-section fade-section ${educationFade.isVisible ? 'visible' : ''}`}>
        <h2>Education</h2>
        <ul>
          <li>M.S Computer Science • Georgia Institute of Technology • 2025 - 2026</li>
          <li>B.S Computer Science • Virginia Commonwealth University • 2020 - 2022</li>
          <li>A.S Computer Science • Northern Virginia Community College • 2018 - 2019</li>
        </ul>
      </section>
      
      <div className="content-container">
        <section ref={experienceFade.ref as React.RefObject<HTMLElement>} className={`experience-section fade-section ${experienceFade.isVisible ? 'visible' : ''}`}>
          <h2>Experience</h2>
          <ul>
            <li>Patent Examiner • United States Patent and Trademark Office • 2025 - Present</li>
            <li>Software Engineer • Brightspot • 2022 - 2024</li>
          </ul>
          <Servers />
        </section>
        
        <section ref={skillsFade.ref as React.RefObject<HTMLElement>} className={`skills-section fade-section ${skillsFade.isVisible ? 'visible' : ''}`}>
          <h2>Skills</h2>
          <ul>
            <li>Java, C#, SQL</li>
            <li>Spring Boot, ASP.NET, Entity Framework</li>
            <li>Docker, Kubernetes, RESTful APIs, AWS, GCP, xUnit, JUnit, JDBC, JWT</li>
            <li>MySQL, NoSQL, MongoDB, SQL Server, H2</li>
            <li>Unity, Godot, Blender, Aseprite</li>
          </ul>
        </section>
      </div>
      
      <section ref={projectsFade.ref as React.RefObject<HTMLElement>} className={`projects-section fade-section ${projectsFade.isVisible ? 'visible' : ''}`}>
        <div className="projects-header">
          <h2>Personal Projects</h2>
          <FloatingExp />
        </div>
        <ul>
          <li>
            <a href="https://github.com/lijw07/portfolio" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Interactive Portfolio" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/lijw07/paws-and-hooves"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTrailer(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <AnimatedText text="Paws and Hooves (Click title for trailer)" />
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/lijw07/tower-defense"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowGame(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <AnimatedText text="Tower Defense (Click title to play)" />
              </span>
            </a>
          </li>
          <li>
            <a href="https://github.com/lijw07/cams" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Centralized Application Management System" />
            </a>
          </li>
          <li>
            <a href="https://github.com/lijw07/TreasureHunt" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Treasure Hunt" />
            </a>
          </li>
          <li>
            <span className="no-link"><AnimatedText text="Automated Information Extraction for Multilingual Lease Documents (Private Repo)" /></span>
          </li>
          <li>
            <span className="no-link"><AnimatedText text="Enterprise CMS Modules for Client-Specific Solutions (Private Repo)" /></span>
          </li>
          <li>
            <span className="no-link"><AnimatedText text="Regurgitate (Private Repo)" /></span>
          </li>
        </ul>
      </section>
      
      <div className="worms-section">
        <Worms />
      </div>
      
      <section ref={professionalFade.ref as React.RefObject<HTMLElement>} className={`projects-section professional-work fade-section ${professionalFade.isVisible ? 'visible' : ''}`}>
        <h2>Professional Work</h2>
        <ul>
          <li>
            <a href="https://ads.google.com/intl/en_us/start/overview-ha/?subid=us-en-ha-awa-bk-c-000!o3~Cj0KCQjwhafEBhCcARIsAEGZEKJAul66GgkOSXDWPOurdERZvtxa--rq6w0ws_X-sax9HlMqHvwRC-4aAmcrEALw_wcB~137408560317~kwd-94527731~17414652933~725145496224&gad_source=1&gad_campaignid=17414652933&gclid=Cj0KCQjwhafEBhCcARIsAEGZEKJAul66GgkOSXDWPOurdERZvtxa--rq6w0ws_X-sax9HlMqHvwRC-4aAmcrEALw_wcB&gclsrc=aw.ds" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Google Ads" />
            </a>
          </li>
          <li>
            <a href="https://www.google.com/about/careers/applications/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Google Careers" />
            </a>
          </li>
          <li>
            <a href="https://marketingplatform.google.com/about/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Google Marketing" />
            </a>
          </li>
          <li>
            <a href="https://www.aarp.org/homepage/welcome/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="AARP" />
            </a>
          </li>
          <li>
            <a href="https://www.npr.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="NPR" />
            </a>
          </li>
          <li>
            <a href="https://www.byu.edu/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="BYU" />
            </a>
          </li>
          <li>
            <a href="https://www.wskg.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="WSKG" />
            </a>
          </li>
          <li>
            <a href="https://kansaspublicradio.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="KPR" />
            </a>
          </li>
          <li>
            <a href="https://knpr.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="KNPR" />
            </a>
          </li>
          <li>
            <a href="https://www.vpm.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="VPM" />
            </a>
          </li>
          <li>
            <a href="https://www.wgbh.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="WGBH" />
            </a>
          </li>
          <li>
            <a href="https://www.ideastream.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Ideastream" />
            </a>
          </li>
          <li>
            <a href="https://www.lpm.org/news" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="LPM" />
            </a>
          </li>
          <li>
            <a href="https://www.marfapublicradio.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="MPR" />
            </a>
          </li>
          <li>
            <a href="https://radiomilwaukee.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="Radio Milwaukee" />
            </a>
          </li>
          <li>
            <a href="https://www.pbssocal.org/" target="_blank" rel="noopener noreferrer">
              <AnimatedText text="PBS SoCal" />
            </a>
          </li>
        </ul>
      </section>
      
      <div style={{ position: 'relative' }}>
        <Forest />
      <section ref={connectFade.ref as React.RefObject<HTMLElement>} className={`connect-section fade-section ${connectFade.isVisible ? 'visible' : ''}`} style={{ position: 'relative' }}>
        <h2>Connect</h2>
        <div className="connect-links">
          <DirectionalButton href="https://github.com/lijw07">
            GitHub
          </DirectionalButton>
          <DirectionalButton href="https://www.linkedin.com/in/jai-li-va/">
            LinkedIn
          </DirectionalButton>
          <DirectionalButton href="https://leetcode.com/u/Crosssoul1/">
            Leetcode
          </DirectionalButton>
          <DirectionalButton href="https://stackoverflow.com/users/10416064/crust01">
            Stackoverflow
          </DirectionalButton>
          <span className="connect-link selectable">
            <span>Jli3614@proton.me</span>
          </span>
        </div>
      </section>
      </div>
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={`${process.env.PUBLIC_URL}/Index_Paws_And_Hooves_Trailer_compressed.mp4`}
      />
      <GameModal
        isOpen={showGame}
        onClose={() => setShowGame(false)}
        gameUrl={`${process.env.PUBLIC_URL}/tower-defense/index.html`}
        title="Tower Defense"
        githubUrl="https://github.com/lijw07/tower-defense"
      />
    </div>
  );
}

export default App;
