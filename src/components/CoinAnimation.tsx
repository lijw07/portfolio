import React, { useState, useEffect } from 'react';

const CoinAnimation: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame % totalFrames) + 1);
    }, 100); // Change frame every 100ms for smooth rotation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coin-animation">
      <img
        src={`${process.env.PUBLIC_URL}/assets/sprites/coin_${currentFrame}.png`}
        alt="Rotating coin"
        className="coin-sprite"
      />
    </div>
  );
};

export default React.memo(CoinAnimation);