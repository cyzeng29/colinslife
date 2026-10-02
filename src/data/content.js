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
//   media    — up to two [{ kind, src, alt, caption }] shown side by side in
//              the detail dialog; kind is 'photo', 'screenshot' or 'drawing'

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
    thumb: { src: 'images/agd_preview.png', alt: 'Gene overview page in the Ashbya gossypii Genome Database', ratio: '1232/1228' },
    media: [
      {
        kind: 'screenshot',
        src: 'images/agd_preview.png',
        ratio: '1232/1228',
        alt: 'AGD gene overview page with orthologs table and genome browser',
        caption: 'Preview of AGD, the complete database for Ashbya gossypii research',
      },
      { kind: 'photo', src: 'images/labtubes.jpeg', alt: 'Labeled Falcon tubes of Candida samples in a rack', caption: 'Streaked Candida samples in the lab for Plasmidsaurus analysis' },
    ],
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
    links: [{ label: 'Figma Prototype', href: 'https://www.figma.com/proto/NMqokwA5WdHVUaDz6iEAyz/Bourne?node-id=62-531&p=f&t=fmjFfF0sAOy3NPVS-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=8%3A16' }],
    context: '',
    outcomes: [],
    thumb: {src: 'images/figma.png', alt: 'Figma prototype of the artifact gallery for LLM output analysis', ratio: '1888/1226'},
    media: [
      { kind: 'photo', src: 'images/figma.png', ratio: '1888/1226', alt: 'Figma prototype of the artifact gallery for LLM output analysis', caption: 'Figma prototype of the job selection window and artifact gallery for LLM output analysis' },
      { kind: 'photo', src: 'images/Quantworks.jpeg', alt: 'Colin at his desk in the Quantworks office', caption: 'At the Quantworks office in Durham' },
    ],
  },
  {
    id: 'ncssm',
    short: 'NCSSM',
    title: 'Research Intern',
    org: 'NCSSM Summer Research Programs',
    when: 'Summer 2023 — Summer 2024',
    bullets: [
      'Presented research on agent-based neuron modeling, real gas behavior, and a modified cholera transmission model incorporating vaccination effects',
      'Authored two papers: "Analysis of Neurons Under the Hodgkin-Huxley Model Using NetLogo," on agent-based modeling of action potentials, and "Analysis of Gas Behaviors Under Ideal and Real Conditions," on comparing ideal and real gas models',  
      'Co-authored "Modification of the SIWRS Model for Cholera Transmission to Include Vaccination Compartments," modeling the effects of vaccination rates, efficacy, and waning immunity using systems of differential equations in Maple',
    ],
    tools: 'Mathematica · STELLA · Gaussian · NetLogo · Maple',
    links: [
      { label: 'Cholera model paper (PDF)', href: import.meta.env.BASE_URL + 'Paper.pdf' },
      { label: 'Gas Laws paper (PDF)', href: import.meta.env.BASE_URL + 'GasLaws.pdf' },
      { label: 'Agent-based neuron modeling paper (PDF)', href: import.meta.env.BASE_URL + 'HodgkinHuxley.pdf' },

    ],
    context: '',
    outcomes: [],
    thumb: { src: 'images/Vaccine.png', alt: 'Model of cholera transmission with imperfect vaccination compartments' },
    media: [
      { 
        kind: 'photo', 
        src: 'images/Vaccine.png', 
        alt: 'Model of cholera transmission with imperfect vaccination compartments' ,
        caption: 'Visual diagram of cholera transmission with imperfect vaccination compartments',
      },
      {
        kind: 'photo',
        src: 'images/NCSSM.jpeg',
        alt: 'Colin presenting "Studying Neurons Using the Hodgkin-Huxley Model" in an auditorium',
        caption: 'Presenting Hodgkin-Huxley neuron modeling, NCSSM Summer Research and Innovation Program 2024',
      },
    ],
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
    links: [{ label: 'Github', href: 'https://github.com/DAML-Spring26/auto-speech-destuttering' }],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: [
      { kind: 'photo', src: '', alt: '', caption: '' },
      { kind: 'photo', src: '', alt: '', caption: '' },
    ],
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
    links: [{ label: 'Github', href: 'https://github.com/cyzeng29/Insight' }],
    context: '',
    outcomes: [],
    thumb: { src: '', alt: '' },
    media: [
      { kind: 'photo', src: '', alt: '', caption: '' },
      { kind: 'photo', src: '', alt: '', caption: '' },
    ],
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
    links: [{ label: 'Github', href: 'https://github.com/cyzeng29/frisbee-classifier' }],
    context: '',
    outcomes: [],
    thumb: { src: 'images/morefrisbee.jpeg', alt: 'Team USA players holding gold medals in the stands' },
    media: [
      {
        kind: 'photo',
        src: 'images/morefrisbee.jpeg',
        alt: 'Team USA players holding gold medals in the stands',
        caption: 'The sport behind the classifier, inspiring this project',
      },
      { kind: 'photo', src: '', alt: '', caption: '' },
    ],
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
    media: [
      { kind: 'photo', src: 'images/EventHorizon.png', alt: 'Event Horizon game screenshot', caption: 'Snapshot of Event Horizon in Unreal Engine 5' },
    ],
  },
]

