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

export const DIALECTS: Dialect[] = ['sql', 'mongo', 'dynamo'];
export const SECTIONS: SectionId[] = ['experience', 'projects', 'skills', 'education', 'contact'];
export const HUES = [250, 205, 160, 85, 45, 310];

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

export const ENGINE_LABEL: Record<Dialect, string> = {
  sql: 'postgresql 16',
  mongo: 'mongodb 7',
  dynamo: 'dynamodb',
};

export function brandLine(r: Roll): string {
  return `JAI_LI.SCHEMA · rev ${r.rev}`;
}

type Field = [string, string, string, boolean?];

interface EntityDef { count: number; fields: Field[] }

const ENTITIES: Record<SectionId, EntityDef> = {
  experience: { count: 2, fields: [['person_id', 'FK', 'uuid'], ['role', '', 'varchar'], ['company', '', 'varchar'], ['period', '', 'daterange']] },
  projects:   { count: 6, fields: [['person_id', 'FK', 'uuid'], ['title', '', 'varchar'], ['stack', '', 'varchar[]'], ['status', '', 'shipped | active']] },
  skills:     { count: 28, fields: [['person_id', 'FK', 'uuid'], ['name', '', 'varchar'], ['category', '', 'enum(5)']] },
  education:  { count: 3, fields: [['person_id', 'FK', 'uuid'], ['degree', '', 'MS | BS | AS'], ['school', '', 'varchar']] },
  contact:    { count: 3, fields: [['github', '', 'url'], ['linkedin', '', 'url'], ['email', '', 'varchar']] },
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

export function entityTitle(name: string, d: Dialect): string {
  if (d === 'sql') return name.toUpperCase();
  if (d === 'mongo') return `db.${name}`;
  return name;
}

function badge(count: number, d: Dialect): string {
  const [one, many] = UNITS[d];
  return `${count} ${count === 1 ? one : many}`;
}

export interface Slot { l: number; t: number; w: number }

export const LAYOUTS: Slot[][] = [
  [{ l: 60, t: 60, w: 260 }, { l: 810, t: 60, w: 260 }, { l: 40, t: 430, w: 260 }, { l: 830, t: 430, w: 260 }, { l: 450, t: 460, w: 240 }, { l: 440, t: 180, w: 260 }],
  [{ l: 40, t: 40, w: 260 }, { l: 40, t: 290, w: 260 }, { l: 340, t: 450, w: 260 }, { l: 820, t: 40, w: 260 }, { l: 820, t: 290, w: 260 }, { l: 430, t: 40, w: 260 }],
  [{ l: 160, t: 30, w: 260 }, { l: 720, t: 30, w: 260 }, { l: 60, t: 330, w: 260 }, { l: 850, t: 330, w: 240 }, { l: 460, t: 460, w: 240 }, { l: 440, t: 160, w: 260 }],
  [{ l: 80, t: 140, w: 260 }, { l: 800, t: 70, w: 260 }, { l: 100, t: 450, w: 260 }, { l: 840, t: 390, w: 240 }, { l: 450, t: 450, w: 240 }, { l: 440, t: 150, w: 260 }],
];

const PERSON_W = 260;
const PERSON_H = 215;
const DELAYS = [0.6, 0.9, 1.2, 1.5, 1.8];

export interface Entity {
  id: SectionId;
  href: string;
  title: string;
  badge: string;
  rows: Row[];
  slot: Slot;
  delay: number;
}

export interface Connector { d: string; delay: number }

export interface Label { x: number; y: number; anchor: 'start' | 'end'; text: string; delay: number }

export interface Diagram {
  dialect: Dialect;
  person: { title: string; badge: string; rows: Row[]; slot: Slot };
  satellites: Entity[];
  connectors: Connector[];
  labels: Label[];
}

export function buildDiagram(r: Roll): Diagram {
  const d = r.dialect;
  const all = LAYOUTS[r.layout % LAYOUTS.length];
  const pIdx = r.personSlot % all.length;
  const personSlot: Slot = { l: Math.min(all[pIdx].l, 850), t: Math.min(all[pIdx].t, 440), w: PERSON_W };
  const slots = all.filter((_, i) => i !== pIdx);

  const satellites: Entity[] = r.order.map((id, i) => ({
    id,
    href: `#${id}`,
    title: entityTitle(id, d),
    badge: badge(ENTITIES[id].count, d),
    rows: entityRows(id, ENTITIES[id].fields, d),
    slot: slots[i],
    delay: DELAYS[i],
  }));

  const P = { x: personSlot.l, y: personSlot.t, w: PERSON_W, h: PERSON_H };
  const clampY = (y: number) => Math.min(P.y + P.h - 20, Math.max(P.y + 20, y));
  const connectors: Connector[] = [];
  const labels: Label[] = [];

  satellites.forEach((ent, i) => {
    const sl = ent.slot;
    const delay = DELAYS[i];
    const labelDelay = delay + 0.7;
    const [near, far] = CARDINALITY[ent.id];
    let d_: string;

    if (sl.l + sl.w <= P.x + 20) {
      const A = { x: sl.l + sl.w, y: sl.t + 70 };
      const sy = clampY(A.y), sx = P.x, mx = (sx + A.x) / 2;
      d_ = `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${A.y} L ${A.x} ${A.y}`;
      labels.push({ x: sx - 10, y: sy - 6, anchor: 'end', text: near, delay: labelDelay });
      labels.push({ x: A.x + 10, y: A.y - 6, anchor: 'start', text: far, delay: labelDelay });
    } else if (sl.l >= P.x + P.w - 20) {
      const A = { x: sl.l, y: sl.t + 70 };
      const sy = clampY(A.y), sx = P.x + P.w, mx = (sx + A.x) / 2;
      d_ = `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${A.y} L ${A.x} ${A.y}`;
      labels.push({ x: sx + 10, y: sy - 6, anchor: 'start', text: near, delay: labelDelay });
      labels.push({ x: A.x - 10, y: A.y - 6, anchor: 'end', text: far, delay: labelDelay });
    } else {
      const cx = sl.l + sl.w / 2;
      const below = sl.t > P.y + P.h / 2;
      const A = below ? { x: cx, y: sl.t } : { x: cx, y: sl.t + 170 };
      const S = below ? { x: P.x + P.w / 2, y: P.y + P.h } : { x: P.x + P.w / 2, y: P.y };
      const my = (S.y + A.y) / 2;
      d_ = `M ${S.x} ${S.y} L ${S.x} ${my} L ${A.x} ${my} L ${A.x} ${A.y}`;
      labels.push({ x: (S.x + A.x) / 2 + 8, y: my - 6, anchor: 'start', text: `${near}:${far}`, delay: labelDelay });
    }
    connectors.push({ d: d_, delay });
  });

  return {
    dialect: d,
    person: {
      title: entityTitle('person', d),
      badge: `1 ${UNITS[d][0]}`,
      rows: personRows(d),
      slot: personSlot,
    },
    satellites,
    connectors,
    labels,
  };
}
