# Portfolio — Jai Li

A single-page personal portfolio styled as a database schema. The hero is an
entity-relationship diagram that draws itself on load; below it are Experience,
Projects, Skills, Education, and Contact. Live at
[lijw07.github.io/portfolio](https://lijw07.github.io/portfolio/).

## Design

"Industry" — a blueprint/wireframe aesthetic: light technical ground, a single
accent hue, square corners everywhere, and hairline-bordered "blueprint objects"
with `+` registration marks at the corners. Headings are Barlow Condensed, body
is Barlow, schema text is the system monospace stack. Dark mode follows the OS.

### Per-visit randomization

Every page load rolls once (`roll()` in `src/schema.ts`) and renders consistently:

- **Engine dialect** — PostgreSQL, MongoDB, or DynamoDB. Changes entity titles,
  field types, row-count badges, header treatment, connector line style, and the
  nav brand line (`JAI_LI.SCHEMA · <engine> · rev a.b.c`).
- **Layout** — one of four six-slot arrangements on a 1120×680 stage.
- **PERSON placement** — a random slot; the five satellites shuffle into the rest.
- **Accent hue** — one of six OKLCH hues (steel, teal, green, olive, rust, violet).
  The whole ramp derives from `--accent-h`, so contrast is identical for every hue.

## Structure

```
src/
├── index.css                   # Design tokens + shared component classes (.blueprint, .card, .btn, .tag, .table)
├── App.css                     # Page layout and section styles
├── App.tsx                     # Nav, hero, sections, modal wiring
├── content.ts                  # All copy: bio, experience, projects, skills, education, links
├── schema.ts                   # Roll + diagram model (dialect rows, layouts, connector geometry) — pure functions
└── components/
    ├── SchemaDiagram.tsx       # Scaled ER diagram (ResizeObserver → transform: scale)
    └── Modals.tsx              # Play/trailer modal and Formspree contact form
public/
├── tower-defense/, 2048/       # Godot web exports, embedded in the play modal
├── paws-and-hooves/            # Unity WebGL build
└── Index_Paws_And_Hooves_Trailer_compressed.mp4
```

Edit copy in `src/content.ts`; retune the look in `src/index.css`.

## Contact

The Email button opens a form that posts to Formspree, so the address never
appears in the DOM. Change the destination via `LINKS.contactEndpoint` in
`src/content.ts`.

## Development

```bash
npm install
npm start        # http://localhost:3000/portfolio
npm run build
npm run deploy   # gh-pages
```

React 19 + TypeScript on Create React App; deployed to GitHub Pages by the
workflow in `.github/workflows/deploy.yml` on push to `master`.
