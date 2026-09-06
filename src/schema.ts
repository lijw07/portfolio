import { EDUCATION, EXPERIENCE, LINKS, PROJECTS, SKILLS } from './content';

export type Dialect = 'sql' | 'mongo' | 'dynamo';
export type SectionId = 'experience' | 'projects' | 'skills' | 'education' | 'contact';

export const STAGE_W = 1120;
export const STAGE_H = 680;

export interface Roll {
  dialect: Dialect;
  layout: number;
  personSlot: number;
  order: SectionId[];
  rev: string;
  hue: number;
}

const DIALECTS: Dialect[] = ['sql', 'mongo', 'dynamo'];
export const SECTIONS: SectionId[] = ['experience', 'projects', 'skills', 'education', 'contact'];
const HUES = [250, 205, 160, 85, 45, 310];

const randInt = (n: number) => Math.floor(Math.random() * n);
const pick = <T>(xs: T[]): T => xs[randInt(xs.length)];
function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function roll(): Roll {
  return {
    dialect: pick(DIALECTS),
    layout: randInt(LAYOUTS.length),
    personSlot: randInt(6),
    order: shuffle(SECTIONS),
    rev: `${1 + randInt(9)}.${randInt(10)}.${randInt(20)}`,
    hue: pick(HUES),
  };
}

export function brandLine(r: Roll): string {
  return `JAI_LI.SCHEMA · rev ${r.rev}`;
}

type Field = [string, string, string, boolean?];

interface EntityDef { count: number; fields: Field[] }

const ENTITIES: Record<SectionId, EntityDef> = {
  experience: { count: EXPERIENCE.length, fields: [['person_id', 'FK', 'uuid'], ['role', '', 'varchar'], ['company', '', 'varchar'], ['period', '', 'daterange']] },
  projects:   { count: PROJECTS.length, fields: [['person_id', 'FK', 'uuid'], ['title', '', 'varchar'], ['stack', '', 'varchar[]'], ['status', '', 'shipped | active']] },
  skills:     { count: SKILLS.reduce((n, g) => n + g.items.length, 0), fields: [['person_id', 'FK', 'uuid'], ['name', '', 'varchar'], ['category', '', 'enum(5)']] },
  education:  { count: EDUCATION.length, fields: [['person_id', 'FK', 'uuid'], ['degree', '', 'MS | BS | AS'], ['school', '', 'varchar']] },
  contact:    { count: Object.keys(LINKS).length, fields: [['github', '', 'url'], ['linkedin', '', 'url'], ['email', '', 'varchar']] },
};

const PERSON_FIELDS: Record<Dialect, Field[]> = {
  sql:    [['id', 'PK', 'uuid'], ['name', '', "'Jai Li'"], ['role', '', 'SWE & Game Designer'], ['status', '', 'open_to_work', true]],
  mongo:  [['_id:', '', 'ObjectId'], ['name:', '', '"Jai Li"'], ['role:', '', '"SWE & Game Designer"'], ['status:', '', '"open_to_work"', true]],
  dynamo: [['PK', '', 'PERSON#jai'], ['SK', '', 'PROFILE'], ['name', '', 'Jai Li'], ['status', '', 'open_to_work', true]],
};

const MONGO_TYPES: Record<string, string> = {
  uuid: 'ObjectId', varchar: 'String', 'varchar[]': '[String]', daterange: '{from,to}',
  'enum(5)': 'String', url: 'String', 'MS | BS | AS': 'String', 'shipped | active': 'String',
};
const DYNAMO_TYPES: Record<string, string> = {
  uuid: 'S', varchar: 'S', 'varchar[]': 'SS', daterange: 'M',
  'enum(5)': 'S', url: 'S', 'MS | BS | AS': 'S', 'shipped | active': 'S',
};
const DYNAMO_SK: Record<SectionId, string> = {
  experience: 'EXP#001', projects: 'PROJ#001', skills: 'SKILL#001', education: 'EDU#001', contact: 'CHANNEL#001',
};

