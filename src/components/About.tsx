import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <h2>About Me</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a Software Engineer with a strong foundation in Java, microservices, 
              and cloud technologies. Currently pursuing my M.S. in Computer Science with a 
              specialization in Computer Graphics at Georgia Tech.
            </p>
            <p>
              My journey spans from developing RESTful APIs, Springboot and ASP.NET applications, develop various docker 
              containers that are capable of multi-tenant support with hot reload. I love creating functional interactive 
              games, web based and desktop applications. I'm passionate about building 
              scalable systems and exploring the intersection of technology and creativity.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <img src="/me.png" alt="Jai Li" className="profile-picture" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;