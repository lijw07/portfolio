import React, { useState, useEffect } from 'react';
import './App.css';

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
      // Ensure body doesn't scroll when modal is open
      document.body.style.overflow = 'hidden';
      console.log('Modal opened, video URL:', trailerUrl);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, trailerUrl]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              video.volume = 0.05; // Set volume to 5%
              console.log('Video metadata loaded successfully');
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              console.log('Video can play, starting...');
              video.play().catch(err => {
                console.log('Autoplay blocked, user needs to click play:', err);
              });
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              console.error('Video load failed for:', video.src);
              console.error('Error:', video.error);
            }}
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [displayText, setDisplayText] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'light'; // Default to light theme
  });
  const fullText = 'Portfolio';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 200); // Adjust speed here (milliseconds per character)
    
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
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? 'dark' : 'light'}
      </button>
      <div className="hero-section">
        <h1>{displayText}<span className="cursor">|</span></h1>
      </div>
      
      <section className="about-section standalone">
        <h2>My name is Jai Li</h2>
        <p>
          I am an agile software engineer.<br />
          I make backend applications with Springboot and ASP.NET<br />
          I make games with Unity.
        </p>
        <p>Agile software engineer and indie game developer with experience in microservice architecture, cloud-native pipelines, CI/CD automation, and Unity-based real-time 2D/3D game mechanics.</p>
      </section>
      
      <section className="education-section">
        <h2>Education</h2>
        <ul>
          <li>Northern Virginia Community College • Associate of Science in Computer Science • 2018 - 2019</li>
          <li>Virginia Commonwealth University • Bachelor of Science in Computer Science • 2020 - 2022</li>
          <li>Georgia Institute of Technology • Master of Science in Computer Science • 2025 - Present</li>
        </ul>
      </section>
      
      <div className="content-container">
        <section className="experience-section">
          <h2>Experience</h2>
          <ul>
            <li>2022 - Present • Software Engineer • Brightspot</li>
          </ul>
        </section>
        
        <section className="skills-section">
          <h2>Skills</h2>
          <ul>
            <li>Java, C#, Sql</li>
            <li>Spring Boot, ASP.NET, Entity Framework, Unity</li>
            <li>Docker, Kubernetes, RESTful api, S3, EC2, SQS, SNS Lambda, Cloudwatch, API Gateway, GCP, xUnit, jUnit, JDBC, JWT</li>
            <li>MySql, NoSQl, MongoDb, SQL Server, H2</li>
          </ul>
        </section>
      </div>
      
      <section className="projects-section">
        <h2>Selected Work</h2>
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
      
      <section className="connect-section">
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
            <span>Tommyli874@gmail.com</span>
          </span>
        </div>
      </section>
      <TrailerModal 
        isOpen={showTrailer} 
        onClose={() => setShowTrailer(false)}
        trailerUrl={`${process.env.PUBLIC_URL}/Index_Paws_And_Hooves_Trailer_compressed.mp4`}
      />
    </div>
  );
}

export default App;