const UNITS: Record<Dialect, [string, string]> = {
  sql: ['row', 'rows'], mongo: ['doc', 'docs'], dynamo: ['item', 'items'],
};

const CARDINALITY: Record<SectionId, [string, string]> = {
  experience: ['1', 'N'], projects: ['N', 'M'], skills: ['N', 'M'], education: ['1', 'N'], contact: ['1', '1'],
};

export interface Row {
  key: string;
  marker: string;
  value: string;
  accent: boolean;
  indent: boolean;
  keyBg: boolean;
}

const row = (key: string, marker: string, value: string, accent = false, indent = false, keyBg = false): Row =>
  ({ key, marker, value, accent, indent, keyBg });

const wrapBraces = (rows: Row[]): Row[] => [row('{', '', ''), ...rows, row('}', '', '')];

function entityRows(name: SectionId, fields: Field[], d: Dialect): Row[] {
  if (d === 'sql') return fields.map(f => row(f[0], f[1], f[2], !!f[3]));
  if (d === 'mongo') {
    return wrapBraces(fields.map(f => row(f[0] + ':', f[1] === 'FK' ? 'ref' : '', MONGO_TYPES[f[2]] ?? f[2], !!f[3], true)));
  }
  const attrs = fields.filter(f => f[1] !== 'FK').map(f => row(f[0], '', DYNAMO_TYPES[f[2]] ?? f[2], !!f[3]));
  return [
    row('PK', '', 'PERSON#jai', true, false, true),
    row('SK', '', DYNAMO_SK[name], false, false, true),
    ...attrs,
  ];
}

function personRows(d: Dialect): Row[] {
  const rows = PERSON_FIELDS[d].map(f => row(f[0], f[1], f[2], !!f[3], d === 'mongo'));
  return d === 'mongo' ? wrapBraces(rows) : rows;
}

function entityTitle(name: string, d: Dialect): string {
  if (d === 'sql') return name.toUpperCase();
  if (d === 'mongo') return `db.${name}`;
  return name;
}

function badge(count: number, d: Dialect): string {
  const [one, many] = UNITS[d];
  return `${count} ${count === 1 ? one : many}`;
}
interface Slot { l: number; t: number; w: number }

const LAYOUTS: Slot[][] = [
  [{ l: 60, t: 60, w: 260 }, { l: 810, t: 60, w: 260 }, { l: 40, t: 430, w: 260 }, { l: 830, t: 430, w: 260 }, { l: 450, t: 460, w: 240 }, { l: 440, t: 180, w: 260 }],
  [{ l: 40, t: 40, w: 260 }, { l: 40, t: 290, w: 260 }, { l: 340, t: 450, w: 260 }, { l: 820, t: 40, w: 260 }, { l: 820, t: 290, w: 260 }, { l: 430, t: 40, w: 260 }],
  [{ l: 160, t: 30, w: 260 }, { l: 720, t: 30, w: 260 }, { l: 60, t: 330, w: 260 }, { l: 850, t: 330, w: 240 }, { l: 460, t: 460, w: 240 }, { l: 440, t: 160, w: 260 }],
  [{ l: 80, t: 140, w: 260 }, { l: 800, t: 70, w: 260 }, { l: 100, t: 450, w: 260 }, { l: 840, t: 390, w: 240 }, { l: 450, t: 450, w: 240 }, { l: 440, t: 150, w: 260 }],
];

const PERSON_W = 260;
const DELAYS = [0.6, 0.9, 1.2, 1.5, 1.8];

const BORDER = 2;
const HEAD_PAD = 20;
const BODY_PAD = 16;
const ROW_H = 27.4;
const BADGE_H = 23;
const TITLE_H: Record<Dialect, number> = { sql: 26.4, mongo: 21, dynamo: 20.2 };

function entityHeight(rowCount: number, d: Dialect, isPerson: boolean): number {
  const head = isPerson ? TITLE_H[d] : Math.max(TITLE_H[d], BADGE_H);
  const rule = !isPerson && d === 'dynamo' ? 2 : 1;
  return BORDER + HEAD_PAD + head + rule + BODY_PAD + rowCount * ROW_H;
}

interface Entity {
  id: SectionId;
  href: string;
  title: string;
  badge: string;
  rows: Row[];
  slot: Slot;
  height: number;
  delay: number;
}

interface Connector { d: string; delay: number }

interface Label { x: number; y: number; anchor: 'start' | 'middle' | 'end'; text: string; delay: number }

interface Diagram {
  dialect: Dialect;
  person: { title: string; badge: string; rows: Row[]; slot: Slot; height: number };
  satellites: Entity[];
}

export function buildDiagram(r: Roll): Diagram {
  const d = r.dialect;
  const all = LAYOUTS[r.layout % LAYOUTS.length];
  const pIdx = r.personSlot % all.length;
  const personSlot: Slot = { l: Math.min(all[pIdx].l, 850), t: Math.min(all[pIdx].t, 440), w: PERSON_W };
  const slots = all.filter((_, i) => i !== pIdx);

  const satellites: Entity[] = r.order.map((id, i) => {
    const rows = entityRows(id, ENTITIES[id].fields, d);
    return {
      id,
      href: `#${id}`,
      title: entityTitle(id, d),
      badge: badge(ENTITIES[id].count, d),
      rows,
      slot: slots[i],
      height: entityHeight(rows.length, d, false),
      delay: DELAYS[i],
    };
  });

  const pRows = personRows(d);

  return {
    dialect: d,
    person: {
      title: entityTitle('person', d),
      badge: `1 ${UNITS[d][0]}`,
      rows: pRows,
      slot: personSlot,
      height: entityHeight(pRows.length, d, true),
    },
    satellites,
  };
}

interface Rect { x: number; y: number; w: number; h: number }

type Side = 'left' | 'right' | 'top' | 'bottom';

interface Pt { x: number; y: number }

interface Seg { a: Pt; b: Pt }

const CLEARANCE = 16;
const STUB = 24;
const MIN_SIDE_GAP = 54;
const MIN_EXIT_ROOM = 34;
const MAX_PER_SIDE = 3;
const TURN_COST = 45;
const OVERLAP_COST = 260;
const OVERLAP_WEIGHT = 5;
const OVERLAP_BAND = 9;
const EDGE_INSET = 6;
const LABEL_GAP = 9;
const SIDES: Side[] = ['left', 'right', 'top', 'bottom'];

const OPPOSITE: Record<Side, Side> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
const NORMAL: Record<Side, Pt> = {
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, top: { x: 0, y: -1 }, bottom: { x: 0, y: 1 },
};

const isVertical = (s: Side) => s === 'left' || s === 'right';
const centerOf = (r: Rect): Pt => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const inflate = (r: Rect, m: number): Rect => ({ x: r.x - m, y: r.y - m, w: r.w + m * 2, h: r.h + m * 2 });
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function sideGaps(p: Rect, s: Rect): Record<Side, number> {
  const out = {} as Record<Side, number>;
  SIDES.forEach(side => { out[side] = sideGap(p, s, side); });
  return out;
}

function exitRoom(person: Rect, side: Side, others: Rect[]): number {
  let room = side === 'left' ? person.x
    : side === 'right' ? STAGE_W - (person.x + person.w)
      : side === 'top' ? person.y
        : STAGE_H - (person.y + person.h);

  for (const o of others) {
    if (isVertical(side)) {
      if (o.y + o.h <= person.y || o.y >= person.y + person.h) continue;
      const d = side === 'left' ? person.x - (o.x + o.w) : o.x - (person.x + person.w);
      if (d >= 0) room = Math.min(room, d);
    } else {
      if (o.x + o.w <= person.x || o.x >= person.x + person.w) continue;
      const d = side === 'top' ? person.y - (o.y + o.h) : o.y - (person.y + person.h);
      if (d >= 0) room = Math.min(room, d);
    }
  }
  return room;
}

function spanOverlap(person: Rect, sat: Rect, side: Side): number {
  return isVertical(side)
    ? Math.min(person.y + person.h, sat.y + sat.h) - Math.max(person.y, sat.y)
    : Math.min(person.x + person.w, sat.x + sat.w) - Math.max(person.x, sat.x);
}