export const home = {
  intro:
    'I study computer science and statistics at Duke. I build genomics tools and small web apps, and I like taking the things I imagine and making them real.',
  photo: { src: 'images/homepage.jpeg', alt: 'Colin Zeng', caption: '' },
}

// The PDF lives at public/Colin_Zeng_Resume.pdf. __RESUME_AVAILABLE__ is set by
// vite.config.js at build time; until the file exists the link shows "soon".
export const resume = {
  href: import.meta.env.BASE_URL + 'Colin_Zeng_Resume.pdf',
  available: __RESUME_AVAILABLE__,
}

export const about = {
  bio: [
    'I study computer science and statistics at Duke, and I like trying new things and figuring out how they could connect back to technology. Right now that means building databases and web tools for yeast pangenomes in the lab, making apps that improve my daily life, and using music and art to shape the experiences around me.',
    "Outside of work, you'll find me playing piano and guitar, messing around with production and content, and playing ultimate frisbee and pickleball competitively. More going here soon.",
  ],
  photo: { src: 'images/frisbee.jpeg', alt: 'Colin in a Team USA #26 jersey holding up his cleats', caption: '' },
  // About desk: one penguin per interest, dropped into a pool of light. The
  // penguins share one canvas size (see public/images/desk/) so every penguin
  // lands in the light without per-image positioning. `images` are the four
  // captioned slots shown 2x2 beside the desk
  // and `caption` is the line shown under the penguin; with
  // `layout: 'sketchbook'` they become flippable pages instead (any count).
  interests: [
    {
      id: 'sports',
      label: 'sports',
      caption: 'My brother brought me into the sport of ultimate frisbee in 7th grade. From then, it has been nonstop; From middle school to high school to club, and most recently winning gold with Team USA at WJUC 2026. For pickleball, it was a smooth transition from dad-to-son tennis training, and I have managed the local pickleball scene through high school and now am competiting at the collegiate level on Duke.',
      penguin: {
        src: 'images/desk/penguin-sports.png',
        alt: 'A penguin in a cap holding a pickleball paddle, with a frisbee flying past and a bag of balls',
      },
      images: [
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'pickleball — caption coming soon' },
        {
          kind: 'photo',
          ratio: '4/5',
        src: 'images/frisbee2.jpeg',
        alt: 'Colin in USA #26 skying two France players for a disc',
          placeholder: 'photo',
        caption: 'ultimate frisbee — WJUC 2026 finals day',
        },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'caption coming soon' },
      ],
    },
    {
      id: 'music',
      label: 'music',
      caption: 'I had a piano teacher for almost a decade, but it was only after I quit that I truly started to enjoy making music. Now I have added a guitar to the music kit, and I am exploring new techniques in the hopes that I can produce my own one day.',
      penguin: {
        src: 'images/desk/penguin-music.png',
        alt: 'A penguin playing an acoustic guitar with a keyboard balanced on its head',
      },
      images: [
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'piano — caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'guitar — caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'caption coming soon' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: 'caption coming soon' },
      ],
    },
    {
      id: 'art',
      label: 'art',
      caption: 'My favorite pastimes include painting, drawing and photography (I want to make my own films). Just a serene feeling to create something original and creative. Check out the sketchbook.',
      layout: 'sketchbook',
      penguin: {
        src: 'images/desk/penguin-art.png',
        alt: 'A curly-haired penguin with a paintbrush beside an easel, a camera clipped on top',
      },
      images: [
        {
          kind: 'drawing',
          ratio: '4/5',
        src: 'images/drawing.jpeg',
        alt: 'Painting of a crowned tortoise crossing a finish line past a sleeping hare, titled Rate = k[tortoise]^n',
          placeholder: 'from the sketchbook',
        caption: 'painting — rate = k[tortoise]ⁿ',
        },
        {
          kind: 'drawing',
        src: 'images/drawing2.jpeg',
        alt: 'Collage of a colored anime character lineup and two pencil sketches of a mosque and a city bridge',
          placeholder: 'from the sketchbook',
        caption: 'drawing — anime lineup and pencil sketches',
        },
        {
          kind: 'drawing',
        src: 'images/drawing3.jpeg',
        alt: "Mural of Magneto and Wolverine with Maxwell's equations painted in the sky",
          placeholder: 'from the sketchbook',
        caption: "mural — Magneto, Wolverine and Maxwell's equations",
        },
        {
          kind: 'photo',
          ratio: '4/5',
        src: 'images/photography.jpeg',
        alt: 'Instant photo of four friends at dinner, dated 08.02.25',
          placeholder: 'photo',
        caption: 'photography — instant film',
        },
      ],
    },
  ],
  // "duke" section under the desk. Only `name` is required; role, when
  // (e.g. '2025 — present'), blurb, href and photo show once filled in.
  clubs: [
    {
      name: 'Catalyst',
      role: '',
      when: '',
      blurb: '',
      href: '',
      photo: { src: 'images/catalyst.jpeg', alt: 'Catalyst members in suits posing together as a group', caption: '' },
    },
    { name: 'Duke SSMU', role: '', when: '', blurb: '', href: '' },
    { name: 'Duke Applied Machine Learning', role: '', when: '', blurb: '', href: '' },
    { name: 'Duke Justice Project', role: '', when: '', blurb: '', href: '' },
    { name: 'Duke Pickleball', role: '', when: '', blurb: '', href: '' },
  ],
}
