import React, { forwardRef } from 'react';
import './Skills.css';
import { useSectionTracking } from './Analytics';

const Skills = forwardRef<HTMLDivElement>((props, ref) => {
  const localRef = React.useRef<HTMLDivElement>(null);
  useSectionTracking('Skills Section', localRef);
  const skillCategories = [
    {
      category: 'Programming Languages',
      skills: ['Java', 'C#', 'SQL']
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['Spring Boot', 'ASP.NET Core', 'Entity Framework', 'Unity', 'React']
    },
    {
      category: 'Tools & Platforms',
      skills: ['Docker', 'Kubernetes', 'Git', 'AWS', 'GCP', 'Postman', 'Swagger', 'xUnit', 'jUnit', 'JDBC', 'JWT', 'OAuth 2.0', 'Datadog']
    },
    {
      category: 'Databases',
      skills: ['MySQL', 'NoSQL', 'MongoDB', 'SQL Server', 'H2']
    },
    {
      category: 'Development Tools',
      skills: ['VS Code', 'IntelliJ', 'Rider', 'DataGrip', 'Figma', 'Jira', 'Unix/Linux', 'Terminal/CLI']
    }
  ];

  return (
    <section className="skills-section" ref={(el: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
      localRef.current = el;
    }}>
      <div className="container">
        <h2>Skills & Technologies</h2>
        <div className="skills-showcase">
          {skillCategories.map((category, index) => (
            <div key={category.category} className="skill-category-wrapper">
              <div className="category-header">
                <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{category.category}</h3>
              </div>
              <div className="skills-flow">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill} className="skill-item" style={{ animationDelay: `${skillIndex * 0.1}s` }}>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;