function sideGap(person: Rect, sat: Rect, side: Side): number {
  switch (side) {
    case 'left': return person.x - (sat.x + sat.w);
    case 'right': return sat.x - (person.x + person.w);
    case 'top': return person.y - (sat.y + sat.h);
    default: return sat.y - (person.y + person.h);
  }
}

function directSide(person: Rect, sat: Rect): Side | null {
  for (const side of SIDES) {
    const gap = sideGap(person, sat, side);
    if (gap < 8 || gap >= MIN_SIDE_GAP) continue;
    if (spanOverlap(person, sat, side) >= 40) return side;
  }
  return null;
}

function assignSides(person: Rect, sats: Rect[], pinned: (Side | null)[]): Side[] {
  const pc = centerOf(person);
  const room = {} as Record<Side, number>;
  SIDES.forEach(s => { room[s] = exitRoom(person, s, sats); });

  const info = sats.map(s => {
    const sc = centerOf(s);
    const dx = sc.x - pc.x;
    const dy = sc.y - pc.y;
    return {
      gaps: sideGaps(person, s),
      horiz: (dx >= 0 ? 'right' : 'left') as Side,
      vert: (dy >= 0 ? 'bottom' : 'top') as Side,
      bias: Math.abs(dx) - Math.abs(dy),
    };
  });

  const usable = (s: Side, gap: number) => gap >= MIN_SIDE_GAP && room[s] >= MIN_EXIT_ROOM;

  const sides = info.map((f, i) => {
    if (pinned[i]) return pinned[i] as Side;
    const hOk = usable(f.horiz, f.gaps[f.horiz]);
    const vOk = usable(f.vert, f.gaps[f.vert]);
    if (hOk && vOk) return f.bias >= 0 ? f.horiz : f.vert;
    if (hOk) return f.horiz;
    if (vOk) return f.vert;
    return room[f.horiz] >= room[f.vert] ? f.horiz : f.vert;
  });

  for (let pass = 0; pass < sats.length; pass++) {
    const counts = {} as Record<Side, number>;
    SIDES.forEach(s => { counts[s] = 0; });
    sides.forEach(s => { counts[s] += 1; });

    const crowded = SIDES.find(s => counts[s] > MAX_PER_SIDE);
    if (!crowded) break;

    let move = -1;
    let least = Infinity;
    sides.forEach((s, i) => {
      if (s !== crowded || pinned[i]) return;
      const f = info[i];
      const alt = crowded === f.horiz ? f.vert : f.horiz;
      if (!usable(alt, f.gaps[alt]) || counts[alt] >= MAX_PER_SIDE) return;
      if (Math.abs(f.bias) < least) { least = Math.abs(f.bias); move = i; }
    });
    if (move < 0) break;

    const f = info[move];
    sides[move] = crowded === f.horiz ? f.vert : f.horiz;
  }

  return sides;
}

const facingMid = (person: Rect, sat: Rect, side: Side): number => (isVertical(side)
  ? (Math.max(person.y, sat.y) + Math.min(person.y + person.h, sat.y + sat.h)) / 2
  : (Math.max(person.x, sat.x) + Math.min(person.x + person.w, sat.x + sat.w)) / 2);

