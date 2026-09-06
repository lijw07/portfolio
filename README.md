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
├── index.css                   design tokens + shared component classes (.blueprint, .card, .btn, .tag, .table)
├── App.css                     page layout and section styles
├── App.tsx                     nav, hero, sections, modal wiring
├── content.ts                  all copy: bio, experience, projects, skills, education, links
├── schema.ts                   roll + diagram model (dialect rows, layouts, connector routing) — pure functions
├── gameAudio.ts                primes an AudioContext on the play click so iOS Safari lets the game play sound
└── components/
    ├── Corners.tsx             the four + registration marks used by every blueprint card
    ├── SchemaDiagram.tsx       scaled ER diagram (ResizeObserver → transform: scale)
    └── Modals.tsx              play/trailer modal and Formspree contact form
public/
├── index.html                  document shell, meta tags, JSON-LD
├── analytics.js                Google Analytics bootstrap
├── 2048/, tower-defense/, pacman/, flappy-bird/
│                               Godot web exports, embedded in the play modal
├── GODOT-LICENSE.txt           MIT notice for the Godot runtime files above
└── Index_Paws_And_Hooves_Trailer_compressed.mp4
```

Edit copy in `src/content.ts`; retune the look in `src/index.css`.

## Adding a Godot game

1. Export the Web preset from the Godot editor with the executable name `index`.
2. Copy the export (`index.html`, `index.js`, `index.wasm`, `index.pck`, both
   `index.audio.*.worklet.js` files, and the PNG icons) into `public/<game>/`.
3. Add an iOS audio handoff to the shell: copy the `<script>` in the `<head>` of
   `public/tower-defense/index.html` into the new `index.html` — or set it as
   `html/head_include` in the game's `export_presets.cfg` so every export carries it.
4. Add a card to `PROJECTS` in `src/content.ts`:

   ```ts
   action: { label: 'Play in browser', media: { title: 'Name', url: `${PUBLIC}/<game>/index.html`, video: false } }
   ```

(2048 predates this convention and keeps its `2048.*` file names.)

## Contact

The Email button opens a form that posts to Formspree, so the address never
appears in the DOM. Change the destination via `LINKS.contactEndpoint` in
`src/content.ts`.

## Development

```bash
npm install
npm start
npm run build
npm run deploy
```

React 19 + TypeScript on Create React App; deployed to GitHub Pages by the
workflow in `.github/workflows/deploy.yml` on push to `master`.
