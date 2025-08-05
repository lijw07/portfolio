import React from 'react';

const Forest: React.FC = () => {
  const trees = [
    'row-1-column-2.png',
    'row-1-column-2-2.png',
    'row-1-column-2-3.png',
    'row-1-column-2-4.png',
    'row-1-column-2-5.png',
    'row-1-column-2-6.png'
  ];

  // Generate random forest layout
  const generateTrees = () => {
    const treeData = [];
    const numTrees = 100; // Number of trees to place
    
    // First generate tree data
    for (let i = 0; i < numTrees; i++) {
      const randomTree = trees[Math.floor(Math.random() * trees.length)];
      const randomX = Math.random() * 100; // Random position 0-100%
      const randomY = Math.random() * 150; // Random Y position 0-150px from bottom
      const randomScale = 0.8 + Math.random() * 0.4; // Random scale 0.8-1.2
      
      treeData.push({
        id: i,
        tree: randomTree,
        x: randomX,
        y: randomY,
        scale: randomScale,
        animationDelay: Math.random() * 2
      });
    }
    
    // Sort trees by Y position (higher Y = further from bottom = should be behind)
    treeData.sort((a, b) => b.y - a.y);
    
    // Generate tree elements with proper z-index based on sort order
    return treeData.map((tree, index) => (
      <img
        key={tree.id}
        src={`${process.env.PUBLIC_URL}/assets/sprites/trees/${tree.tree}`}
        alt="tree"
        className="forest-tree"
        style={{
          left: `${tree.x}%`,
          bottom: `${tree.y}px`,
          '--tree-scale': `scale(${tree.scale})`,
          zIndex: index, // Trees closer to bottom get higher z-index
          animationDelay: `${tree.animationDelay}s`
        } as React.CSSProperties}
      />
    ));
  };

  return (
    <div className="forest-container">
      {generateTrees()}
    </div>
  );
};

export default React.memo(Forest);