function personAnchors(person: Rect, sides: Side[], sats: Rect[], pinned: (Side | null)[]): Pt[] {
  const out: Pt[] = new Array(sides.length);

  SIDES.forEach(side => {
    const members = sides.map((s, i) => (s === side ? i : -1)).filter(i => i >= 0);
    if (!members.length) return;

    const vertical = isVertical(side);
    const edge = vertical
      ? (side === 'left' ? person.x : person.x + person.w)
      : (side === 'top' ? person.y : person.y + person.h);
    const at = (pos: number): Pt => (vertical ? { x: edge, y: pos } : { x: pos, y: edge });

    const fixed = members.filter(i => pinned[i]);
    const free = members.filter(i => !pinned[i]);
    const taken = fixed.map(i => facingMid(person, sats[i], side));
    fixed.forEach((i, k) => { out[i] = at(taken[k]); });

    if (!free.length) return;

    free.sort((a, b) => (vertical
      ? centerOf(sats[a]).y - centerOf(sats[b]).y
      : centerOf(sats[a]).x - centerOf(sats[b]).x));

    const span = vertical ? person.h : person.w;
    const origin = vertical ? person.y : person.x;
    const inset = Math.min(22, span / (free.length + 2));
    const usable = span - inset * 2;

    free.forEach((sat, k) => {
      const t = free.length === 1 ? 0.5 : k / (free.length - 1);
      let pos = origin + inset + usable * t;
      for (const t2 of taken) {
        if (Math.abs(pos - t2) >= 24) continue;
        pos = clamp(pos < t2 ? t2 - 24 : t2 + 24, origin + 6, origin + span - 6);
      }
      out[sat] = at(pos);
    });
  });

  return out;
}

function satelliteSide(person: Rect, sat: Rect, all: Rect[]): Side {
  const pc = centerOf(person);
  const sc = centerOf(sat);
  const dx = pc.x - sc.x;
  const dy = pc.y - sc.y;
  const horiz: Side = dx >= 0 ? 'right' : 'left';
  const vert: Side = dy >= 0 ? 'bottom' : 'top';
  const hRoom = exitRoom(sat, horiz, all);
  const vRoom = exitRoom(sat, vert, all);

  const hOk = hRoom >= MIN_EXIT_ROOM;
  const vOk = vRoom >= MIN_EXIT_ROOM;
  if (hOk && vOk) return Math.abs(dx) >= Math.abs(dy) ? horiz : vert;
  if (hOk) return horiz;
  if (vOk) return vert;
  return hRoom >= vRoom ? horiz : vert;
}

function satAnchor(r: Rect, side: Side): Pt {
  if (isVertical(side)) {
    return { x: side === 'left' ? r.x : r.x + r.w, y: clamp(r.y + 70, r.y + 26, r.y + r.h - 26) };
  }
  return { x: r.x + r.w / 2, y: side === 'top' ? r.y : r.y + r.h };
}

