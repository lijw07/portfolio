import React, { forwardRef } from 'react';
import './Experience.css';
import { useSectionTracking } from './Analytics';

const Experience = forwardRef<HTMLDivElement>((props, ref) => {
  const localRef = React.useRef<HTMLDivElement>(null);
  useSectionTracking('Experience Section', localRef);
  const experiences = [
    {
      title: 'Software Engineer',
      company: 'Brightspot',
      location: 'Remote',
      period: 'Jun 2022 – Present',
      description: [
        'Developed RESTful microservices using Java servlets to deliver dynamic content for authors/editors, reducing page update times and boosting engagement',
        'Maintained Kubernetes clusters with CI/CD pipelines to auto-scale environments, recover from site crashes, and respond to traffic surges',
        'Led architectural design for new client features using Agile methodology, translating requirements into scalable database schemas and API contracts',
        'Implemented RESTful endpoints for user data migrations, supporting async workflows and enhanced CMS flexibility',
        'Resolved bugs and ensured performance for multiple headless CMS clients across deployment stages'
      ],
      technologies: ['Java', 'RESTful APIs', 'Kubernetes', 'CI/CD', 'Microservices', 'Agile', 'Database Design', 'CMS']
    }
  ];

  return (
    <section className="experience-section" ref={(el: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
      localRef.current = el;
    }}>
      <div className="container">
        <h2>Work Experience</h2>
        <div className="experience-showcase">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="experience-header">
                <div className="job-icon">
                  <img src={process.env.PUBLIC_URL + "/brightspot_logo.jpeg"} alt="Brightspot Logo" className="company-logo" />
                </div>
                <div className="job-details">
                  <h3>{exp.title}</h3>
                  <div className="company-info">
                    <h4>{exp.company}</h4>
                    <div className="job-meta">
                      <span className="location">{exp.location}</span>
                      <span className="period">{exp.period}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="experience-description">
                <ul>
                  {exp.description.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="experience-technologies">
                <div className="tech-label">Technologies:</div>
                <div className="tech-list">
                  {exp.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Experience.displayName = 'Experience';

export default Experience;