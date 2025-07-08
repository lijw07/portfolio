import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'Contact via email',
      link: 'mailto:tommyli874@gmail.com',
      description: 'Send me an email for business inquiries'
    },
    {
      icon: '/linkedin-icon.webp',
      title: 'LinkedIn',
      value: 'Connect on LinkedIn',
      link: 'https://www.linkedin.com/in/jai-li-va/',
      description: 'Connect with me professionally'
    },
    {
      icon: '/github-icon.png',
      title: 'GitHub',
      value: 'github.com/lijw07',
      link: 'https://github.com/lijw07',
      description: 'Check out my code repositories'
    }
  ];

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2>Let's Connect</h2>
          <p className="contact-subtitle">
            I'm always interested in new opportunities and collaborations. 
            Feel free to reach out if you'd like to work together!
          </p>
        </div>
        
        <div className="contact-grid">
          {contactMethods.map((method, index) => (
            <a 
              key={index} 
              href={method.link}
              className="contact-card"
              target={method.link.startsWith('http') ? '_blank' : '_self'}
              rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <div className="contact-icon">
                {method.icon.startsWith('/') ? (
                  <img src={method.icon} alt={`${method.title} icon`} />
                ) : (
                  method.icon
                )}
              </div>
              <div className="contact-info">
                <h3>{method.title}</h3>
                <p className="contact-description">{method.description}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Contact;