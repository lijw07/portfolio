import React, { useEffect, useRef, useState } from 'react';
import './UnityGame.css';

interface UnityGameProps {
  onSkip?: () => void;
}

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any,
      onProgress?: (progress: number) => void
    ) => Promise<any>;
  }
}

const UnityGame: React.FC<UnityGameProps> = ({ onSkip }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [unityInstance, setUnityInstance] = useState<any>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = async () => {
    if (gameStarted) return;
    
    setGameStarted(true);
    setLoading(true);
    
    try {
      const script = document.createElement('script');
      script.src = process.env.PUBLIC_URL + '/unity-build/InteractivePortfolio.loader.js';
      
      script.onerror = () => {
        setError('Unity loader script failed to load');
        setLoading(false);
      };
      
      script.onload = () => {
        if (canvasRef.current && window.createUnityInstance) {
          const config = {
            arguments: [],
            dataUrl: process.env.PUBLIC_URL + '/unity-build/InteractivePortfolio.data',
            frameworkUrl: process.env.PUBLIC_URL + '/unity-build/InteractivePortfolio.framework.js',
            codeUrl: process.env.PUBLIC_URL + '/unity-build/InteractivePortfolio.wasm',
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'DefaultCompany',
            productName: 'InteractivePortfolio',
            productVersion: '1.0',
            showBanner: (msg: string, type: string) => {
              console.log(`Unity ${type}: ${msg}`);
            },
          };

          window.createUnityInstance(canvasRef.current, config, (progress) => {
            setProgress(progress);
          }).then((instance) => {
            setUnityInstance(instance);
            setLoading(false);
          }).catch((message) => {
            console.error('Unity instance creation failed:', message);
            setError(`Unity failed to load: ${message}`);
            setLoading(false);
          });
        } else {
          setError('Unity createUnityInstance not available');
          setLoading(false);
        }
      };
      
      document.body.appendChild(script);
    } catch (err) {
      console.error('Unity loading error:', err);
      setError('Failed to load Unity game');
      setLoading(false);
    }

    const timer = setTimeout(() => {
      if (loading) {
        setError('Unity game loading timed out');
        setLoading(false);
      }
    }, 15000);

    setTimeout(() => clearTimeout(timer), 15000);
  };


  if (!isLargeScreen) {
    return null;
  }

  return (
    <section className="game-section">
      {!gameStarted ? (
        <div className="container">
          <div className="game-intro">
            <div className="game-description">
              <h2>Interactive Portfolio Experience</h2>
              <p>
                Explore my portfolio through an interactive 2D game! Navigate through different 
                sections, discover my projects, and learn about my skills in a fun, engaging way.
              </p>
              <div className="game-features">
                <div className="feature">🎮 Interactive Navigation</div>
                <div className="feature">🚀 Project Showcases</div>
                <div className="feature">💡 Skill Demonstrations</div>
              </div>
              <button className="start-game-button" onClick={startGame}>
                Start Interactive Experience
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-fullview">
          <div className="game-layout">
            <div className="game-instructions">
              <div className="instructions-content">
                <h3>Game Controls</h3>
                <div className="instruction-group">
                  <h4>🎮 Movement</h4>
                  <ul>
                    <li><strong>WASD Keys</strong> - Move your character</li>
                    <li><strong>Arrow Keys</strong> - Alternative movement</li>
                    <li><strong>Shift Key</strong> - Hold to sprint/run faster</li>
                  </ul>
                </div>
                <div className="instruction-group">
                  <h4>🔍 Interaction</h4>
                  <ul>
                    <li><strong>F Key</strong> - Interact with objects and NPCs</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="game-container-full">
              <div id="unity-container" className="unity-desktop">
                <canvas
                  ref={canvasRef}
                  id="unity-canvas"
                  className="unity-canvas"
                  width="1200"
                  height="675"
                  tabIndex={0}
                />
                <div id="unity-loading-bar" style={{ display: loading ? 'block' : 'none' }}>
                  <div id="unity-logo"></div>
                  <div id="unity-progress-bar-empty">
                    <div id="unity-progress-bar-full" style={{ width: `${progress * 100}%` }}></div>
                  </div>
                </div>
                <div id="unity-warning"></div>
                <div id="unity-footer">
                  <div id="unity-logo-title-footer"></div>
                  <div id="unity-fullscreen-button"></div>
                  <div id="unity-build-title">InteractivePortfolio</div>
                </div>
              </div>
              
              {loading && (
                <div className="game-loading">
                  <div className="loading-text">Loading Interactive Experience...</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="game-error">
                  <div className="error-content">
                    <div className="game-icon">⚠️</div>
                    <h3>Game Unavailable</h3>
                    <p>The interactive experience couldn't load</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="game-objectives">
              <div className="objectives-content">
                <h3>Quest Guide</h3>
                <div className="instruction-group">
                  <h4>📍 Main Journey</h4>
                  <ul>
                    <li><strong>Take the train</strong> to the Hall of Portfolio</li>
                    <li><strong>Visit the Education Wing</strong> to learn about my academic background</li>
                    <li><strong>Explore the Project Gallery</strong> to see my featured work</li>
                    <li><strong>Check the Skills Laboratory</strong> for technical demonstrations</li>
                  </ul>
                </div>
                <div className="instruction-group">
                  <h4>🎯 Interactive Tasks</h4>
                  <ul>
                    <li>Examine project displays for detailed information</li>
                    <li>Collect achievement badges in each section</li>
                    <li>Find hidden Easter eggs throughout the portfolio</li>
                    <li>Complete the portfolio tour for a special reward</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UnityGame;