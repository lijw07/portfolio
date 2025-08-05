import React, { useState, useEffect } from 'react';

interface WormItem {
  id: number;
  type: number; // 1-4 for different worm types
  position: number; // Y position
  speed: number;
  fromLeft: boolean;
}

const Worms: React.FC = () => {
  const [worms, setWorms] = useState<WormItem[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Initial worms
    const initialWorms: WormItem[] = [];
    for (let i = 0; i < 2; i++) {
      initialWorms.push({
        id: i,
        type: Math.floor(Math.random() * 4) + 1,
        position: Math.random() * 30, // Random Y position 0-30px
        speed: 25 + Math.random() * 15, // 25-40s duration
        fromLeft: Math.random() < 0.5
      });
    }
    setWorms(initialWorms);
    setNextId(2);

    // Spawn new worms periodically
    const spawnInterval = setInterval(() => {
      const newWorm: WormItem = {
        id: nextId,
        type: Math.floor(Math.random() * 4) + 1,
        position: Math.random() * 30,
        speed: 25 + Math.random() * 15,
        fromLeft: Math.random() < 0.5
      };
      
      setWorms(prev => [...prev, newWorm]);
      setNextId(prev => prev + 1);
    }, 8000); // Spawn new worm every 8 seconds

    return () => {
      clearInterval(spawnInterval);
    };
  }, []);

  return (
    <div className="worms-container">
      {worms.map(worm => (
        <img
          key={worm.id}
          src={`${process.env.PUBLIC_URL}/assets/sprites/worms/Worm_${worm.type}_${worm.fromLeft ? 'right' : 'left'}_16x16.gif`}
          alt="worm"
          className={`worm ${worm.fromLeft ? 'from-left' : 'from-right'}`}
          style={{
            top: `${worm.position}px`,
            animationDuration: `${worm.speed}s`
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(Worms);