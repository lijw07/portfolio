import React, { forwardRef, useState, useRef, useEffect } from 'react';
import './About.css';

const About = forwardRef<HTMLDivElement>((props, ref) => {
  const [currentSection, setCurrentSection] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      title: "About Me",
      content: (
        <>
          <p>
            Hi, I'm Jai! I'm a software engineer who loves building things that matter – whether that's scalable backend systems that handle thousands of users or immersive 3D games that tell compelling stories.
          </p>
          <p>
            Currently, I'm pursuing my M.S. in Computer Science with a focus on Computer Graphics at Georgia Tech while working as a Software Engineer at Brightspot. My journey started at Northern Virginia Community College and took me through VCU before landing at one of the top tech programs in the country – a path that taught me persistence and the value of continuous learning.
          </p>
        </>
      )
    },
    {
      title: "What I Do",
      content: (
        <>
          <p>
            By day, I work directly with clients to bring their visions to life through scalable software solutions. I architect microservices and cloud-native systems using Java, Spring Boot, Docker, and Kubernetes that power content management platforms. I focus on translating client requirements into technical designs, building systems that automatically scale to handle traffic surges, and solving complex integration challenges across containerized environments.
          </p>
          <p>
            By night (and weekends), I dive into personal projects that challenge my technical skills. I'm developing 2D and 3D Unity applications with custom AI state machines, real-time pathfinding algorithms, and procedural system generation. I also work on full-stack web applications and desktop apps using ASP.NET Core and React, experimenting with microservice architectures, database optimization across multiple platforms, and containerized deployments that push the boundaries of what I learn in my professional work.
          </p>
        </>
      )
    },
    {
      title: "What Drives Me",
      content: (
        <>
          <p>
            I'm drawn to solving complex technical challenges that require both analytical thinking and creative problem-solving. Whether it's optimizing system performance, designing scalable architectures, or implementing efficient algorithms, I focus on building solutions that are both robust and maintainable.
          </p>
          <p>
            My approach centers on understanding the core problem before diving into implementation. I enjoy working through the technical constraints of microservice design, database optimization, and cloud deployment strategies. Each project teaches me something new about balancing functionality, performance, and code quality.
          </p>
          <p>
            Currently, I'm expanding my expertise in computer graphics and exploring how advanced rendering techniques can enhance both game development and enterprise applications. I'm particularly interested in projects that combine backend engineering with interactive user experiences.
          </p>
          <p>
            When I'm not coding, you'll find me collecting One Piece cards, hitting the gym, or playing with my dog Nugget. These hobbies keep me grounded and provide the mental reset needed to tackle complex technical problems with fresh perspective.
          </p>
        </>
      )
    }
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = textElement;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Prevent page scroll when scrolling within the text area
      if (e.deltaY > 0 && isAtBottom) {
        // Scrolling down at bottom - prevent default
        e.preventDefault();
      } else if (e.deltaY < 0 && isAtTop) {
        // Scrolling up at top - prevent default
        e.preventDefault();
      }
    };

    textElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      textElement.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection]);

  return (
    <section 
      className="about-section" 
      ref={ref}
    >
      <div className="container">
        <div className="about-header">
          <h2>Get to Know Me</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text" ref={textRef}>
            <h3>{sections[currentSection].title}</h3>
            {sections[currentSection].content}
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <img src={process.env.PUBLIC_URL + "/me.png"} alt="Jai Li" className="profile-picture" />
            </div>
          </div>
        </div>
        
        <div className="about-navigation">
          <button className="nav-button nav-button-left" onClick={prevSection}>
            <span>‹</span>
          </button>
          <div className="nav-indicators">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`nav-indicator ${index === currentSection ? 'active' : ''}`}
                onClick={() => setCurrentSection(index)}
              />
            ))}
          </div>
          <button className="nav-button nav-button-right" onClick={nextSection}>
            <span>›</span>
          </button>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;