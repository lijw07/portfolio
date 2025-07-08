import React from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const projects = [
    {
      name: 'Costar Automated Information Extraction',
      description: 'Produced an AWS pipeline with Chalice that translated and extracted key datasets in multilingual lease agreements. Built a Python ETL pipeline using pandas to clean and prepare data for ML models.',
      tech: ['Python', 'AWS', 'Chalice', 'pandas', 'SNS', 'SQS', 'S3', 'Machine Learning', 'ETL'],
      featured: true
    },
    {
      name: 'Enterprise CMS Modules for Client-Specific Solutions',
      description: 'Collaborated with clients to resolve bugs and implement requested changes. Added rich text editing with DFS-based toolbars on editable content fields and created dynamic Java servlet pages.',
      tech: ['Java', 'MVC', 'CMS', 'Rich Text Editing', 'Database Design'],
      featured: true
    },
    {
      name: 'Paws And Hooves — Indie Game Dev Project',
      description: 'Built a 3D puzzle-adventure game in Unity with 4 unique animal characters and custom mechanics. Programmed AI behaviors and NPC pathfinding using state machines and Unity Animator.<br/><i>Feel Free to request a demo build!</i>',
      tech: ['C#', 'Unity', 'AI Programming', 'State Machines', 'UI Systems', 'Game Design'],
      github: 'https://github.com/lijw07/Paws-and-Hooves',
      trailer: '/Index_Paws_And_Hooves_Trailer.mp4',
      featured: true
    },
    {
      name: 'Treasure Hunt — Indie Game Dev Project',
      description: 'Developing an open-world exploration RPG in Unity with modular systems architecture. Features planned 4-level tool progression, environmental interactions (mining, planting, wood cutting, fishing), NPC interactions, and multi-biome world design. Built with extensible crafting and inventory systems.',
      tech: ['C#', 'Unity', 'Game Architecture', 'Modular Systems', 'Environmental Design', 'RPG Mechanics'],
      github: 'https://github.com/lijw07/TreasureHunt',
      featured: true
    },
    {
      name: 'CAMS — Centralized Application Management System',
      description: 'Developed a multi-tenant web application to centralize client/user data management from diverse sources. Connected up to 20 data sources/APIs in a single session, enabling secure CRUD operations.',
      tech: ['C#', 'ASP.NET Core MVC', 'EF Core', 'xUnit', 'React', 'Docker', 'AWS RDS', 'GCP', 'MySQL', 'SQL Server', 'MongoDB'],
      github: 'https://github.com/lijw07/Centralized-Application-Management-System',
      featured: true
    },
    {
      name: 'Interactive Portfolio',
      description: 'A modern, interactive portfolio website built with React and Unity. Features a Unity-based interactive intro, responsive design, and dynamic sections for education, projects, and contact information. Includes school logos, project media, and smooth scrolling navigation.',
      tech: ['React', 'TypeScript', 'Unity', 'CSS3', 'HTML5', 'JavaScript', 'Responsive Design'],
      github: 'https://github.com/lijw07/Interactive-Portfolio',
      featured: true
    },
    {
    name: 'Discord-like Chat Application',
    description: 'Development and planning is still in progress. This is a full-stack real-time chat application featuring user authentication, server/channel management, voice channels, direct messaging, file sharing, and role-based permissions. Built with modern technologies for scalability and performance.',
    tech: ['Java', 'Electron', 'Spring Boot', 'Spring Security', 'Spring WebSocket', 'MongoDB', 'React', 'TypeScript', 'Socket.io', 'Redis', 'Docker', 'AWS S3', 'JWT', 'Maven', 'Node.js'],
    featured: true
  }
  ];


  return (
    <section className="projects-section">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-timeline">
          {projects.map((project, index) => (
            <div key={index} className={`project-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="project-content">
                <div className="project-header">
                  <div className="project-title-wrapper">
                    <h3>{project.name}</h3>
                    {project.featured && <span className="featured-badge">⭐ Featured</span>}
                  </div>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                      🔗 View Code
                    </a>
                  )}
                </div>
                
                <p className="project-description" dangerouslySetInnerHTML={{ __html: project.description }}></p>
                
                {project.trailer && (
                  <div className="project-trailer">
                    <video controls width="100%" className="trailer-video">
                      <source src={project.trailer} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                <div className="project-tech">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
              </div>
              <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;