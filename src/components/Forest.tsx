import React, { useMemo, useState, useCallback, useRef } from 'react';

const TREE_SPRITES = [
  'row-1-column-2.png',
  'row-1-column-2-2.png',
  'row-1-column-2-3.png',
  'row-1-column-2-4.png',
  'row-1-column-2-5.png',
  'row-1-column-2-6.png'
];

const MIN_X_PERCENT = 2;
const MAX_X_PERCENT = 92;
const MAX_Y_PERCENT = 20;
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.2;
const MAX_SWAY_DELAY = 2;

const getTreeCount = (screenWidth: number): number => {
  if (screenWidth <= 480) return 12;
  if (screenWidth <= 968) return 25;
  return 45;
};

const JITTER = 0.8;

const Forest: React.FC = () => {
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCountRef = useRef(0);

  const treeData = useMemo(() => {
    const numTrees = getTreeCount(window.innerWidth);
    const xRange = MAX_X_PERCENT - MIN_X_PERCENT;
    const columnWidth = xRange / numTrees;

    const data = Array.from({ length: numTrees }, (_, i) => {
      const baseX = MIN_X_PERCENT + i * columnWidth;
      const jitterOffset = (Math.random() - 0.5) * columnWidth * JITTER;
      const x = Math.max(MIN_X_PERCENT, Math.min(MAX_X_PERCENT, baseX + jitterOffset));

      const y = Math.random() * MAX_Y_PERCENT;
      const depthFactor = y / MAX_Y_PERCENT;
      const scale = MIN_SCALE + depthFactor * (MAX_SCALE - MIN_SCALE);

      return {
        id: i,
        sprite: TREE_SPRITES[Math.floor(Math.random() * TREE_SPRITES.length)],
        x,
        y,
        scale,
        animationDelay: Math.random() * MAX_SWAY_DELAY
      };
    });

    data.sort((a, b) => a.y - b.y);
    return data;
  }, []);

  const totalTrees = treeData.length;

  const handleImageLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= totalTrees) {
      setAllLoaded(true);
    }
  }, [totalTrees]);

  return (
    <div
      className="forest-container"
      style={{ opacity: allLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      {treeData.map((tree, index) => (
        <img
          key={tree.id}
          src={`${process.env.PUBLIC_URL}/assets/sprites/trees/${tree.sprite}`}
          alt=""
          className="forest-tree"
          onLoad={handleImageLoad}
          onError={handleImageLoad}
          style={{
            left: `${tree.x}%`,
            bottom: `${tree.y}%`,
            '--tree-scale': `scale(${tree.scale})`,
            zIndex: index,
            animationDelay: `${tree.animationDelay}s`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default React.memo(Forest);
