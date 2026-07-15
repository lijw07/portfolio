import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';
import { GAMES, deriveGame, fmtCount, fmtTime, DerivedGame, CategoryKey } from './games';

const PUBLIC = process.env.PUBLIC_URL || '';
const HEADSHOT = `${PUBLIC}/headshot.jpg`;
const RESUME = `${PUBLIC}/Resume_2026_2027.pdf`;

// --- Contact form: assemble the address in JS so it never sits in the DOM (anti-scraping). ---
// Formspree endpoint — POSTs the message as JSON; Formspree emails it to the inbox
// configured on the form. Swap this URL to change the destination.
const CONTACT_ENDPOINT = 'https://formspree.io/f/meewbgqz';
const CONTACT = {
  github: 'https://github.com/lijw07',
  linkedin: 'https://www.linkedin.com/in/jai-li-va/',
  resume: '',
};

const PAGE_KEY = 'gamedeck_page_v1';
const PLAYS_KEY = 'gamedeck_plays_v2';
const TIMES_KEY = 'gamedeck_time_v2';

type Page = 'about' | 'games';
type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

// Games are grouped into labeled sections by how you play them (each game's `category` field).
const CATEGORIES: { key: CategoryKey; label: string; blurb: string }[] = [
  { key: 'web', label: 'Play in Browser', blurb: 'Jump straight in — these run right here, no download.' },
  { key: 'download', label: 'Download to Play', blurb: 'Bigger builds you grab and run locally — watch the trailer here.' },
  { key: 'dev', label: 'In Development', blurb: 'Works in progress — coming soon.' },
];

function readMap(key: string): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function seededMap(stored: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  GAMES.forEach(g => { out[g.id] = stored[g.id] != null ? stored[g.id] : 0; });
  return out;
}

const DIAMONDS = [
  ['TOWER DEFENSE', '#ef4444'],
  ['2048', '#edc22e'],
  ['PAWS & HOOVES', '#14b8a6'],
  ['TANKS!', '#f59e0b'],
  ['ZOMBIE SURVIVAL', '#7c3aed'],
  ['CRAFTING QUEST', '#0ea5e9'],
] as const;

function MarqueeSpan() {
  // two copies of the list so a single span is already a full loop
  const items = [...DIAMONDS, ...DIAMONDS];
  return (
    <span>
      {items.map(([label, color], i) => (
        <React.Fragment key={i}>
          {'  '}{label}{'  '}
          <span style={{ color }}>◆</span>
        </React.Fragment>
      ))}
      {'  '}
    </span>
  );
}

function PhotoSlot() {
  const [ok, setOk] = useState(true);
  return (
    <div className="gd-photo">
      <div className="gd-stripe" />
      {ok ? (
        <img src={HEADSHOT} alt="Jai Li" onError={() => setOk(false)} />
      ) : (
        <div className="gd-photo-ph">your photo</div>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>(() => {
    const p = localStorage.getItem(PAGE_KEY);
    return p === 'games' || p === 'about' ? p : 'about';
  });
  const [dark, setDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [plays, setPlays] = useState<Record<string, number>>(() => seededMap(readMap(PLAYS_KEY)));
  const [times, setTimes] = useState<Record<string, number>>(() => seededMap(readMap(TIMES_KEY)));
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>('idle');
  const [contactError, setContactError] = useState('');
  const [form, setForm] = useState({ email: '', subject: '', message: '' });

  const panelRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string | null>(null);
  const sessionStart = useRef<number | null>(null);

  // ---- theme follows the OS ----
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.classList.toggle('gd-dark', mql.matches);
      setDark(mql.matches);
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  // ---- persist page ----
  useEffect(() => { localStorage.setItem(PAGE_KEY, page); }, [page]);

  // ---- session time tracking ----
  const flushSession = useCallback(() => {
    if (sessionId.current == null || sessionStart.current == null) return;
    const id = sessionId.current;
    const elapsed = Math.round((Date.now() - sessionStart.current) / 1000);
    sessionId.current = null;
    sessionStart.current = null;
    if (elapsed <= 0) return;
    setTimes(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + elapsed };
      try { localStorage.setItem(TIMES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const closePlay = useCallback(() => {
    flushSession();
    setPlayingId(null);
  }, [flushSession]);

  // ---- global listeners ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Esc closes the help overlay first, then the game.
      if (showHelp) setShowHelp(false);
      else closePlay();
    };
    const onHide = () => flushSession();
    window.addEventListener('keydown', onKey);
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pagehide', onHide);
      flushSession();
    };
  }, [closePlay, flushSession, showHelp]);

  // ---- lock page scroll while an overlay is open ----
  useEffect(() => {
    const locked = contactOpen || playingId != null;
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [contactOpen, playingId]);

  const goPage = (p: Page) => { setPage(p); window.scrollTo(0, 0); };

  const play = useCallback((id: string) => {
    flushSession();
    sessionId.current = id;
    sessionStart.current = Date.now();
    setPlays(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      try { localStorage.setItem(PLAYS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    // Surface how-to-play up front for games that ship instructions.
    setShowHelp(!!GAMES.find(g => g.id === id)?.instructions);
    setPlayingId(id);
  }, [flushSession]);

  const toggleFullscreen = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }, []);

  // ---- contact ----
  const openContact = () => { setContactStatus('idle'); setContactError(''); setContactOpen(true); };
  const closeContact = () => setContactOpen(false);
  const openLink = (key: 'github' | 'linkedin' | 'resume') => {
    const url = CONTACT[key];
    if (url) window.open(url, '_blank', 'noopener');
  };
  const sendContact = async () => {
    if (!form.email || !form.message) {
      setContactStatus('error');
      setContactError('Please add your email and a message.');
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setContactStatus('error');
      setContactError('Messaging isn’t connected yet — a form endpoint still needs to be wired up.');
      return;
    }
    setContactStatus('sending');
    setContactError('');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, subject: form.subject || '(no subject)', message: form.message }),
      });
      if (res.ok) { setContactStatus('sent'); setForm({ email: '', subject: '', message: '' }); }
      else { setContactStatus('error'); setContactError('Could not send right now. Please try again.'); }
    } catch {
      setContactStatus('error');
      setContactError('Network error. Please try again.');
    }
  };

  // ---- derived game data ----
  const games: DerivedGame[] = useMemo(
    () => GAMES.map(g => deriveGame(g, plays[g.id] ?? 0, times[g.id] ?? 0)),
    [plays, times]
  );
  const total = games.reduce((a, g) => a + g.count, 0);
  const totalSecs = games.reduce((a, g) => a + g.secs, 0);
  const nowPlaying = games.find(g => g.id === playingId) || null;

  const appStyle = {
    ['--bg-pattern' as any]: `url('${PUBLIC}/assets/sprites/bg-pattern-${dark ? 'd' : 'l'}.png')`,
  } as React.CSSProperties;

  return (
    <div className={`gd-app ${page === 'games' ? 'is-games' : 'is-about'}`} style={appStyle}>
      {/* NAV */}
      <nav className="gd-nav">
        <div className="gd-brand">
          <span className="gd-wordmark">Jai Li</span>
        </div>
        <div className="gd-segment centered">
          <button className={`gd-pill${page === 'about' ? ' active' : ''}`} onClick={() => goPage('about')}>About</button>
          <button className={`gd-pill${page === 'games' ? ' active' : ''}`} onClick={() => goPage('games')}>Games</button>
        </div>
        <div className="gd-nav-right" aria-hidden="true" />
      </nav>

      {/* GAMES PAGE */}
      {page === 'games' && (
        <>
          <div className="gd-marquee">
            <div className="gd-marquee-track">
              <MarqueeSpan />
              <MarqueeSpan />
            </div>
          </div>

          {/* HERO */}
          <header className="gd-hero">
            <img className="gd-sprite" src={`${PUBLIC}/assets/sprites/sword.png`} alt="" style={{ left: '5%', top: 44, width: 46, ['--r' as any]: '-10deg', animationDuration: '5s' }} />
            <img className="gd-sprite" src={`${PUBLIC}/assets/sprites/gem.png`} alt="" style={{ right: '8%', top: 30, width: 48, ['--r' as any]: '8deg', animationDuration: '6s', animationDelay: '.4s' }} />
            <img className="gd-sprite" src={`${PUBLIC}/assets/sprites/coin.png`} alt="" style={{ left: '10%', bottom: 2, width: 50, ['--r' as any]: '12deg', animationDuration: '4.6s', animationDelay: '.8s' }} />
            <img className="gd-sprite" src={`${PUBLIC}/assets/sprites/heart.png`} alt="" style={{ right: '5%', bottom: 16, width: 58, ['--r' as any]: '0deg', animationDuration: '5.4s', animationDelay: '.2s' }} />
            <h1>PRESS <span className="accent">START</span><span className="gd-cursor">_</span></h1>
            <p className="gd-hero-sub">A collection of games I've built.</p>
            <div className="gd-chips">
              <div className="gd-chip red"><span>♦</span> {fmtCount(total)} total plays</div>
              <div className="gd-chip"><span>▲</span> {games.length} games</div>
              <div className="gd-chip"><span>⏱</span> {fmtTime(totalSecs)} played</div>
            </div>
          </header>

          <div className="gd-games-wrap">
            {CATEGORIES.map(cat => {
              const list = games.filter(g => g.category === cat.key);
              if (list.length === 0) return null;
              return (
                <section className="gd-cat" key={cat.key}>
                  <div className="gd-section-head">
                    <h2>{cat.label}</h2>
                    <span className="gd-cat-blurb">{cat.blurb}</span>
                  </div>
                  <div className="gd-grid">
                    {list.map(g => <GameCard key={g.id} g={g} onPlay={play} />)}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {/* ABOUT PAGE */}
      {page === 'about' && (
        <div className="gd-about">
          <div className="gd-intro">
            <PhotoSlot />
            <div>
              <div className="gd-eyebrow">Hello, I'm</div>
              <h1 className="gd-name">Jai Li</h1>
              <div className="gd-role">Software Engineer &amp; Indie Game Developer</div>
              <p className="gd-bio">I'm an agile software engineer and indie game developer. I've built enterprise software with Java and Spring Boot, and I design and ship my own games in Unity and Godot — playable right here on this site.</p>
              <div className="gd-aboutbtns">
                <button className="gd-btn gd-abtn dark" onClick={openContact}>✉ Email me</button>
                <button className="gd-btn gd-abtn light" onClick={() => openLink('github')}>&lt;/&gt; GitHub</button>
                <button className="gd-btn gd-abtn light" onClick={() => openLink('linkedin')}>in LinkedIn</button>
                <a className="gd-btn gd-abtn amber" href={RESUME} download="Jai_Li_Resume.pdf" target="_blank" rel="noopener noreferrer">⬇ Résumé</a>
              </div>
            </div>
          </div>

          <h2 className="gd-h2"><span className="sq" style={{ background: '#ef4444' }} />Skills &amp; Tools</h2>
          <div className="gd-skillgrid">
            <SkillCard color="#ef4444" title="Languages" tags={['Java', 'C#', 'SQL']} />
            <SkillCard color="#14b8a6" title="Frameworks" tags={['Spring Boot', 'ASP.NET', 'Entity Framework']} />
            <SkillCard color="#0ea5e9" title="DevOps & APIs" tags={['Docker', 'Kubernetes', 'RESTful APIs', 'AWS', 'GCP', 'xUnit', 'JUnit', 'JDBC', 'JWT']} />
            <SkillCard color="#7c3aed" title="Databases" tags={['MySQL', 'NoSQL', 'MongoDB', 'SQL Server', 'H2']} />
            <SkillCard color="#f59e0b" title="Game & Creative" tags={['Unity', 'Godot', 'Blender', 'Aseprite']} />
          </div>

          <h2 className="gd-h2"><span className="sq" style={{ background: '#14b8a6' }} />Experience</h2>
          <div className="gd-timeline">
            <TimelineEntry
              role="Patent Examiner" date="2025 — Present" company="United States Patent and Trademark Office" color="#ef4444"
              bullets={['Review patent applications for compliance with U.S. patent law and regulations.', 'Research prior art and evaluate the novelty of technical inventions.']}
            />
            <TimelineEntry
              role="Software Engineer" date="2022 — 2024" company="Brightspot" color="#14b8a6"
              bullets={['Built and shipped features on an enterprise content management platform using Java and Spring Boot.', 'Delivered client sites for major media and brand customers — NPR, WGBH, PBS SoCal, and Google.']}
            />
            <TimelineEntry
              role="Freelance Developer" date="2022 — Present" company="Independent" color="#f59e0b" last
              bullets={['Build web-based applications for clients — full-stack sites, dashboards, and internal tools.', 'Design and ship custom browser games and interactive experiences end to end.']}
            />
          </div>

          <h2 className="gd-h2"><span className="sq" style={{ background: '#0ea5e9' }} />Education</h2>
          <div className="gd-edugrid">
            <EduCard deg="M.S." school="Georgia Tech" color="#0ea5e9" note="Graduate study in computer science." />
            <EduCard deg="B.S." school="Virginia Commonwealth University" color="#7c3aed" note="Undergraduate degree in computer science." />
            <EduCard deg="A.S." school="Northern Virginia Community College" color="#ef4444" note="Associate study before transferring to VCU." />
          </div>

          <div className="gd-cta">
            <h2>Let's build something fun.</h2>
            <p>Open to game dev roles, freelance projects, and collaborations. Take a look at what I've made.</p>
            <button className="gd-btn gd-cta-btn" onClick={openContact}>✉ Get in touch</button>
          </div>
        </div>
      )}

      {/* PLAY OVERLAY */}
      {nowPlaying && (
        <div className="gd-overlay" onClick={closePlay}>
          <div className="gd-panel" ref={panelRef} onClick={e => e.stopPropagation()}>
            <div className="gd-panel-head" style={{ background: nowPlaying.color }}>
              <div className="gd-panel-left">
                <button className="gd-panel-btn" onClick={closePlay}>← All games</button>
                <div style={{ minWidth: 0 }}>
                  <div className="gd-panel-title">{nowPlaying.title}</div>
                  <div className="gd-panel-sub">{nowPlaying.genre} · {nowPlaying.playsLabel} plays</div>
                </div>
              </div>
              <div className="gd-panel-actions">
                {nowPlaying.instructions && (
                  <button className="gd-panel-btn" onClick={() => setShowHelp(s => !s)}>❔ How to play</button>
                )}
                <button className="gd-panel-btn" onClick={toggleFullscreen}>⛶ Fullscreen</button>
              </div>
            </div>
            <div className="gd-viewport">
              {nowPlaying.hasEmbed && (
                <iframe
                  src={nowPlaying.embedUrl}
                  title={nowPlaying.title}
                  allow="autoplay; fullscreen; gamepad; microphone"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
                  allowFullScreen
                />
              )}
              {nowPlaying.isTrailer && nowPlaying.trailerIsVideo && (
                <video
                  src={nowPlaying.trailerUrl}
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onLoadedMetadata={e => { (e.target as HTMLVideoElement).volume = 0.05; }}
                />
              )}
              {nowPlaying.isTrailer && !nowPlaying.trailerIsVideo && (
                <iframe
                  src={nowPlaying.trailerUrl}
                  title={nowPlaying.title}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
              {nowPlaying.noMedia && (
                <div className="gd-placeholder">
                  <div className="big">{nowPlaying.title}</div>
                  <div className="badge">▶ GAME OR TRAILER GOES HERE</div>
                  <div className="note">A playable build (WebGL / HTML5) or a trailer for this game can be wired up to fill this slot.</div>
                </div>
              )}
              {nowPlaying.instructions && showHelp && (
                <div className="gd-help" onClick={() => setShowHelp(false)}>
                  <div className="gd-help-card" onClick={e => e.stopPropagation()}>
                    <div className="gd-help-head">
                      <div className="gd-help-title">How to play</div>
                      <button className="gd-help-x" onClick={() => setShowHelp(false)} aria-label="Close instructions">✕</button>
                    </div>
                    <p className="gd-help-goal">{nowPlaying.instructions.goal}</p>
                    <div className="gd-help-controls">
                      {nowPlaying.instructions.controls.map((c, i) => (
                        <div className="gd-help-ctl" key={i}>
                          <span className="gd-help-keys">{c.keys}</span>
                          <span className="gd-help-act">{c.action}</span>
                        </div>
                      ))}
                    </div>
                    {nowPlaying.instructions.tips && nowPlaying.instructions.tips.length > 0 && (
                      <>
                        <div className="gd-help-tiplabel">Tips</div>
                        <ul className="gd-help-tips">
                          {nowPlaying.instructions.tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </>
                    )}
                    <button className="gd-btn gd-help-go" style={{ background: nowPlaying.color }} onClick={() => setShowHelp(false)}>▶ Got it, let's play</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div className="gd-overlay contact" onClick={closeContact}>
          <div className="gd-modal" onClick={e => e.stopPropagation()}>
            <div className="gd-modal-head">
              <div className="title">Send me a message</div>
              <button className="gd-modal-x" onClick={closeContact}>✕</button>
            </div>
            {contactStatus !== 'sent' ? (
              <div className="gd-form">
                <label>Your email
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@domain.com" />
                </label>
                <label>Subject
                  <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" />
                </label>
                <label>Message
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message…" />
                </label>
                {contactError && <div className="err">{contactError}</div>}
                <button className="gd-btn gd-send" onClick={sendContact} disabled={contactStatus === 'sending'}>
                  {contactStatus === 'sending' ? 'Sending…' : '✉ Send message'}
                </button>
              </div>
            ) : (
              <div className="gd-sent">
                <div className="tick">✓</div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out — I'll get back to you soon.</p>
                <div className="gd-sent-btns">
                  <button className="gd-btn gd-abtn light" onClick={() => { setContactStatus('idle'); setContactError(''); }}>Send another</button>
                  <button className="gd-btn gd-abtn dark" onClick={closeContact}>Done</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GameCard({ g, onPlay }: { g: DerivedGame; onPlay: (id: string) => void }) {
  const dim = g.dimmed ? ' dimmed' : '';
  return (
    <article className="gd-card">
      <div className="gd-cover" style={{ background: g.color }}>
        {g.cover && <img className={`gd-cover-img${g.coverSmooth ? ' smooth' : ''}`} src={g.cover} alt="" />}
        {g.wip && <div className="gd-wip-banner">⚠ Under Construction ⚠</div>}
        {!g.cover && <div className="gd-stripe" />}
        {g.cover && <div className="gd-cover-scrim" />}
        <div className="gd-cover-title">{g.title}</div>
      </div>
      <div className="gd-card-body">
        <div className="gd-card-meta">
          <span className="gd-genre">{g.genre}</span>
          <span className="gd-counts">▷ {g.playsLabel} plays<br />⏱ {g.timeLabel} played</span>
        </div>
        <p className="gd-tagline">{g.tagline}</p>
        {g.category === 'download' && g.downloadUrl && (
          <a className="gd-btn gd-download" href={g.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ background: g.color }}>⬇ Download to play</a>
        )}
        <div className="gd-btnrow">
          <button className={`gd-btn gd-play${dim}`} onClick={() => onPlay(g.id)}>{g.cta}</button>
          <a className={`gd-btn gd-code${dim}`} href={g.resolvedRepo} target="_blank" rel="noopener noreferrer" title="View source on GitHub">&lt;/&gt; Code</a>
        </div>
      </div>
    </article>
  );
}

function SkillCard({ color, title, tags }: { color: string; title: string; tags: string[] }) {
  return (
    <div className="gd-skillcard">
      <div className="gd-skillhead">
        <span className="sq" style={{ background: color }} />
        <h3>{title}</h3>
      </div>
      <div className="gd-pills">
        {tags.map(t => <span className="gd-tag" key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function TimelineEntry({ role, date, company, color, bullets, last }: {
  role: string; date: string; company: string; color: string; bullets: string[]; last?: boolean;
}) {
  return (
    <div className="gd-tl-row">
      <div className="gd-tl-marker">
        <div className={`gd-tl-line${last ? ' half' : ''}`} />
        <div className="gd-tl-dot" style={{ background: color }} />
      </div>
      <div className={`gd-tl-card${last ? ' last' : ''}`}>
        <div className="gd-tl-top">
          <h3>{role}</h3>
          <span className="gd-datepill">{date}</span>
        </div>
        <div className="gd-company" style={{ color }}>{company}</div>
        <ul>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
      </div>
    </div>
  );
}

function EduCard({ deg, school, color, note }: { deg: string; school: string; color: string; note: string }) {
  return (
    <div className="gd-educard">
      <span className="gd-datepill">{deg}</span>
      <h3>{school}</h3>
      <div className="gd-edudeg" style={{ color }}>Computer Science</div>
      <p>{note}</p>
    </div>
  );
}

export default App;
