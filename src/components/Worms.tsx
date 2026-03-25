import React, { useState, useEffect, useRef, useCallback } from 'react';

interface WormItem {
  id: number;
  type: number;
  position: number;
  speed: number;
  fromLeft: boolean;
}

const Worms: React.FC = () => {
  const [worms, setWorms] = useState<WormItem[]>([]);
  const nextIdRef = useRef(0);

  const removeWorm = useCallback((id: number) => {
    setWorms(prev => prev.filter(w => w.id !== id));
  }, []);

  useEffect(() => {
    const createWorm = (): WormItem => {
      const worm: WormItem = {
        id: nextIdRef.current,
        type: Math.floor(Math.random() * 4) + 1,
        position: Math.random() * 30,
        speed: 12 + Math.random() * 10,
        fromLeft: Math.random() < 0.5
      };
      nextIdRef.current += 1;
      return worm;
    };

    const initialWorms: WormItem[] = [];
    for (let i = 0; i < 2; i++) {
      initialWorms.push(createWorm());
    }
    setWorms(initialWorms);

    const spawnInterval = setInterval(() => {
      setWorms(prev => [...prev, createWorm()]);
    }, 8000);

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
          alt=""
          className={`worm ${worm.fromLeft ? 'from-left' : 'from-right'}`}
          style={{
            top: `${worm.position}px`,
            animationDuration: `${worm.speed}s`
          }}
          onAnimationEnd={() => removeWorm(worm.id)}
        />
      ))}
    </div>
  );
};

export default React.memo(Worms);
