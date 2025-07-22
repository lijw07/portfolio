import React, { useRef, useState, useEffect } from 'react';
import './UnityGame.css';

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any,
      onProgress?: (progress: number) => void
    ) => Promise<any>;
  }
}

interface UnityGameProps {
  onQuitGame: () => void;
}

const UnityGame: React.FC<UnityGameProps> = ({ onQuitGame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Start loading the game immediately when component mounts
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // Separate cleanup effect for unityInstance
  useEffect(() => {
    return () => {
      if (unityInstance) {
        try {
          unityInstance.Quit();
        } catch (error) {
          console.log('Unity instance cleanup:', error);
        }
      }
      // Clear timeout if component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [unityInstance]);

  const loadGame = async () => {
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
            setError(null); // Clear any errors on successful load
            // Clear timeout on successful load
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            
            // Calculate minimum loading time (3 seconds total)
            const minLoadTime = 3000;
            const elapsedTime = Date.now() - loadStartTimeRef.current;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);
            
            // Add extra delay to ensure Unity fully renders
            setTimeout(() => {
              setLoading(false);
            }, remainingTime + 2000); // Additional 2 seconds after minimum time
          }).catch((message) => {
            console.error('Unity instance creation failed:', message);
            setError(`Unity failed to load: ${message}`);
            setLoading(false);
            // Clear timeout on error
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
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

    // Timeout after 15 seconds
    timeoutRef.current = setTimeout(() => {
      setError('Unity game loading timed out');
      setLoading(false);
      timeoutRef.current = null;
    }, 15000);
  };

  return (
    <section className="game-section">
      <div className="game-fullview">
        {!loading && (
          <button 
            className="quit-game-button"
            onClick={onQuitGame}
            title="Quit game and view portfolio"
          >
            <span className="quit-icon">✕</span>
            <span className="quit-text">View Portfolio</span>
          </button>
        )}
        <div className="game-container-full">
          <div id="unity-container" className="unity-desktop" style={{ visibility: loading ? 'hidden' : 'visible' }}>
            <canvas
              ref={canvasRef}
              id="unity-canvas"
              className="unity-canvas"
              width="1200"
              height="675"
              tabIndex={0}
            />
            <div id="unity-loading-bar" style={{ display: 'none' }}>
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
            <div className="game-preloader">
              <div className="preloader-content">
                <div className="preloader-logo">
                  <h1>Jai Li</h1>
                  <p>Interactive Portfolio</p>
                </div>
                <div className="loading-animation">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <div className="loading-text">
                  {progress < 1 ? 'Loading game assets...' : 'Preparing your experience...'}
                </div>
              </div>
            </div>
          )}
          
          {error && !unityInstance && (
            <div className="game-error">
              <div className="error-content">
                <div className="game-icon">⚠️</div>
                <h3>Game Unavailable</h3>
                <p>The interactive experience couldn't load</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UnityGame;