// GameDeck — game catalog. Wire real embed / trailer / repo URLs here.
const PUBLIC = process.env.PUBLIC_URL || '';

export type CategoryKey = 'web' | 'download' | 'dev';

/** A single control mapping shown in the "How to play" overlay. */
export interface Control {
  /** Key(s) or input for this action, e.g. '↑ ↓ ← →' or 'W A S D'. */
  keys: string;
  /** What that input does. */
  action: string;
}

/** Optional in-game instructions surfaced in the play overlay. */
export interface GameInstructions {
  goal: string;
  controls: Control[];
  tips?: string[];
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  color: string;
  /** Which section the game belongs to: browser-playable, downloadable build, or in development. */
  category: CategoryKey;
  /** Download URL for download-category games (itch.io, GitHub release, etc.). */
  downloadUrl?: string;
  /** Playable build (WebGL / HTML5) embedded in an <iframe>. */
  embedUrl?: string;
  /** Trailer URL — a YouTube/Vimeo embed, or a local video file. */
  trailerUrl?: string;
  /** When true the trailer is a raw video file rendered with <video> instead of an <iframe>. */
  trailerIsVideo?: boolean;
  /** GitHub repository. */
  repoUrl?: string;
  /** Optional cover art shown on the card (otherwise the flat color block is used). */
  cover?: string;
  /** Render the cover with smooth scaling instead of pixelated (for non-pixel-art art). */
  coverSmooth?: boolean;
  /** Game has only a trailer (no playable embed). */
  trailerOnly?: boolean;
  /** Under construction — card is dimmed and non-interactive. */
  wip?: boolean;
  /** How-to-play instructions shown over the game in the play overlay. */
  instructions?: GameInstructions;
}

export const GAMES: Game[] = [
  {
    id: 'tower-defense',
    title: 'Tower Defense',
    genre: 'Strategy',
    tagline: 'My spin on tower defense — drop towers along the path, upgrade them between waves, and scramble when something slips through.',
    color: '#ef4444',
    category: 'web',
    cover: `${PUBLIC}/tower-defense-cover.png`,
    embedUrl: `${PUBLIC}/tower-defense/index.html`,
    repoUrl: 'https://github.com/lijw07/tower-defense',
  },
  {
    id: 'paws-and-hooves',
    title: 'Paws and Hooves',
    genre: '3D Adventure',
    tagline: "You're a farm animal busting your friends out of their pens. Each one — donkey, hen, chick, cow — plays a little differently, and the farmer is never far behind.",
    color: '#14b8a6',
    category: 'web',
    cover: `${PUBLIC}/paws-cover.png`,
    coverSmooth: true,
    embedUrl: `${PUBLIC}/paws-and-hooves/index.html`,
    trailerUrl: `${PUBLIC}/Index_Paws_And_Hooves_Trailer_compressed.mp4`,
    trailerIsVideo: true,
    repoUrl: 'https://github.com/lijw07/paws-and-hooves',
  },
  {
    id: '2048',
    title: '2048',
    genre: 'Puzzle',
    tagline: 'The classic sliding-tile puzzle, rebuilt in Godot. Slide to merge matching numbers and chase that 2048 tile. One move from a full board ends the run.',
    color: '#edc22e',
    category: 'web',
    cover: `${PUBLIC}/2048-cover.png`,
    coverSmooth: true,
    embedUrl: `${PUBLIC}/2048/2048.html`,
    repoUrl: 'https://github.com/lijw07/2048',
    instructions: {
      goal: 'Slide the numbered tiles to combine matching pairs. Every merge doubles the number. Get a tile to 2048 to win. New tiles keep spawning, and when the board fills with no moves left, the run ends.',
      controls: [
        { keys: '↑ ↓ ← →', action: 'Slide all tiles' },
        { keys: 'W A S D', action: 'Slide all tiles' },
      ],
      tips: [
        'Pin your biggest tile in a corner and keep it there.',
        'Build tiles in order along one edge so merges chain.',
        'Look one move ahead, since every slide drops a new tile.',
      ],
    },
  },
  {
    id: 'tanks',
    title: 'Tanks!',
    genre: 'Action',
    tagline: 'A fast little tank game. Roll around the map, line up your shot, and pop the other tanks before they pop you.',
    color: '#f59e0b',
    category: 'web',
    cover: `${PUBLIC}/tanks-cover.png`,
    coverSmooth: true,
    repoUrl: 'https://github.com/lijw07/Tanks',
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Survival',
    genre: 'Survival',
    tagline: "Loot what you can while it's light out, then board up and try to make it through the night. Still balancing how brutal those nights get.",
    color: '#7c3aed',
    category: 'dev',
    wip: true,
  },
  {
    id: 'crafting-quest',
    title: 'Crafting Quest',
    genre: 'Sandbox',
    tagline: "A sandbox where you gather materials and puzzle out recipes to build stuff. Early days — there's a lot more I want to add.",
    color: '#0ea5e9',
    category: 'dev',
    wip: true,
  },
];

export interface DerivedGame extends Game {
  count: number;
  secs: number;
  initial: string;
  playsLabel: string;
  timeLabel: string;
  hasEmbed: boolean;
  isTrailer: boolean;
  noMedia: boolean;
  cta: string;
  ctaShort: string;
  ctaLong: string;
  resolvedRepo: string;
  dimmed: boolean;
}

export function fmtCount(n: number): string {
  if (n >= 1000) {
    let s = (n / 1000).toFixed(1);
    if (s.endsWith('.0')) s = s.slice(0, -2);
    return s + 'k';
  }
  return '' + n;
}

export function fmtTime(sec: number): string {
  if (!sec || sec <= 0) return '0m';
  const m = Math.floor(sec / 60);
  if (m < 1) return '<1m';
  if (m < 60) return m + 'm';
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? h + 'h ' + rm + 'm' : h + 'h';
}

export function deriveGame(
  g: Game,
  count: number,
  secs: number
): DerivedGame {
  const playable = !g.trailerOnly && !!g.embedUrl;
  const trailerMode = !!g.trailerOnly || (!playable && !!g.trailerUrl);
  return {
    ...g,
    count,
    secs,
    initial: g.title.charAt(0),
    playsLabel: fmtCount(count),
    timeLabel: fmtTime(secs),
    hasEmbed: playable,
    isTrailer: !playable && !!g.trailerUrl,
    noMedia: !playable && !g.trailerUrl,
    cta: trailerMode ? '▶ Watch trailer' : '▶ Play now',
    ctaShort: trailerMode ? '▶ Trailer' : '▶ Play',
    ctaLong: trailerMode ? '▶ Watch trailer' : '▶ Play ' + g.title,
    resolvedRepo: g.repoUrl || '#',
    dimmed: !!g.wip,
  };
}
