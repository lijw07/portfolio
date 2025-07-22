import React from 'react';
import './StaticGameShowcase.css';

const StaticGameShowcase: React.FC = () => {
  return (
    <section className="static-game-showcase">
      <div className="container">
        <div className="showcase-content">
          <div className="showcase-header">
            <h2>Interactive Portfolio Experience</h2>
            <p className="device-notice">
              🖥️ The interactive game experience is available on desktop devices
            </p>
          </div>
          
          <div className="showcase-preview">
            <div className="preview-content">
              <div className="preview-description">
                <h3>About the Interactive Experience</h3>
                <p>
                  On desktop, you can explore my portfolio through an interactive 2D game! 
                  Navigate through different sections, discover my projects, and learn about 
                  my skills in a fun, engaging way.
                </p>
                
                <div className="game-features">
                  <div className="feature">
                    <span className="feature-icon">🎮</span>
                    <span className="feature-text">Interactive Navigation</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🚀</span>
                    <span className="feature-text">Project Showcases</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">💡</span>
                    <span className="feature-text">Skill Demonstrations</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🏆</span>
                    <span className="feature-text">Achievement System</span>
                  </div>
                </div>
                
                <div className="desktop-prompt">
                  <p>Visit on a desktop computer to play the interactive portfolio game!</p>
                </div>
              </div>
              
              <div className="preview-image">
                <img 
                  src={process.env.PUBLIC_URL + '/game-preview.png'} 
                  alt="Interactive Portfolio Game Preview"
                  className="game-preview-img"
                  onError={(e) => {
                    // Fallback to a placeholder if image doesn't exist
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('no-image');
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">🎮</span>
                  <span className="placeholder-text">Game Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticGameShowcase;