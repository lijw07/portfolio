import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { brandLine, roll, Roll, SECTIONS } from './schema';
import { BIO, EDUCATION, EXPERIENCE, LINKS, Media, ProjectAction, PROJECTS, SKILLS } from './content';
import SchemaDiagram from './components/SchemaDiagram';
import Corners from './components/Corners';
import { ContactModal, PlayModal } from './components/Modals';
import { primeGameAudio } from './gameAudio';

function PlayButton({ action, onOpen }: { action: ProjectAction; onOpen: (media: Media) => void }) {
  return (
    <button className="btn btn-primary" onClick={() => onOpen(action.media)}>
      {action.label}
    </button>
  );
}

function App() {
  const [visit] = useState<Roll>(roll);
  const [playing, setPlaying] = useState<Media | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-h', String(visit.hue));
  }, [visit.hue]);

  const openPlay = (media: Media) => {
    if (!media.video) primeGameAudio();
    setPlaying(media);
  };
  const closePlay = useCallback(() => setPlaying(null), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <button className="nav-brand" onClick={toTop} title="Back to top">{brandLine(visit)}</button>
        <div className="nav-links">
          {SECTIONS.map((id, i) => (
            <React.Fragment key={id}>
              {i > 0 && <span aria-hidden="true">·</span>}
              <a href={`#${id}`}>{id}</a>
            </React.Fragment>
          ))}
        </div>
      </nav>
      <div className="nav-spacer" />

      <div className="hero-zone">
        <div className="hero-grid" aria-hidden="true" />
        <header className="hero">
          <h1>Jai Li</h1>
          <p className="hero-bio">{BIO}</p>
        </header>
        <SchemaDiagram roll={visit} />
      </div>

      <main className="main">
        <section id="experience">
          <h2 className="section-title">Experience</h2>
          <div className="kicker">SELECT * FROM experience ORDER BY period DESC;</div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr><th>role</th><th>company</th><th>period</th><th>notes</th></tr>
              </thead>
              <tbody>
                {EXPERIENCE.map(x => (
                  <tr key={x.role + x.company}>
                    <td>{x.role}</td>
                    <td>{x.company}</td>
                    <td className="nowrap">{x.period}</td>
                    <td>{x.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="projects">
          <h2 className="section-title">Projects</h2>
          <div className="kicker">SELECT * FROM projects WHERE person_id = 'jai_li';</div>
          <div className="grid-projects">
            {PROJECTS.map(p => (
              <article key={p.title} className="card blueprint hoverable proj">
                <Corners />
                <div className="proj-head">
                  <h3>{p.title}</h3>
                  <span className="tag tag-outline">{p.tag}</span>
                </div>
                <p>{p.description}</p>
                <div className="proj-meta">
                  <span className="k">stack:</span> {p.stack.join(' · ')} ·{' '}
                  {p.source
                    ? <a href={p.source} target="_blank" rel="noopener noreferrer">source →</a>
                    : <span className="k">{p.when}</span>}
                </div>
                {p.action && <PlayButton action={p.action} onOpen={openPlay} />}
              </article>
            ))}
          </div>
        </section>

        <section id="skills">
          <h2 className="section-title">Skills</h2>
          <div className="kicker">SELECT name FROM skills GROUP BY category;</div>
          <div className="grid-skills">
            {SKILLS.map((g, gi) => (
              <div key={g.category} className="card blueprint skill">
                <Corners />
                <div className="skill-cat">category = '{g.category}'</div>
                <div className="skill-tags">
                  {g.items.map(s => (
                    <span key={s} className={`tag ${gi === 0 ? 'tag-accent' : 'tag-outline'}`}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education">
          <h2 className="section-title">Education</h2>
          <div className="kicker">SELECT degree, school FROM education;</div>
          <div className="grid-edu">
            {EDUCATION.map(e => (
              <div key={e.school} className="card blueprint edu">
                <Corners />
                <span className="tag tag-accent">{e.degree}</span>
                <h3>{e.school}</h3>
                <div className="edu-detail">{e.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="kicker">COMMIT; -- let's build something</div>
          <h2>Get in touch</h2>
          <div className="contact-btns">
            <button className="btn btn-primary" onClick={() => setContactOpen(true)}>Request data dump</button>
            <a className="btn btn-secondary" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn btn-secondary" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </section>
      </main>

      {playing && <PlayModal media={playing} onClose={closePlay} />}
      {contactOpen && <ContactModal onClose={closeContact} />}
    </>
  );
}

export default App;
