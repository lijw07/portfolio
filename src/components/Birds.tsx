import React, { useState, useEffect, useRef } from 'react';

interface BirdItem {
  id: number;
  yPosition: number;
  speed: number;
  fromLeft: boolean;
}

const Birds: React.FC = () => {
  const [birds, setBirds] = useState<BirdItem[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    // Initial birds
    const initialBirds: BirdItem[] = [];
    for (let i = 0; i < 3; i++) {
      initialBirds.push({
        id: i,
        yPosition: Math.random() * 8 + 1, // Between 1-9vh from top
        speed: 20 + Math.random() * 20, // 20-40s duration
        fromLeft: Math.random() < 0.5
      });
    }
    setBirds(initialBirds);
    nextIdRef.current = 3;

    // Spawn new birds periodically
    const spawnInterval = setInterval(() => {
      const newBird: BirdItem = {
        id: nextIdRef.current,
        yPosition: Math.random() * 8 + 1, // Between 1-9vh from top
        speed: 20 + Math.random() * 20,
        fromLeft: Math.random() < 0.5
      };
      
      setBirds(prev => [...prev, newBird]);
      nextIdRef.current += 1;
    }, 6000); // Spawn new bird every 6 seconds
    
    // Clean up old birds periodically (birds that have been on screen for more than 45 seconds)
    const cleanupInterval = setInterval(() => {
      setBirds(prev => prev.filter(bird => bird.id > nextIdRef.current - 10)); // Keep only last 10 birds
    }, 30000); // Clean up every 30 seconds

    return () => {
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="birds-container">
      {birds.map(bird => (
        <img
          key={bird.id}
          src={`${process.env.PUBLIC_URL}/assets/sprites/birds/${
            bird.fromLeft ? 'Crow_Flap_Right_16x16.gif' : 'Crow_Flap_Left_16x16.gif'
          }`}
          alt="bird"
          className={`bird ${bird.fromLeft ? 'from-left' : 'from-right'}`}
          style={{
            top: `${bird.yPosition}vh`,
            animationDuration: `${bird.speed}s`
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(Birds);