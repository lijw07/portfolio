import React from 'react';
import './UnityGame.css';

interface UnityGameFallbackProps {
  onSkip?: () => void;
}

const UnityGameFallback: React.FC<UnityGameFallbackProps> = ({ onSkip }) => {
  return (
    <div className="unity-game-container">
      <div className="unity-header">
        <h1>Interactive Portfolio</h1>
        <button className="skip-button" onClick={onSkip}>
          View Portfolio
        </button>
      </div>
      
      <div className="unity-wrapper">
        <div className="unity-placeholder">
          <div className="placeholder-content">
            <div className="game-icon">🎮</div>
            <h2>Interactive Portfolio Game</h2>
            <p>Unity WebGL game will load here</p>
            <p>For now, click below to explore the portfolio</p>
            <button className="explore-button" onClick={onSkip}>
              Explore Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnityGameFallback;