import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as PIXI from 'pixi.js';

const SpriteAnimation: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(false);
  const spriteTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const spriteConfigs = useMemo<Record<string, { cellSize: number; idleEndRow: number; yOffset: number }>>(() => ({
    'Spearman.png': { cellSize: 48, idleEndRow: 6, yOffset: 75 },
    'Swordman.png': { cellSize: 48, idleEndRow: 6, yOffset: 75 },
    'Archer.png': { cellSize: 48, idleEndRow: 6, yOffset: 75 },
    'Templar.png': { cellSize: 48, idleEndRow: 6, yOffset: 75 },
    'Goblin_Maceman.png': { cellSize: 32, idleEndRow: 4, yOffset: 83 },
    'Goblin_Archer.png': { cellSize: 48, idleEndRow: 4, yOffset: 75 },
    'Goblin_Spearman.png': { cellSize: 48, idleEndRow: 4, yOffset: 75 },
    'Goblin_Thief.png': { cellSize: 32, idleEndRow: 4, yOffset: 83 },
    'Orc_Chief.png': { cellSize: 32, idleEndRow: 6, yOffset: 83 },
    'Orc_Archer.png': { cellSize: 48, idleEndRow: 6, yOffset: 75 },
    'Orc_Grunt.png': { cellSize: 32, idleEndRow: 6, yOffset: 83 },
    'Orc_Peon.png': { cellSize: 32, idleEndRow: 6, yOffset: 83 },
    'Angel_1.png': { cellSize: 64, idleEndRow: 6, yOffset: 67 },
    'Angel_2.png': { cellSize: 64, idleEndRow: 6, yOffset: 67 }
  }), []);

  const initializeAnimation = useCallback(() => {
    if (!pixiContainer.current || !mountedRef.current) return;

    spriteTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    spriteTimeoutsRef.current = [];

    if (appRef.current) {
      appRef.current.destroy(true, { children: true, texture: true });
      appRef.current = null;
    }

    while (pixiContainer.current.firstChild) {
      pixiContainer.current.removeChild(pixiContainer.current.firstChild);
    }

    const screenWidth = window.innerWidth;
    let canvasHeight = 150;
    let spriteScale = 2;
    let spriteSpacing = 60;
    let maxSprites = 14;

    if (screenWidth >= 1920) {
      canvasHeight = 180;
      spriteScale = 2.5;
      spriteSpacing = 70;
      maxSprites = 14;
    } else if (screenWidth >= 1280) {
      canvasHeight = 150;
      spriteScale = 2;
      spriteSpacing = 50;
      maxSprites = 10;
    } else if (screenWidth >= 768) {
      canvasHeight = 120;
      spriteScale = 1.5;
      spriteSpacing = 40;
      maxSprites = 8;
    } else {
      canvasHeight = 100;
      spriteScale = 1;
      spriteSpacing = 30;
      maxSprites = 5;
    }

    const app = new PIXI.Application();
    
    app.init({
      width: window.innerWidth,
      height: canvasHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }).then(() => {
      if (!mountedRef.current || !pixiContainer.current) return;
      
      appRef.current = app;
      pixiContainer.current.appendChild(app.canvas);

      const createSprite = async (spriteName: string, delay: number = 0, position: number = 0) => {
        const spriteSheetPath = `${process.env.PUBLIC_URL}/assets/sprites/${spriteName}`;
        
        await PIXI.Assets.load(spriteSheetPath);
        const texture = PIXI.Texture.from(spriteSheetPath);
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        const config = spriteConfigs[spriteName];
        const CELL_WIDTH = config.cellSize;
        const CELL_HEIGHT = config.cellSize;
        
        const walkFrames: PIXI.Texture[] = [];
        for (let row = 0; row < 6; row++) {
          const x = row * CELL_WIDTH;
          const y = 4 * CELL_HEIGHT;
          const frame = new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(x, y, CELL_WIDTH, CELL_HEIGHT)
          });
          walkFrames.push(frame);
        }

        const idleFrames: PIXI.Texture[] = [];
        const idleEndRow = config.idleEndRow;
        
        for (let row = 0; row < idleEndRow; row++) {
          const x = row * CELL_WIDTH;
          const y = 0;
          const frame = new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(x, y, CELL_WIDTH, CELL_HEIGHT)
          });
          idleFrames.push(frame);
        }

        const sprite = new PIXI.AnimatedSprite(walkFrames);
        sprite.anchor.set(0.5, 0.5);
        sprite.animationSpeed = 0.15;
        sprite.loop = true;
        sprite.play();

        sprite.y = config.yOffset * (spriteScale / 2);
        
        const centerX = app.screen.width / 2;
        const fromLeft = Math.random() < 0.5;
        const offset = position * spriteSpacing;
        
        if (fromLeft) {
          sprite.x = -50 - delay;
          sprite.scale.set(spriteScale);
        } else {
          sprite.x = app.screen.width + 50 + delay;
          sprite.scale.set(-spriteScale, spriteScale);
        }

        const timeoutId = setTimeout(() => {
          if (!mountedRef.current || !app.stage) return;
          
          app.stage.addChild(sprite);

          const speed = fromLeft ? 2 : -2;
          let isMoving = true;

          app.ticker.add(() => {
            if (isMoving) {
              sprite.x += speed;
              
              const targetX = centerX + (fromLeft ? -offset : offset);
              if ((fromLeft && sprite.x >= targetX) || (!fromLeft && sprite.x <= targetX)) {
                sprite.x = targetX;
                isMoving = false;
                sprite.textures = idleFrames;
                sprite.animationSpeed = 0.1;
                sprite.play();
              }
            }
          });
        }, delay);
        
        spriteTimeoutsRef.current.push(timeoutId);
      };

      const loadSprites = async () => {
        const allSprites = [
          'Spearman.png',
          'Goblin_Maceman.png', 
          'Orc_Chief.png',
          'Archer.png',
          'Swordman.png',
          'Templar.png',
          'Goblin_Archer.png',
          'Goblin_Spearman.png',
          'Goblin_Thief.png',
          'Orc_Archer.png',
          'Orc_Grunt.png',
          'Orc_Peon.png',
          'Angel_1.png',
          'Angel_2.png'
        ];
        
        const shuffledSprites = [...allSprites].sort(() => Math.random() - 0.5);
        const selectedSprites = shuffledSprites.slice(0, maxSprites);
        
        let totalDelay = 0;
        for (let i = 0; i < selectedSprites.length; i++) {
          const randomDelay = Math.random() * 750;
          totalDelay += randomDelay;
          await createSprite(selectedSprites[i], totalDelay, i);
        }
      };

      loadSprites();
    });

    let lastInnerWidth = window.innerWidth;
    
    const handleResize = () => {
      if (appRef.current) {
        const newWidth = window.innerWidth;
        
        if (Math.abs(newWidth - lastInnerWidth) < 10) {
          return;
        }
        
        lastInnerWidth = newWidth;
        
        let newHeight = 150;
        
        if (newWidth >= 1920) {
          newHeight = 180;
        } else if (newWidth >= 1280) {
          newHeight = 150;
        } else if (newWidth >= 768) {
          newHeight = 120;
        } else {
          newHeight = 100;
        }
        
        appRef.current.renderer.resize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      if (pixiContainer.current) {
        while (pixiContainer.current.firstChild) {
          pixiContainer.current.removeChild(pixiContainer.current.firstChild);
        }
      }
    };
  }, [spriteConfigs]);

  useEffect(() => {
    const pixiContainerEl = pixiContainer.current;
    mountedRef.current = true;
    
    if (pixiContainerEl) {
      pixiContainerEl.innerHTML = '';
    }
    
    const initTimeout = setTimeout(() => {
      initializeAnimation();
    }, 0);

    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      
      if (Math.abs(currentWidth - lastWidth) < 10) {
        return;
      }
      
      lastWidth = currentWidth;
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        initializeAnimation();
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      
      clearTimeout(initTimeout);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      spriteTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      spriteTimeoutsRef.current = [];
      
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      if (pixiContainerEl) {
        pixiContainerEl.innerHTML = '';
      }
    };
  }, [initializeAnimation]);

  return <div ref={pixiContainer} style={{ width: '100%', height: '150px', display: 'block' }} />;
};

export default SpriteAnimation;