function segBlocked(a: Pt, b: Pt, obstacles: Rect[]): boolean {
  const eps = 0.75;
  const x1 = Math.min(a.x, b.x);
  const x2 = Math.max(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const y2 = Math.max(a.y, b.y);
  return obstacles.some(r =>
    x1 < r.x + r.w - eps && x2 > r.x + eps && y1 < r.y + r.h - eps && y2 > r.y + eps);
}

function overlapCost(a: Pt, b: Pt, used: Seg[]): number {
  const horiz = Math.abs(a.y - b.y) < 0.01;
  let shared = 0;
  for (const s of used) {
    const sHoriz = Math.abs(s.a.y - s.b.y) < 0.01;
    if (sHoriz !== horiz) continue;
    if (horiz) {
      if (Math.abs(s.a.y - a.y) > OVERLAP_BAND) continue;
      const lo = Math.max(Math.min(a.x, b.x), Math.min(s.a.x, s.b.x));
      const hi = Math.min(Math.max(a.x, b.x), Math.max(s.a.x, s.b.x));
      if (hi - lo > 2) shared = Math.max(shared, hi - lo);
    } else {
      if (Math.abs(s.a.x - a.x) > OVERLAP_BAND) continue;
      const lo = Math.max(Math.min(a.y, b.y), Math.min(s.a.y, s.b.y));
      const hi = Math.min(Math.max(a.y, b.y), Math.max(s.a.y, s.b.y));
      if (hi - lo > 2) shared = Math.max(shared, hi - lo);
    }
  }
  return shared > 0 ? OVERLAP_COST + shared * OVERLAP_WEIGHT : 0;
}

function gridAxis(edges: number[], lo: number, hi: number): number[] {
  const inner = Array.from(new Set(edges.filter(v => v > lo && v < hi))).sort((a, b) => a - b);
  const spine = [lo, ...inner, hi];
  const mids: number[] = [];
  for (let i = 0; i < spine.length - 1; i++) {
    const gap = spine[i + 1] - spine[i];
    if (gap > 66) mids.push(spine[i] + gap / 3, spine[i] + (gap * 2) / 3);
    else if (gap > 20) mids.push(spine[i] + gap / 2);
  }
  return Array.from(new Set([...spine, ...mids])).sort((a, b) => a - b);
}

class MinHeap {
  private keys: number[] = [];
  private vals: number[] = [];

  get size() { return this.keys.length; }

  push(key: number, val: number) {
    this.keys.push(key);
    this.vals.push(val);
    let i = this.keys.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= this.keys[i]) break;
      this.swap(i, p);
      i = p;
    }
  }

  pop(): { key: number; val: number } | null {
    if (!this.keys.length) return null;
    const key = this.keys[0];
    const val = this.vals[0];
    const lastKey = this.keys.pop() as number;
    const lastVal = this.vals.pop() as number;
    if (this.keys.length) {
      this.keys[0] = lastKey;
      this.vals[0] = lastVal;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.keys.length && this.keys[l] < this.keys[m]) m = l;
        if (r < this.keys.length && this.keys[r] < this.keys[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return { key, val };
  }

  private swap(a: number, b: number) {
    const k = this.keys[a]; this.keys[a] = this.keys[b]; this.keys[b] = k;
    const v = this.vals[a]; this.vals[a] = this.vals[b]; this.vals[b] = v;
  }
}

function nearestIndex(arr: number[], v: number): number {
  let best = 0;
  let dist = Infinity;
  for (let i = 0; i < arr.length; i++) {
    const d = Math.abs(arr[i] - v);
    if (d < dist) { dist = d; best = i; }
  }
  return best;
}

function findPath(
  start: Pt, startAxis: 1 | 2, goal: Pt,
  xs: number[], ys: number[], obstacles: Rect[], used: Seg[],
): Pt[] | null {
  const nx = xs.length;
  const ny = ys.length;
  const sx = nearestIndex(xs, start.x);
  const sy = nearestIndex(ys, start.y);
  const gx = nearestIndex(xs, goal.x);
  const gy = nearestIndex(ys, goal.y);

  const nodes = nx * ny;
  const g = new Float64Array(nodes * 3).fill(Infinity);
  const from = new Int32Array(nodes * 3).fill(-1);
  const heur = (ix: number, iy: number) => Math.abs(xs[ix] - goal.x) + Math.abs(ys[iy] - goal.y);

  const startState = (sy * nx + sx) * 3 + startAxis;
  g[startState] = 0;

  const heap = new MinHeap();
  heap.push(heur(sx, sy), startState);

  const goalNode = gy * nx + gx;
  let end = -1;

  while (heap.size) {
    const top = heap.pop() as { key: number; val: number };
    const state = top.val;
    const node = (state / 3) | 0;
    const axis = state % 3;
    const ix = node % nx;
    const iy = (node / nx) | 0;

    if (top.key > g[state] + heur(ix, iy) + 1e-6) continue;
    if (node === goalNode) { end = state; break; }

    const a = { x: xs[ix], y: ys[iy] };
    const steps: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (const [dx, dy] of steps) {
      const jx = ix + dx;
      const jy = iy + dy;
      if (jx < 0 || jy < 0 || jx >= nx || jy >= ny) continue;

      const b = { x: xs[jx], y: ys[jy] };
      if (segBlocked(a, b, obstacles)) continue;

      const nextAxis = dx !== 0 ? 1 : 2;
      let cost = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
      if (axis !== nextAxis) cost += TURN_COST;
      cost += overlapCost(a, b, used);

      const ns = (jy * nx + jx) * 3 + nextAxis;
      const next = g[state] + cost;
      if (next < g[ns]) {
        g[ns] = next;
        from[ns] = state;
        heap.push(next + heur(jx, jy), ns);
      }
    }
  }

  if (end < 0) return null;

  const path: Pt[] = [];
  for (let s = end; s >= 0; s = from[s]) {
    const node = (s / 3) | 0;
    path.push({ x: xs[node % nx], y: ys[(node / nx) | 0] });
  }
  return path.reverse();
}

function bestElbow(pa: Pt, side: Side, sa: Pt, farSide: Side, rects: Rect[]): Pt[] {
  const s1 = { x: pa.x + NORMAL[side].x * 20, y: pa.y + NORMAL[side].y * 20 };
  const s2 = { x: sa.x + NORMAL[farSide].x * 20, y: sa.y + NORMAL[farSide].y * 20 };

  const candidates: Pt[][] = [];
  for (const t of [0.5, 0.32, 0.68, 0.15, 0.85]) {
    const mx = s1.x + (s2.x - s1.x) * t;
    const my = s1.y + (s2.y - s1.y) * t;
    candidates.push([pa, s1, { x: mx, y: s1.y }, { x: mx, y: s2.y }, s2, sa]);
    candidates.push([pa, s1, { x: s1.x, y: my }, { x: s2.x, y: my }, s2, sa]);
  }

  const walls = rects.map(r => inflate(r, 2));
  let best = candidates[0];
  let bestScore = Infinity;

  for (const c of candidates) {
    const pts = simplify(c);
    const score = toSegs(pts).reduce((n, s) => n + (segBlocked(s.a, s.b, walls) ? 1 : 0), 0);
    if (score < bestScore) { bestScore = score; best = pts; }
  }
  return best;
}

const ATTEMPTS = [
  { clear: CLEARANCE, stub: STUB },
  { clear: 10, stub: 16 },
  { clear: 5, stub: 10 },
  { clear: 2, stub: 6 },
];

function simplify(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - p.x) < 0.01 && Math.abs(last.y - p.y) < 0.01) continue;
    out.push(p);
  }
  for (let i = out.length - 2; i > 0; i--) {
    const a = out[i - 1];
    const b = out[i];
    const c = out[i + 1];
    const sameX = Math.abs(a.x - b.x) < 0.01 && Math.abs(b.x - c.x) < 0.01;
    const sameY = Math.abs(a.y - b.y) < 0.01 && Math.abs(b.y - c.y) < 0.01;
    if (sameX || sameY) out.splice(i, 1);
  }
  return out;
}

