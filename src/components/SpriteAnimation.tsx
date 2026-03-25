import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as PIXI from 'pixi.js';

interface SpriteAnimationProps {
  onAllSpritesSettled?: () => void;
}

interface SpriteConfig {
  cellSize: number;
  idleEndRow: number;
}

interface BreakpointConfig {
  canvasHeight: number;
  spriteScale: number;
  maxSprites: number;
}

const SPRITE_CONFIGS: Record<string, SpriteConfig> = {
  'Spearman.png': { cellSize: 48, idleEndRow: 6 },
  'Swordman.png': { cellSize: 48, idleEndRow: 6 },
  'Archer.png': { cellSize: 48, idleEndRow: 6 },
  'Templar.png': { cellSize: 48, idleEndRow: 6 },
  'Goblin_Maceman.png': { cellSize: 32, idleEndRow: 4 },
  'Goblin_Archer.png': { cellSize: 48, idleEndRow: 4 },
  'Goblin_Spearman.png': { cellSize: 48, idleEndRow: 4 },
  'Goblin_Thief.png': { cellSize: 32, idleEndRow: 4 },
  'Orc_Chief.png': { cellSize: 32, idleEndRow: 6 },
  'Orc_Archer.png': { cellSize: 48, idleEndRow: 6 },
  'Orc_Grunt.png': { cellSize: 32, idleEndRow: 6 },
  'Orc_Peon.png': { cellSize: 32, idleEndRow: 6 },
  'Angel_1.png': { cellSize: 64, idleEndRow: 6 },
  'Angel_2.png': { cellSize: 64, idleEndRow: 6 },
};

const ALL_SPRITE_NAMES = Object.keys(SPRITE_CONFIGS);

const WALK_ROW = 4;
const WALK_FRAME_COUNT = 6;
const IDLE_ROW = 0;
const MARCH_SPEED = 4;

const getBreakpointConfig = (screenWidth: number): BreakpointConfig => {
  if (screenWidth >= 1920) return { canvasHeight: 270, spriteScale: 3.75, maxSprites: 14 };
  if (screenWidth >= 1280) return { canvasHeight: 225, spriteScale: 3, maxSprites: 10 };
  if (screenWidth >= 768) return { canvasHeight: 180, spriteScale: 2.25, maxSprites: 8 };
  return { canvasHeight: 150, spriteScale: 1.5, maxSprites: 5 };
};

