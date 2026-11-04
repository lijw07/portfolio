import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { brandLine, roll, Roll, SECTIONS } from './schema';
import { BIO, EDUCATION, EXPERIENCE, LINKS, Media, Project, ProjectAction, PROJECTS, SKILLS } from './content';
import SchemaDiagram from './components/SchemaDiagram';
import Corners from './components/Corners';
import { ContactModal, PlayModal } from './components/Modals';
import { primeGameAudio } from './gameAudio';

const TOUCH_ONLY_QUERY = '(hover: none) and (pointer: coarse)';

function useTouchOnly(): boolean {
  const [touchOnly, setTouchOnly] = useState(() => window.matchMedia(TOUCH_ONLY_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(TOUCH_ONLY_QUERY);
    const update = () => setTouchOnly(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return touchOnly;
}

function PlayButton({ action, onOpen, touchOnly }: { action: ProjectAction; onOpen: (media: Media) => void; touchOnly: boolean }) {
  if (action.desktopOnly && touchOnly) {
    return <button className="btn btn-secondary" disabled>No mobile support</button>;
  }
  return (
    <button className="btn btn-primary" onClick={() => onOpen(action.media)}>
      {action.label}
    </button>
  );
}

const isGame = (project: Project) => project.tag === 'game';

const PROJECT_GROUPS = [
  { title: 'Software', query: "SELECT * FROM projects WHERE tag != 'game';", projects: PROJECTS.filter(p => !isGame(p)) },
  { title: 'Games', query: "SELECT * FROM projects WHERE tag = 'game';", projects: PROJECTS.filter(isGame) },
];

function ProjectCard({ project, onOpen, touchOnly }: { project: Project; onOpen: (media: Media) => void; touchOnly: boolean }) {
  return (
    <article className="card blueprint hoverable proj">
      <Corners />
      <div className="proj-head">
        <h3>{project.title}</h3>
        <span className="tag tag-outline">{project.tag}</span>
      </div>
      <p>{project.description}</p>
      <div className="proj-meta">
        <span className="k">stack:</span> {project.stack.join(' · ')} ·{' '}
        {project.source
          ? <a href={project.source} target="_blank" rel="noopener noreferrer">source →</a>
          : <span className="k">{project.when}</span>}
      </div>
      {project.action && <PlayButton action={project.action} onOpen={onOpen} touchOnly={touchOnly} />}
    </article>
  );
}

function App() {
  const [visit] = useState<Roll>(roll);
  const [playing, setPlaying] = useState<Media | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const touchOnly = useTouchOnly();

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
          {PROJECT_GROUPS.map(group => (
            <div key={group.title} className="project-group">
              <h3 className="group-title">{group.title}</h3>
              <div className="kicker">{group.query}</div>
              <div className="grid-projects">
                {group.projects.map(p => (
                  <ProjectCard key={p.title} project={p} onOpen={openPlay} touchOnly={touchOnly} />
                ))}
              </div>
            </div>
          ))}
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
            <div className="contact-links">
              <a className="btn btn-secondary" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn btn-secondary" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="btn btn-secondary" href={LINKS.itchio} target="_blank" rel="noopener noreferrer">itch.io</a>
            </div>
            <button className="btn btn-primary" onClick={() => setContactOpen(true)}>Request data dump</button>
          </div>
        </section>
      </main>

      {playing && <PlayModal media={playing} onClose={closePlay} />}
      {contactOpen && <ContactModal onClose={closeContact} />}
    </>
  );
}

export default App;
