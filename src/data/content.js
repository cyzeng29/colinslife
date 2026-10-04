// Edit the arrays below to add, remove, or update entries.
// Every card on the Work page is generated from this file — no JSX editing needed.
//
// Images: drop files in public/images/ and set `src: 'images/your-file.jpg'`.
// Any slot with an empty src shows a sketch-style placeholder instead.
//
// Per entry:
//   id       — anchor used by the penguin timeline (keep it unique)
//   short    — short label shown in the timeline
//   bullets  — the card's summary (kept in step with the resume)
//   details  — optional longer list for the dialog's "what I did"; falls back
//              to bullets. Holds what the resume leaves out (e.g. paper titles)
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
      'Built a full stack frontend (React, JavaScript, HTML/CSS) with SQL backed queries loading 10,000+ genes across Saccharomyces cerevisiae and Ashbya gossypii pangenomes',
      'Utilized AlphaFold and BLAST across 6,294 genes for protein prediction and sequence alignment in the pipeline',
    ],
    tools: 'React · JavaScript · PostgreSQL · AlphaFold · BLAST',
    links: [{ label: 'fungalpangenome.ccn.duke.edu', href: 'http://152.3.33.15/agd.php' }],
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
      "Engineered a web platform using Anthropic's Claude API to optimize budget allocation, packaging, and seasonal inventory predictions for retail clients including JCPenney and Aeropostale",
      'Built Python pipelines turning client uploaded CSVs into multi-trend sales and demand views in Streamlit and Plotly',
      'Designed and presented 30 client dashboard screens in Figma, introducing an artifact gallery of saved LLM graphs and reports for downstream RAG analysis, and for planners to revisit and compare',
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
    when: 'June 2023 — July 2024',
    bullets: [
      'Programmed an agent based Hodgkin Huxley neuron simulation in NetLogo (4 ion species, 6 channel types)',
      'Modeled a cholera transmission system extended with perfect and imperfect vaccinations (5 coupled ODEs)',
      'Modeled real gas behavior in Gaussian; presented all 3 projects at Summer Ventures and SRIP',
    ],
    details: [
      'Programmed an agent-based Hodgkin-Huxley neuron simulation in NetLogo (4 ion species, 6 channel types), and authored "Analysis of Neurons Under the Hodgkin-Huxley Model Using NetLogo" on agent-based modeling of action potentials',
      'Modeled a cholera transmission system extended with perfect and imperfect vaccinations (5 coupled ODEs), co-authoring "Modification of the SIWRS Model for Cholera Transmission to Include Vaccination Compartments," which models the effects of vaccination rates, efficacy, and waning immunity using systems of differential equations in Maple',
      'Modeled real gas behavior in Gaussian, and authored "Analysis of Gas Behaviors Under Ideal and Real Conditions" comparing ideal and real gas models',
      'Presented all 3 projects at Summer Ventures and SRIP',
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
    title: 'Speech Dysfluency Detection and Removal',
    bullets: [
      'Built an end-to-end pipeline to detect, categorize, and remove speech dysfluencies (e.g., repetitions)',
      'Used OpenAI Whisper to transcribe 162 audio clips and rule based logic to flag and categorize 5 dysfluency types (repetition, insertion, deletion, pause, substitution)',
      'Benchmarked 3 classifiers on an 88 sample test set; a NeMo model reached 79.6% accuracy (0.78 macro F1), a 44% gain over an MFCC random forest baseline and 3 times as accurate as the Llama 3 baseline',
    ],
    tools: 'Python · Whisper · scikit-learn',
    links: [{ label: 'Github', href: 'https://github.com/DAML-Spring26/auto-speech-destuttering' }],
    context: '',
    outcomes: [],
    // ratio = the image's own 922x408 shape, so the table is never cropped
    thumb: { src: 'images/F1.png', ratio: '922/408', alt: 'Classification report with precision, recall and F1 for the five dysfluency types (REP, INS, DEL, PAU, SUB); 79.6% accuracy, macro F1 0.783' },
    media: [
      { kind: 'photo', src: 'images/F1.png', ratio: '922/408', alt: 'Classification report with precision, recall and F1 for the five dysfluency types (REP, INS, DEL, PAU, SUB); 79.6% accuracy, macro F1 0.783', caption: 'F1, Precision, Recall Scores of All 5 Dysfluency Types' },
    ],
  },
  {
    id: 'insight',
    short: 'Insight',
    title: 'Insight — Journal Reflection App',
    bullets: [
      'Built a React app that generates personalized reflective prompts from journal entries via the Groq API',
      'Designed retrieval system from scratch using vectorization and cosine similarity to query relevant entries for RAG',
      'Shipped a new user onboarding flow, 5 selectable themes, and persistent entry management backed by localStorage',
    ],
    details: [
      'Built a React app that generates personalized reflective prompts from journal entries via an open-weight LLM (gpt-oss-20b) over the Groq API',
      'Designed retrieval system from scratch using vectorization and cosine similarity to query relevant entries for RAG',
      'Shipped a new user onboarding flow, 5 selectable themes, and persistent entry management backed by localStorage',
      'Kept API keys client-side as SHA-256 hashes, so no raw credentials are ever stored',
    ],
    tools: 'React · Groq API · LLM integration',
    links: [{ label: 'Github', href: 'https://github.com/cyzeng29/Insight' }],
    context: '',
    outcomes: [],
    // the card shows the app's header and new-entry screen; the dialog the full phone view
    thumb: { src: 'images/insight-thumb.png', alt: 'Insight app header with Today, Journal and Write tabs above a new journal entry' },
    media: [
      {
        kind: 'photo',
        src: 'images/Insight.png',
        ratio: '522/997',
        alt: 'Insight app on a phone-sized screen: Today, Journal and Write tabs, and an empty new-entry box prompting "What\'s on your mind?"',
        caption: 'Writing a new entry; past journals become context for daily prompts',
      },
    ],
  },
  {
    id: 'frisbee-classifier',
    short: 'Frisbee classifier',
    title: 'Ultimate Frisbee Play Classifier',
    bullets: [
      'Built a 2 stage computer vision pipeline that classifies 7 ultimate frisbee plays from images by detecting players and the disc, then converted detections into simplified dot-map representations to train a downstream play classifier',
      'Fine tuned YOLOv8 on a Roboflow dataset, reaching 85% precision and 87% recall across 3 object classes',
      'Benchmarked ResNet18 for classification, reaching 91.3% accuracy and outperforming custom CNN by 20 points',
    ],
    details: [
      'Built a 2 stage computer vision pipeline that classifies 7 ultimate frisbee plays from images by detecting players and the disc, then converted detections into simplified dot-map representations to train a downstream play classifier',
      'Fine tuned YOLOv8 on a Roboflow dataset, reaching 85% precision and 87% recall across 3 object classes',
      'Benchmarked ResNet18 against a custom CNN and EfficientNet-B0 for classification; ResNet18 reached 91.3% accuracy at 1/36th the size, outperforming the custom CNN by 20 points',
    ],
    tools: 'PyTorch · YOLOv8 · Computer vision',
    links: [{ label: 'Github', href: 'https://github.com/cyzeng29/frisbee-classifier' }],
    context: '',
    outcomes: [],
    // just Step 2 (YOLO detections) of the stacked pipeline, at its own shape
    thumb: { src: 'images/frisbee-pipeline-thumb.png', ratio: '600/362', alt: 'YOLO player detections on a frame from an ultimate frisbee broadcast' },
    media: [
      {
        // the original 1672x564 strip restacked vertically to fit the image column
        kind: 'photo',
        src: 'images/frisbee-pipeline.png',
        ratio: '600/1058',
        alt: 'Classifier pipeline: an ultimate frisbee broadcast frame, the same frame with YOLO teammate and opponent detections, a dot map of player positions, and the predicted play 32Twist at 48% confidence',
        caption: 'The pipeline: original frame → YOLO detections → dot map → predicted play',
      },
      {
        kind: 'photo',
        src: 'images/morefrisbee.jpeg',
        alt: 'Team USA players holding gold medals in the stands',
        caption: 'The sport behind the classifier, inspiring this project',
      },
    ],
  },
  {
    id: 'event-horizon',
    short: 'Event Horizon',
    title: 'Event Horizon — Unreal Engine 5 Game',
    bullets: [
      'Built a 3D precision platformer in Unreal Engine 5 (kooling.itch.io), using Blueprints for in-game triggers and UI',
      'Wrote reusable C++ components with adjustable features, adding sliding and bouncing behavior to platforms',
    ],
    details: [
      'Personal project to learn low-level systems programming and game dev workflows',
      'Built a 3D precision platformer in Unreal Engine 5 (kooling.itch.io), using Blueprints for in-game triggers and UI',
      'Wrote reusable C++ components with adjustable features, adding sliding and bouncing behavior to platforms',
    ],
    tools: 'C++ · Unreal Engine 5 · Blueprints',
    links: [{ label: 'kooling.itch.io', href: 'https://kooling.itch.io' }],
    context: '',
    outcomes: [],
    thumb: { src: 'images/EventHorizon.png', alt: 'Event Horizon game screenshot' },
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
        {
          kind: 'photo',
          ratio: '4/5',
          src: 'images/guitar.jpeg',
          alt: 'Colin playing an acoustic Fender guitar, seated with his legs crossed',
          placeholder: 'photo',
          caption: 'guitar — caption coming soon',
        },
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
      blurb: 'A pre-professional tech organization with professional workshops, mentorship programs, and social events, in order to build community and prepare members for the tech industry.',
      href: '',
      photo: { src: 'images/catalyst.jpeg', alt: 'Catalyst members in suits posing together as a group', caption: '' },
    },
    { name: 'Duke SSMU', role: '', when: '', blurb: 'The Statistical Science Majors Union, a community for undergraduate students interested in statistics and data science. I am currently working on the Lullabee project, dedicated to optimizing infant sleep based on mattress data and patterns.', href: '' },
    { name: 'DAML', role: '', when: '', blurb: 'The Duke Applied Machine Learning group, focused on research and applications of machine learning techniques. I have worked on several projects related to natural language processing and computer vision, including an audio dysfluency removal and fake news detection system.', href: '' },
    { name: 'Duke Justice Project', role: '', when: '', blurb: 'A student-run organization dedicated to promoting justice-involed individuals through education, advocacy, and innovative solutions. I am currently on the Tech team, focused on helping nonprofit organizations leverage technology for social impact and providing resources for people re-entering society after incarceration.', href: '' },
    { name: 'Duke Pickleball', role: '', when: '', blurb: 'A competitive sports club for pickleball enthusiasts at Duke University, qualifying for the travel team and playing in intercollegiate tournaments.', href: '' },
  ],
}
