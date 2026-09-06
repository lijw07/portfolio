const PUBLIC = process.env.PUBLIC_URL || '';

export const BIO =
  "I'm a software engineer who builds things to make life more convenient and efficient — enterprise systems in Java and Spring Boot, tools that automate the tedious parts of my own work, and games I design in Unity and Godot.";

export const LINKS = {
  github: 'https://github.com/lijw07',
  linkedin: 'https://www.linkedin.com/in/jai-li-va/',
  contactEndpoint: 'https://formspree.io/f/meewbgqz',
};

export interface Experience { role: string; company: string; period: string; notes: string }

export const EXPERIENCE: Experience[] = [
  {
    role: 'Patent Examiner',
    company: 'U.S. Patent and Trademark Office',
    period: 'Oct 2025 — present',
    notes: 'Examines applications in Technology Center 2600 (optical, display, imaging, communications); prior-art searches across U.S., foreign, and non-patent literature; drafts Office actions with §101, §102, §103, and §112 rejections per the MPEP.',
  },
  {
    role: 'Software Engineer II',
    company: 'Brightspot',
    period: 'Jun 2022 — Jun 2024',
    notes: 'Java servlets, annotation-driven MVC view models, and REST APIs for a headless enterprise CMS; rich-text editors, fuzzy site search, type-safe jOOQ queries; content schemas and bulk migration tools; Gradle builds shipped via CI/CD to Docker/Kubernetes.',
  },
];

export interface Media { title: string; url: string; video: boolean }

export interface ProjectAction { label: string; media: Media }

export interface Project {
  title: string;
  tag: string;
  description: string;
  stack: string[];
  when?: string;
  source?: string;
  action?: ProjectAction;
}

export const PROJECTS: Project[] = [
  {
    title: 'SLOP — AI Prior Art Search',
    tag: 'ai tool',
    description: "AI-assisted tool that surfaces relevant U.S. and foreign prior art from an application's claims. Spring Boot backend orchestrating a local LLM (Qwen2.5 via Ollama) and a Google Patents scraper in a ReAct-style loop; MongoDB persistence, streaming endpoints, guardrails against unreliable LLM output.",
    stack: ['java 17', 'spring boot', 'mongodb'],
    when: '2026 →',
  },
  {
    title: 'CAMS',
    tag: 'full-stack',
    description: 'Multi-tenant application management system: React + ASP.NET Core + Entity Framework with secured REST APIs; PostgreSQL, MySQL, Oracle, SQL Server, MongoDB, and DynamoDB behind a concurrent migration layer; OAuth 2.0 / JWT, role-based access control, audit logging; Docker + Kubernetes via GitHub Actions.',
    stack: ['react', 'asp.net core', '6 databases'],
    when: '2025 →',
  },
  {
    title: 'Tower Defense',
    tag: 'game',
    description: 'Real-time tower defense in Godot 4 / GDScript with Resource-driven wave and enemy authoring, Path2D pathing, signal-driven Area2D collisions, upgradeable towers, and save/load UI.',
    stack: ['godot 4', 'gdscript'],
    source: 'https://github.com/lijw07/tower-defense',
    action: { label: 'Play in browser', media: { title: 'Tower Defense', url: `${PUBLIC}/tower-defense/index.html`, video: false } },
  },
  {
    title: 'Paws and Hooves',
    tag: 'game',
    description: '3D puzzle-adventure in Unity (C#) with four playable animals whose distinct abilities drive the puzzles; NPC behavior trees, NavMesh pathfinding, day/night lighting, enemy AI, inventory.',
    stack: ['unity', 'c#'],
    source: 'https://github.com/lijw07/paws-and-hooves',
    action: { label: 'Watch trailer', media: { title: 'Paws and Hooves — Trailer', url: `${PUBLIC}/Index_Paws_And_Hooves_Trailer_compressed.mp4`, video: true } },
  },
  {
    title: '2048',
    tag: 'game',
    description: 'The classic sliding-tile puzzle, rebuilt in Godot. Slide to merge matching numbers and chase the 2048 tile — one move from a full board ends the run.',
    stack: ['godot 4', 'gdscript'],
    source: 'https://github.com/lijw07/2048',
    action: { label: 'Play in browser', media: { title: '2048', url: `${PUBLIC}/2048/2048.html`, video: false } },
  },
  {
    title: 'Pac-Man',
    tag: 'game',
    description: 'Arcade-faithful Pac-Man in Godot 4 with procedurally generated mazes that change every level, per-ghost AI personalities with scatter/chase waves and house release timing, fruit bonuses, synthesized retro sound effects, and a saved high score.',
    stack: ['godot 4', 'gdscript'],
    source: 'https://github.com/lijw07/pacman',
    action: { label: 'Play in browser', media: { title: 'Pac-Man', url: `${PUBLIC}/pacman/index.html`, video: false } },
  },
  {
    title: 'CoStar Extraction Pipeline',
    tag: 'pipeline',
    description: 'Dockerized Python/AWS serverless pipeline (Chalice, Lambda, S3) that ingested and translated 20,000+ multilingual lease PDFs; SNS/SQS queuing and ML models extracting tenant names, addresses, rent, and lease terms.',
    stack: ['python', 'aws', 'pandas'],
    when: '2021 — 2022',
  },
];

export interface SkillGroup { category: string; items: string[] }

export const SKILLS: SkillGroup[] = [
  { category: 'languages', items: ['Java', 'Python', 'C#', 'SQL'] },
  { category: 'frameworks', items: ['Spring Boot', 'ASP.NET Core', 'Entity Framework', 'React', 'Flask', 'Unity', 'Godot'] },
  { category: 'build_cicd', items: ['Maven', 'Gradle', 'npm', 'Jenkins', 'GitHub', 'Docker', 'Kubernetes'] },
  { category: 'cloud_tools', items: ['AWS (S3, RDS, Lambda, Chalice, SNS/SQS)', 'Linux/UNIX', 'Postman', 'Swagger/OpenAPI'] },
  { category: 'databases', items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'MongoDB', 'DynamoDB'] },
];

export interface Education { degree: string; school: string; detail: string }

export const EDUCATION: Education[] = [
  { degree: 'M.S.', school: 'Georgia Institute of Technology', detail: 'M.S. Computer Science · Jan 2025 — present · GPA 4.0' },
  { degree: 'B.S.', school: 'Virginia Commonwealth University', detail: 'B.S. Computer Science, College of Engineering · Jan 2020 — May 2022' },
  { degree: 'A.S.', school: 'Northern Virginia Community College', detail: 'A.S. Computer Science · Sep 2018 — Jan 2020' },
];
