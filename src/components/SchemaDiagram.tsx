import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildDiagram, Roll, Row, STAGE_H, STAGE_W } from '../schema';

export function Corners() {
  return (
    <>
      <i className="corner tl" aria-hidden="true" />
      <i className="corner tr" aria-hidden="true" />
      <i className="corner bl" aria-hidden="true" />
      <i className="corner br" aria-hidden="true" />
    </>
  );
}

function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="ent-body">
      {rows.map((r, i) => (
        <div key={i} className={`ent-row${r.indent ? ' indent' : ''}${r.keyBg ? ' key' : ''}`}>
          <span>
            {r.key}
            {r.marker && <> <b>{r.marker}</b></>}
          </span>
          <span className={`ent-val${r.accent ? ' accent' : ''}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

interface Props { roll: Roll }

export default function SchemaDiagram({ roll }: Props) {
  const diagram = useMemo(() => buildDiagram(roll), [roll]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(STAGE_W);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = Math.min(1, width / STAGE_W);
  const frameStyle: React.CSSProperties = { height: STAGE_H * scale };
  const stageStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    marginLeft: Math.max(0, (width - STAGE_W * scale) / 2),
  };

  const d = diagram.dialect;
  const { person } = diagram;

  return (
    <div className="diagram-wrap" ref={wrapRef}>
      <div className="diagram-frame" style={frameStyle}>
        <div className="diagram-stage" style={stageStyle}>
          <svg
            className="diagram-svg"
            width={STAGE_W}
            height={STAGE_H}
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            aria-hidden="true"
          >
            {diagram.connectors.map((c, i) => (
              <path
                key={i}
                d={c.d}
                pathLength={1}
                className={`ln-${d}`}
                style={{ animationDelay: `${c.delay}s` }}
              />
            ))}
            {diagram.labels.map((lb, i) => (
              <text
                key={i}
                x={lb.x}
                y={lb.y}
                textAnchor={lb.anchor}
                style={{ animationDelay: `${lb.delay}s` }}
              >
                {lb.text}
              </text>
            ))}
          </svg>

          <div
            className="card blueprint hoverable ent"
            style={{ left: person.slot.l, top: person.slot.t, width: person.slot.w, animationDelay: '.1s' }}
          >
            <Corners />
            <div className="ent-head person">
              <span className={`ent-title ${d}`}>{person.title}</span>
              <span className="ent-badge">{person.badge}</span>
            </div>
            <Rows rows={person.rows} />
          </div>

          {diagram.satellites.map(ent => (
            <a
              key={ent.id}
              href={ent.href}
              className="card blueprint hoverable ent ent-link"
              style={{ left: ent.slot.l, top: ent.slot.t, width: ent.slot.w, animationDelay: `${ent.delay}s` }}
              aria-label={`Jump to ${ent.id}`}
            >
              <Corners />
              <div className={`ent-head ${d}`}>
                <span className={`ent-title ${d}`}>{ent.title}</span>
                <span className="ent-badge tag tag-accent">{ent.badge}</span>
              </div>
              <Rows rows={ent.rows} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
