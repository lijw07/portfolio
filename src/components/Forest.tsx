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

  
  const generateTrees = () => {
    const treeData = [];
    
    const screenWidth = window.innerWidth;
    let numTrees = 100;
    
    if (screenWidth <= 480) {
      numTrees = 20;
    } else if (screenWidth <= 968) {
      numTrees = 40;
    }
    
    
    for (let i = 0; i < numTrees; i++) {
      const randomTree = trees[Math.floor(Math.random() * trees.length)];
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 20 - 5;
      const randomScale = 0.8 + Math.random() * 0.4;
      
      treeData.push({
        id: i,
        tree: randomTree,
        x: randomX,
        y: randomY,
        scale: randomScale,
        animationDelay: Math.random() * 2
      });
    }
    
    
    treeData.sort((a, b) => b.y - a.y);
    
    
    return treeData.map((tree, index) => (
      <img
        key={tree.id}
        src={`${process.env.PUBLIC_URL}/assets/sprites/trees/${tree.tree}`}
        alt="tree"
        className="forest-tree"
        style={{
          left: `${tree.x}%`,
          bottom: `${tree.y}vh`,
          '--tree-scale': `scale(${tree.scale})`,
          zIndex: index,
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