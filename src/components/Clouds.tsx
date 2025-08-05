import React, { useState, useEffect } from 'react';

interface CloudItem {
  id: number;
  sprite: string;
  yPosition: number;
  scale: number;
  duration: number;
  fromLeft: boolean;
}

const Clouds: React.FC = () => {
  const [clouds, setClouds] = useState<CloudItem[]>([]);
  const [nextId, setNextId] = useState(0);
  
  const cloudSprites = [
    'row-1-column-1.png',
    'row-1-column-2.png',
    'row-2-column-1.png',
    'row-2-column-2.png'
  ];

  useEffect(() => {
    // Initial clouds
    const initialClouds: CloudItem[] = [];
    for (let i = 0; i < 5; i++) {
      initialClouds.push({
        id: i,
        sprite: cloudSprites[Math.floor(Math.random() * cloudSprites.length)],
        yPosition: Math.random() * 200,
        scale: 0.5 + Math.random() * 1,
        duration: 30 + Math.random() * 20,
        fromLeft: Math.random() < 0.5
      });
      setNextId(5);
    }
    setClouds(initialClouds);

    // Spawn new clouds periodically
    const spawnInterval = setInterval(() => {
      const newCloud: CloudItem = {
        id: nextId,
        sprite: cloudSprites[Math.floor(Math.random() * cloudSprites.length)],
        yPosition: Math.random() * 200,
        scale: 0.5 + Math.random() * 1,
        duration: 30 + Math.random() * 20,
        fromLeft: Math.random() < 0.5
      };
      
      setClouds(prev => [...prev, newCloud]);
      setNextId(prev => prev + 1);
      
      // Remove cloud after animation completes
      setTimeout(() => {
        setClouds(prev => prev.filter(cloud => cloud.id !== newCloud.id));
      }, newCloud.duration * 1000);
    }, 4000); // Spawn new cloud every 4 seconds

    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <div className="clouds-container">
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className={`cloud ${cloud.fromLeft ? 'from-left' : 'from-right'}`}
          style={{
            top: `${cloud.yPosition}px`,
            animationDuration: `${cloud.duration}s`,
            transform: `scale(${cloud.scale})`
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/sprites/cloud/${cloud.sprite}`}
            alt="cloud"
            className="cloud-sprite"
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(Clouds);