const round = (n: number) => Math.round(n * 10) / 10;

function toPath(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.x)} ${round(p.y)}`).join(' ');
}

function toSegs(pts: Pt[]): Seg[] {
  const segs: Seg[] = [];
  for (let i = 0; i < pts.length - 1; i++) segs.push({ a: pts[i], b: pts[i + 1] });
  return segs;
}

function labelAt(p: Pt, side: Side, text: string, delay: number): Label {
  switch (side) {
    case 'right': return { x: p.x + LABEL_GAP, y: p.y - 7, anchor: 'start', text, delay };
    case 'left': return { x: p.x - LABEL_GAP, y: p.y - 7, anchor: 'end', text, delay };
    case 'top': return { x: p.x + 7, y: p.y - LABEL_GAP - 2, anchor: 'start', text, delay };
    default: return { x: p.x + 7, y: p.y + LABEL_GAP + 8, anchor: 'start', text, delay };
  }
}

function spreadLabels(labels: Label[]): Label[] {
  const placed: Label[] = [];
  const clashes = (lb: Label) =>
    placed.some(o => Math.abs(o.x - lb.x) < 15 && Math.abs(o.y - lb.y) < 12);

  for (const lb of labels) {
    let cur = lb;
    for (let k = 1; k <= 6 && clashes(cur); k++) {
      cur = { ...lb, y: lb.y + (k % 2 ? -1 : 1) * 13 * Math.ceil(k / 2) };
    }
    placed.push(cur);
  }
  return placed;
}

interface Routing { connectors: Connector[]; labels: Label[] }

export function routeDiagram(diagram: Diagram, heights: Record<string, number> = {}): Routing {
  const p = diagram.person;
  const person: Rect = { x: p.slot.l, y: p.slot.t, w: p.slot.w, h: heights.person || p.height };
  const sats = diagram.satellites.map(e => ({
    entity: e,
    rect: { x: e.slot.l, y: e.slot.t, w: e.slot.w, h: heights[e.id] || e.height } as Rect,
  }));

  const rects = sats.map(s => s.rect);
  const all = [person, ...rects];
  const pinned = rects.map(r => directSide(person, r));
  const sides = assignSides(person, rects, pinned);
  const anchors = personAnchors(person, sides, rects, pinned);

  const loX = EDGE_INSET;
  const hiX = STAGE_W - EDGE_INSET;
  const loY = EDGE_INSET;
  const hiY = STAGE_H - EDGE_INSET;

  const connectors: Connector[] = [];
  const labels: Label[] = [];
  const used: Seg[] = [];

  const order = sats
    .map((sat, i) => {
      const pa = anchors[i];
      const c = centerOf(sat.rect);
      return { i, span: Math.abs(c.x - pa.x) + Math.abs(c.y - pa.y) };
    })
    .sort((a, b) => b.span - a.span)
    .map(o => o.i);

  const routed: { pts: Pt[]; side: Side; farSide: Side; pa: Pt; sa: Pt }[] = new Array(sats.length);

  order.forEach(i => {
    const sat = sats[i];
    const side = sides[i];
    const pa = anchors[i];

    if (pinned[i]) {
      const farSide = OPPOSITE[side];
      const sa = isVertical(side)
        ? { x: side === 'left' ? sat.rect.x + sat.rect.w : sat.rect.x, y: pa.y }
        : { x: pa.x, y: side === 'top' ? sat.rect.y + sat.rect.h : sat.rect.y };
      const pts = [pa, sa];
      routed[i] = { pts, side, farSide, pa, sa };
      used.push(...toSegs(pts));
      return;
    }

    const farSide = satelliteSide(person, sat.rect, all);
    const sa = satAnchor(sat.rect, farSide);
    const n1 = NORMAL[side];
    const n2 = NORMAL[farSide];
    const axis: 1 | 2 = isVertical(side) ? 1 : 2;

    let pts: Pt[] | null = null;
    for (const att of ATTEMPTS) {
      const obstacles = all.map(r => inflate(r, att.clear));
      const stub1 = { x: pa.x + n1.x * att.stub, y: pa.y + n1.y * att.stub };
      const stub2 = { x: sa.x + n2.x * att.stub, y: sa.y + n2.y * att.stub };
      const xs = gridAxis([...obstacles.flatMap(r => [r.x, r.x + r.w]), stub1.x, stub2.x], loX, hiX);
      const ys = gridAxis([...obstacles.flatMap(r => [r.y, r.y + r.h]), stub1.y, stub2.y], loY, hiY);

      const mid = findPath(stub1, axis, stub2, xs, ys, obstacles, used);
      if (mid) { pts = simplify([pa, ...mid, sa]); break; }
    }
    if (!pts) pts = bestElbow(pa, side, sa, farSide, all);

    routed[i] = { pts, side, farSide, pa, sa };
    used.push(...toSegs(pts));
  });

  sats.forEach((sat, i) => {
    const { pts, side, farSide, pa, sa } = routed[i];
    const delay = DELAYS[i];
    connectors.push({ d: toPath(pts), delay });

    const [near, far] = CARDINALITY[sat.entity.id];
    if (pinned[i]) {
      const mid = { x: (pa.x + sa.x) / 2, y: (pa.y + sa.y) / 2 };
      labels.push(isVertical(side)
        ? { x: mid.x, y: mid.y - 7, anchor: 'middle', text: `${near}:${far}`, delay: delay + 0.7 }
        : { x: mid.x + 8, y: mid.y + 4, anchor: 'start', text: `${near}:${far}`, delay: delay + 0.7 });
      return;
    }
    labels.push(labelAt(pa, side, near, delay + 0.7));
    labels.push(labelAt(sa, farSide, far, delay + 0.7));
  });

  return { connectors, labels: spreadLabels(labels) };
}
