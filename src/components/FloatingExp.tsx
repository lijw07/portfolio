import React, { useState, useEffect, useRef, useMemo } from 'react';

interface FloatingExpItem {
  id: number;
  value: number;
  x: number;
  y: number;
  sprite: string;
}

const FloatingExp: React.FC = () => {
  const [expItems, setExpItems] = useState<FloatingExpItem[]>([]);
  const nextIdRef = useRef(0);

  // All available sprites
  const sprites = useMemo(() => [
    'row-1-column-1.png', 'row-1-column-3.png',
    'row-2-column-1.png', 'row-2-column-3.png',
    'row-3-column-1.png', 'row-3-column-3.png',
    'row-4-column-1.png', 'row-4-column-3.png',
    'row-5-column-1.png', 'row-5-column-3.png',
    'row-6-column-1.png', 'row-6-column-3.png',
    'row-7-column-1.png', 'row-7-column-3.png',
    'row-8-column-1.png', 'row-8-column-3.png',
    'row-9-column-1.png'
  ], []);

  useEffect(() => {
    // Spawn new exp items periodically
    const spawnInterval = setInterval(() => {
      const newItem: FloatingExpItem = {
        id: nextIdRef.current,
        value: Math.floor(Math.random() * 300) + 1, // Random value between 1-300
        x: Math.random() * 60 - 30, // Random x offset between -30 and 30
        y: 0,
        sprite: sprites[Math.floor(Math.random() * sprites.length)]
      };

      setExpItems(prev => [...prev, newItem]);
      nextIdRef.current += 1;

      // Remove the item after animation completes (2 seconds)
      setTimeout(() => {
        setExpItems(prev => prev.filter(item => item.id !== newItem.id));
      }, 2000);
    }, 800); // Spawn every 800ms

    return () => clearInterval(spawnInterval);
  }, [sprites]);

  return (
    <div className="floating-exp-container">
      {expItems.map(item => (
        <div
          key={item.id}
          className="floating-exp-item"
          style={{
            left: `${50 + item.x}px`,
            bottom: '0px'
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/sprites/exp/${item.sprite}`}
            alt="exp"
            className="exp-sprite"
          />
          <span className="exp-value">+{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(FloatingExp);