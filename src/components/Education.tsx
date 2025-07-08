import React, { forwardRef } from 'react';
import './Education.css';

const Education = forwardRef<HTMLDivElement>((props, ref) => {
  const education = [
    {
      degree: 'M.S. Computer Science',
      specialization: 'Specialization: Computer Graphics',
      school: 'Georgia Institute of Technology',
      location: 'Atlanta, GA',
      period: 'Jan 2025 – Expected 2027',
      gpa: '4.0',
      status: 'In Progress',
      icon: process.env.PUBLIC_URL + '/GtIcon.png'
    },
    {
      degree: 'B.S. Computer Science',
      specialization: 'College of Engineering',
      school: 'Virginia Commonwealth University',
      location: 'Richmond, VA',
      period: 'Jan 2020 – May 2022',
      gpa: null,
      status: 'Completed',
      icon: process.env.PUBLIC_URL + '/VCU.png'
    },
    {
      degree: 'A.S. Computer Science',
      specialization: null,
      school: 'Northern Virginia Community College',
      location: 'Annandale, VA',
      period: 'Aug 2018 – Dec 2019',
      gpa: null,
      status: 'Completed',
      icon: process.env.PUBLIC_URL + '/NOVA.jpg'
    }
  ];

  return (
    <section className="education-section" ref={ref}>
      <div className="container">
        <h2>Education</h2>
        <div className="education-grid">
          {education.map((edu, index) => (
            <div key={index} className="education-card">
              <div className="education-icon">
                <img src={edu.icon} alt={`${edu.school} logo`} />
              </div>
              <div className="education-content">
                <div className="education-header">
                  <h3>{edu.degree}</h3>
                  {edu.specialization && (
                    <p className="specialization">{edu.specialization}</p>
                  )}
                </div>
                <div className="education-school">
                  <h4>{edu.school}</h4>
                  <p className="location">{edu.location}</p>
                </div>
                <div className="education-meta">
                  <span className="period">{edu.period}</span>
                  {edu.gpa && (
                    <span className="gpa">GPA: {edu.gpa}</span>
                  )}
                </div>
                <div className={`status ${edu.status.toLowerCase().replace(' ', '-')}`}>
                  {edu.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Education.displayName = 'Education';

export default Education;