const SpriteAnimation: React.FC<SpriteAnimationProps> = ({ onAllSpritesSettled }) => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(false);
  const settledSpritesRef = useRef<number>(0);
  const totalSpritesRef = useRef<number>(0);

  const initializeAnimation = useCallback(() => {
    if (!pixiContainer.current || !mountedRef.current) return;

    settledSpritesRef.current = 0;
    totalSpritesRef.current = 0;

    if (appRef.current) {
      appRef.current.destroy(true, { children: true, texture: true });
      appRef.current = null;
    }

    while (pixiContainer.current.firstChild) {
      pixiContainer.current.removeChild(pixiContainer.current.firstChild);
    }

    const screenWidth = window.innerWidth;
    const { canvasHeight, spriteScale, maxSprites } = getBreakpointConfig(screenWidth);

    const app = new PIXI.Application();

    app.init({
      width: screenWidth,
      height: canvasHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }).then(() => {
      if (!mountedRef.current || !pixiContainer.current) return;

      appRef.current = app;
      pixiContainer.current.appendChild(app.canvas);

      const shuffled = [...ALL_SPRITE_NAMES].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, maxSprites);
      totalSpritesRef.current = selected.length;

      const centerX = app.screen.width / 2;
      const spacing = spriteScale * 22;
      const totalWidth = (selected.length - 1) * spacing;
      const startX = centerX - totalWidth / 2;

      const halfCount = Math.ceil(selected.length / 2);

      // Preload all textures up front
      const preloadAll = async () => {
        for (const name of selected) {
          await PIXI.Assets.load(`${process.env.PUBLIC_URL}/assets/sprites/${name}`);
        }
      };

      const createSprite = (spriteName: string, posIndex: number, fromLeft: boolean): Promise<void> => {
        return new Promise((resolve) => {
          const config = SPRITE_CONFIGS[spriteName];
          const spriteSheetPath = `${process.env.PUBLIC_URL}/assets/sprites/${spriteName}`;
          const texture = PIXI.Texture.from(spriteSheetPath);
          texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
          const cellSize = config.cellSize;

          const walkFrames: PIXI.Texture[] = [];
          for (let f = 0; f < WALK_FRAME_COUNT; f++) {
            walkFrames.push(new PIXI.Texture({
              source: texture.source,
              frame: new PIXI.Rectangle(f * cellSize, WALK_ROW * cellSize, cellSize, cellSize),
            }));
          }

          const idleFrames: PIXI.Texture[] = [];
          for (let f = 0; f < config.idleEndRow; f++) {
            idleFrames.push(new PIXI.Texture({
              source: texture.source,
              frame: new PIXI.Rectangle(f * cellSize, IDLE_ROW * cellSize, cellSize, cellSize),
            }));
          }

          const sprite = new PIXI.AnimatedSprite(walkFrames);
          sprite.anchor.set(0.5, 1.0);
          sprite.animationSpeed = 0.15;
          sprite.loop = true;
          sprite.play();

          const targetX = selected.length === 1 ? centerX : startX + posIndex * spacing;
          sprite.y = canvasHeight;

          if (fromLeft) {
            sprite.x = -50;
            sprite.scale.set(spriteScale);
          } else {
            sprite.x = app.screen.width + 50;
            sprite.scale.set(-spriteScale, spriteScale);
          }

          if (!mountedRef.current || !app.stage) { resolve(); return; }
          app.stage.addChild(sprite);

          const speed = fromLeft ? MARCH_SPEED : -MARCH_SPEED;
          let isMoving = true;

          app.ticker.add(() => {
            if (!isMoving) return;
            sprite.x += speed;

            const arrived = fromLeft
              ? sprite.x >= targetX
              : sprite.x <= targetX;

            if (arrived) {
              sprite.x = targetX;
              isMoving = false;
              sprite.textures = idleFrames;
              sprite.animationSpeed = 0.1;
              sprite.play();

              settledSpritesRef.current += 1;
              if (settledSpritesRef.current === totalSpritesRef.current && onAllSpritesSettled) {
                onAllSpritesSettled();
              }
              resolve();
            }
          });
        });
      };

      const spawnAll = async () => {
        await preloadAll();
        if (!mountedRef.current) return;

        // Each sprite gets a fully random delay and a random side
        for (let i = 0; i < selected.length; i++) {
          const fromLeft = Math.random() < 0.5;
          const delay = Math.random() * 1500;

          setTimeout(() => {
            if (!mountedRef.current) return;
            createSprite(selected[i], i, fromLeft);
          }, delay);
        }
      };

      spawnAll();
    });

    let lastInnerWidth = window.innerWidth;

    const handleResize = () => {
      if (!appRef.current) return;
      const newWidth = window.innerWidth;
      if (Math.abs(newWidth - lastInnerWidth) < 10) return;
      lastInnerWidth = newWidth;
      const { canvasHeight: newHeight } = getBreakpointConfig(newWidth);
      appRef.current.renderer.resize(newWidth, newHeight);
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
  }, [onAllSpritesSettled]);

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
      if (Math.abs(currentWidth - lastWidth) < 10) return;
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
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      if (pixiContainerEl) {
        pixiContainerEl.innerHTML = '';
      }
    };
  }, [initializeAnimation]);

  return <div ref={pixiContainer} className="sprite-animation-container" style={{ width: '100%', display: 'block' }} />;
};

export default React.memo(SpriteAnimation);
