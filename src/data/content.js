// Edit the arrays below to add, remove, or update entries.
// Every card on the Work page is generated from this file — no JSX editing needed.
//
// Images: drop files in public/images/ and set `src: 'images/your-file.jpg'`.
// Any slot with an empty src shows a sketch-style placeholder instead.
//
// Per entry:
//   id       — anchor used by the penguin timeline (keep it unique)
//   short    — short label shown in the timeline
//   links    — optional [{ label, href }], shown on the card and in the dialog
//   context  — optional sentence shown in the dialog (hidden while empty)
//   outcomes — optional list shown in the dialog (hidden while empty)
//   thumb    — small image on the card
//   media    — larger images in the detail dialog

export const experience = [
  {
    id: 'dietrich-lab',
    short: 'Dietrich Lab',
    title: 'Undergraduate Research Intern',
    org: 'Dietrich Lab, Duke University',
    when: 'Jan 2026 — present',
    bullets: [
      'Designed a PostgreSQL schema mapping 1,482 yeast strains across core genes and pangenome traits',
      'Built a full-stack frontend loading 10,000+ genes with SQL-backed queries (pondslime.ccn.duke.edu)',
      'Used AlphaFold and BLAST for protein prediction and sequence alignment',
    ],
    tools: 'React · JavaScript · PostgreSQL · AlphaFold · BLAST',
    links: [{ label: 'pondslime.ccn.duke.edu', href: 'https://pondslime.ccn.duke.edu' }],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
  {
    id: 'quantworks',
    short: 'Quantworks / SIZEO',
    title: 'Software Engineer Intern',
    org: 'Quantworks / SIZEO, Durham NC',
    when: 'Oct 2024 — Aug 2025',
    bullets: [
      'Helped build a platform using the Claude API to optimize budget, packaging, and seasonal inventory for retail clients including JCPenney and Aeropostale',
      'Built backend data pipelines in Python, visualized with Streamlit and Plotly',
      'Designed dashboards in Figma and built an artifact gallery for LLM output analysis',
    ],
    tools: 'Python · Claude API · Streamlit · Plotly · Figma',
    links: [],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
  {
    id: 'ncssm',
    short: 'NCSSM',
    title: 'Research Intern',
    org: 'NCSSM Summer Research Programs',
    when: 'Summer 2023 — Summer 2024',
    bullets: [
      'Presented research on agent-based neuron modeling, real gas behavior, and a modified cholera transmission model incorporating vaccination effects',
    ],
    tools: 'Mathematica · STELLA · Gaussian · NetLogo · Maple',
    links: [],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
]

export const projects = [
  {
    id: 'speech-dysfluency',
    short: 'Speech dysfluency',
    title: 'Speech Dysfluency Detection & Removal',
    bullets: [
      'End-to-end pipeline to detect, categorize, and remove speech dysfluencies',
      'Used Whisper to transcribe audio and rule-based logic to flag dysfluency types',
      'Benchmarked a custom random forest classifier against a premade model',
    ],
    tools: 'Python · Whisper · scikit-learn',
    links: [],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
  {
    id: 'insight',
    short: 'Insight',
    title: 'Insight — Journal Reflection App',
    bullets: [
      'React app generating reflective prompts from journal entries via an open-weight LLM (gpt-oss-20b) over the Groq API',
      'From-scratch retrieval system using vectorization and cosine similarity',
      'Client-side isolation using SHA-256 hashed API keys — no raw credentials stored',
    ],
    tools: 'React · Groq API · LLM integration',
    links: [],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
  {
    id: 'frisbee-classifier',
    short: 'Frisbee classifier',
    title: 'Ultimate Frisbee Play Classifier',
    bullets: [
      'Fine-tuned YOLOv8 on labeled field-photo data — 85% precision, 87% recall',
      'Converted detections into dot-map representations for a downstream play classifier',
      'Benchmarked ResNet18 against a self-built CNN and EfficientNet-B0; ResNet18 hit 91.3% accuracy at 1/36th the size',
    ],
    tools: 'PyTorch · YOLOv8 · Computer vision',
    links: [],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
  {
    id: 'event-horizon',
    short: 'Event Horizon',
    title: 'Event Horizon — Unreal Engine 5',
    bullets: [
      'Personal project to learn low-level systems programming and game dev workflows',
      'Built gameplay systems with C++ components and Blueprint scripting (kooling.itch.io)',
    ],
    tools: 'C++ · Unreal Engine 5 · Blueprints',
    links: [{ label: 'kooling.itch.io', href: 'https://kooling.itch.io' }],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: {
      hero: { src: '', alt: '', caption: '' },
      diagram: { src: '', alt: '', caption: '' },
      photo: { src: '', alt: '', caption: '' },
    },
  },
]

export const home = {
  intro:
    'I study computer science and statistics at Duke. I build genomics tools and small web apps, and I like taking the things I imagine and making them real.',
  photo: { src: '', alt: '', caption: '' },
}

// The PDF lives at public/resume.pdf. __RESUME_AVAILABLE__ is set by
// vite.config.js at build time; until the file exists the link shows "soon".
export const resume = {
  href: import.meta.env.BASE_URL + 'resume.pdf',
  available: __RESUME_AVAILABLE__,
}

export const about = {
  bio: [
    'I study computer science and statistics at Duke, and I like trying new things and figuring out how they could connect back to technology. Right now that means building databases and web tools for yeast pangenomes in the lab, making apps that improve my daily life, and using music and art to shape the experiences around me.',
    "Outside of work, you'll find me playing piano and guitar, messing around with production and content, and playing ultimate frisbee and pickleball competitively. More going here soon.",
  ],
  photo: { src: '', alt: '', caption: '' },
  // About desk: a drawn table with one penguin per interest. The table and
  // penguins share one canvas size (see public/images/desk/) so every penguin
  // lands on the tabletop without per-image positioning. `images` are the two
  // captioned slots shown side by side beside the desk.
  desk: {
    table: 'images/desk/table.png',
  },
  interests: [
    {
      id: 'sports',
      label: 'sports',
      penguin: {
        src: 'images/desk/penguin-sports.png',
        alt: 'A penguin in a cap holding a pickleball paddle, with a frisbee flying past and a bag of balls',
      },
      images: [
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'pickleball — caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'ultimate frisbee — caption coming soon' },
      ],
    },
    {
      id: 'music',
      label: 'music',
      penguin: {
        src: 'images/desk/penguin-music.png',
        alt: 'A penguin playing an acoustic guitar with a keyboard balanced on its head',
      },
      images: [
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'piano — caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'guitar — caption coming soon' },
      ],
    },
    {
      id: 'art',
      label: 'art',
      penguin: {
        src: 'images/desk/penguin-art.png',
        alt: 'A curly-haired penguin with a paintbrush beside an easel, a camera clipped on top',
      },
      images: [
        { kind: 'drawing', ratio: '4/5', src: '', alt: '', placeholder: 'from the sketchbook', caption: 'drawing — caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'photography — caption coming soon' },
      ],
    },
  ],
}
