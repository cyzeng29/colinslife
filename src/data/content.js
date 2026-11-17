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
      'Designed a PostgreSQL schema mapping 1,482 S. cerevisiae strains across core genes and pangenome traits, serving queries in under 10 ms so researchers can compare gene presence across strains',
      'Built a full stack web app (React, JavaScript, SQL) for a team of 15 lab researchers, with sitewide search and session based autocomplete caching, released to the department for usage',
      'Developed the Ashbya gossypii Genome Database section in PHP and JavaScript, an SGD style browser with live search across 6,294 genes, presenting project direction to the head of SGD and at the Yeast Genetics Meeting',
      'Wrote a PHP pipeline parsing ortholog and pathway spreadsheets into per gene JSON records, and integrated BLAST search and a JBrowse2 genome browser, giving Ashbya researchers sequence and genome views',
    ],
    tools: 'React · JavaScript · PostgreSQL · PHP · BLAST · JBrowse2',
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
      "Built a web platform on Anthropic's Claude API that generated budget allocation, packaging, and seasonal inventory forecasts for retail clients including JCPenney and Aeropostale, giving merchandise planners recommendations",
      'Engineered Python data pipelines that ingest client uploaded CSVs and transform them into interactive sales and demand views using Streamlit and Plotly, processing data for client dashboards',
      'Implemented an artifact store that persists LLM generated charts and reports for retrieval augmented analysis, letting companies revisit and compare past outputs for planned inventory decisions',
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
    id: 'snaily',
    short: 'Snaily',
    title: 'Snaily — Digital Postcards',
    bullets: [
      'Co-designed and built a digital postcard app for families and loved ones who live far apart, in a week for the Silicon Valley School of Design\'s national storytelling competition',
      'Designed photo customization that shows one thing at a time: tapping a photo centers it with options to draw, replace or caption',
      'Added a toggle between a paper clip of ordered photos and a free flowing canvas, serving both younger kids and older parents',
    ],
    details: [
      'Co-designed and built a digital postcard app for families and loved ones who live far apart, in a week for the Silicon Valley School of Design\'s national storytelling competition',
      'Designed photo customization that shows one thing at a time: tapping a photo centers it with options to draw, replace or caption',
      'Added a toggle between a paper clip of ordered photos and a free flowing canvas, serving both younger kids and older parents',
    ],
    tools: 'JavaScript · Canvas · WebGL · Supabase',
    links: [{ label: 'Live demo', href: 'https://snaily-seven.vercel.app/' }],
    context: '',
    outcomes: [],
    thumb: { src: 'images/snaily_cover.png', alt: 'The Snaily logo: a hand-drawn green snail beside the word Snaily' },
    media: [
      {
        kind: 'photo',
        src: 'images/snaily_cover.png',
        alt: 'The Snaily logo: a hand-drawn green snail beside the word Snaily',
      },
    ],
  },
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

// Home landing. The pictures are Colin's drawing, exported as layers into
// drawings/landing/ and turned into images by `npm run layers` (positions
// live in landingLayers.json). This holds the words: alt text for each drawn
// piece and the labels and text that go with them.
export const landing = {
  sidebar: {
    name: 'Colin Zeng',
    tagline: 'making design interactive.',
    // plain text for now (the hand-lettered versions are in the drawing):
    // where, shown as a bold label, then what
    facts: [
      { label: '@Duke', detail: 'CS + Stat' },
      { label: '@Dietrich Lab', detail: 'Research Intern' },
      { label: '@Quantworks', detail: 'SWE Intern' },
    ],
    recruiter: 'Recruiter Mode',
  },
  // shown from the "!" marker, on hover or click: the real bridge, with `text`
  // under it (placeholder until the bubble is drawn)
  bridge: {
    text: 'home base: durham, nc. this bridge is drawn after the japanese bridge in duke gardens.',
    photo: { src: 'images/duke-gardens-bridge.jpeg', alt: 'The red Japanese bridge over a pond in Duke Gardens' },
  },
  // Clickable desk objects whose pop-ups are still being drawn
  desk: [
    { slug: 'frisbee', name: 'frisbee', label: 'frisbee world championships medal' },
    { slug: 'camera', name: 'camera', label: 'camera: photos taken' },
  ],
  globe: { label: 'globe of places explored', title: "what i've explored" },
  sketchbook: { label: 'sketchbook of drawings', title: 'sketchbook', book: 'book', grid: 'grid', gridLabel: 'every drawing' },
  backpack: { label: 'backpack: what i carry', title: 'what i carry' },
  monitor: { label: 'monitor', screen: 'designed with procreate and figma', hintOn: 'switch it on', hintOff: 'switch it off' },
  dog: { name: 'kora', alt: 'kora, asleep on a dog bed', wake: 'wake her up' },
}

// The markers on the desk globe's map. Add a line for each place Colin has
// been; `note` is optional. `photos` show in a strip when the place is picked,
// each enlarging on a click: `src` under public/, `alt` describes it, and
// `caption` is optional.
const photo = (file, alt, caption = '') => ({ src: `images/places/${file}.jpeg`, alt, caption })

export const places = [
  {
    name: 'chapel hill, nc',
    lat: 35.91,
    lon: -79.06,
    note: 'my hometown growing up',
    photos: [
      photo('chapel-hill-gym', 'Colin taking a selfie with a group of friends in a gym'),
      photo('chapel-hill-unc', 'Colin with two friends at a graduation, one wearing a stole', 'unc'),
    ],
  },
  {
    name: 'durham, nc',
    lat: 36.0,
    lon: -78.94,
    note: 'where i am now, at duke',
    photos: [
      photo('duke-sunset', 'An orange and purple sunset over a columned building on Duke’s campus'),
    ],
  },
  {
    name: 'ann arbor, mi',
    lat: 42.28,
    lon: -83.74,
    note: 'where my house is now',
    photos: [photo('ann-arbor-home', 'Colin and family standing together at home with the family dog')],
  },
  { name: 'sleeping bear dunes, mi', lat: 44.88, lon: -86.04, photos: [photo('sleeping-bear-dunes', 'Two people on a sand dune high above a blue lake')] },
  { name: 'mackinac island, mi', lat: 45.85, lon: -84.62, photos: [photo('mackinac-island', 'A wooded cliff dropping to clear blue-green water')] },
  { name: 'chicago, il', lat: 41.88, lon: -87.62, photos: [photo('chicago-bean', 'Cloud Gate, the Bean, reflecting the Chicago skyline')] },
  { name: 'minnesota', lat: 44.86, lon: -93.24, photos: [photo('mall-of-america', 'The Mall of America sign on a glass wall')] },
  {
    name: 'grandfather mountain, nc',
    lat: 36.1,
    lon: -81.81,
    photos: [photo('grandfather-mountain', 'Colin standing on a rock high above layered blue mountains under clouds')],
  },
  {
    name: 'virginia',
    lat: 37.5,
    lon: -78.8,
    photos: [photo('blue-ridge-parkway', 'Colin looking out over autumn hills from the Blue Ridge Parkway', 'blue ridge parkway')],
  },
  {
    name: 'maine',
    lat: 45.3,
    lon: -69.2,
    photos: [
      photo('maine-acadia', 'Islands in a misty bay seen from a mountain top in Acadia'),
      photo('maine-portland-gull', 'A seagull eating a crab on a wooden dock in Portland'),
    ],
  },
  { name: 'louisiana', lat: 30.9, lon: -92.0, note: 'on a cruise' },
  { name: 'florida', lat: 28.1, lon: -81.6 },
  { name: 'cancún, mexico', lat: 21.16, lon: -86.85 },
  {
    name: 'california',
    lat: 36.8,
    lon: -119.4,
    photos: [
      photo('santa-monica', 'The Santa Monica pier and Ferris wheel past palm trees'),
      photo('hollywood-sign', 'The Hollywood sign on a dry hillside'),
      photo('hollywood-hills', 'Colin standing on a ridge in the Hollywood hills at sunset', 'hollywood'),
    ],
  },
  { name: 'victoria island', lat: 48.43, lon: -123.37 },
  { name: 'banff', lat: 51.18, lon: -115.57 },
  {
    name: 'colorado',
    lat: 39.0,
    lon: -105.5,
    note: 'frisbee',
    photos: [
      photo('colorado-rocky-mountain', 'A still mountain lake below a rocky peak and pine forest'),
      photo('colorado-night', 'Colin and three friends leaning on a wall at night'),
      photo('colorado-pool', 'A friend diving into a hotel pool at night while others watch'),
    ],
  },
  { name: 'new jersey', lat: 40.1, lon: -74.7 },
  {
    name: 'washington, dc',
    lat: 38.91,
    lon: -77.04,
    photos: [photo('washington-capitol', 'Colin grinning on the National Mall with the Capitol behind him')],
  },
  {
    name: 'london, uk',
    lat: 51.51,
    lon: -0.13,
    note: "kensington gardens, king's cross",
    photos: [
      photo('london-tower-bridge', 'Tower Bridge against a clear blue sky'),
      photo('london-hyde-park', 'Two riders in red uniforms on black horses in Hyde Park'),
      photo('london-buses', 'Red double-decker buses on a London street'),
    ],
  },
  { name: 'windsor castle, uk', lat: 51.48, lon: -0.6 },
  { name: 'stonehenge, uk', lat: 51.18, lon: -1.83, photos: [photo('stonehenge', 'Colin pointing toward Stonehenge across the grass')] },
  { name: 'roman baths, uk', lat: 51.38, lon: -2.36, photos: [photo('bath-abbey', 'An ice cream cone held up in front of Bath Abbey')] },
  { name: 'birmingham, uk', lat: 52.49, lon: -1.89, photos: [photo('birmingham-frisbee', 'Colin and a friend at a frisbee tournament field under a blue sky')] },
  {
    name: 'brussels',
    lat: 50.85,
    lon: 4.35,
    photos: [
      photo('brussels-atomium', 'The Atomium under a cloudy sky'),
      photo('brussels-grand-place', 'The Gothic town hall on the Grand Place'),
    ],
  },
  {
    name: 'amsterdam',
    lat: 52.37,
    lon: 4.9,
    photos: [
      photo('amsterdam-canal', 'The sun setting through clouds over an Amsterdam canal'),
      photo('amsterdam-burger', 'A burger with a flag reading “thanks, you look yummy too!” and fries'),
      photo('amsterdam-street', 'Colin and a friend walking down a sunny Amsterdam street'),
    ],
  },
  { name: 'zaandam north', lat: 52.46, lon: 4.82, photos: [photo('zaanse-schans', 'Colin looking out at windmills across a grassy field')] },
  {
    name: 'spain',
    lat: 40.2,
    lon: -3.7,
    note: 'world champions, ultimate frisbee',
    photos: [
      photo('wjuc-champions', 'A collage of the USA team celebrating as 2026 world junior ultimate champions'),
      photo('logrono-wjuc', 'Colin smiling in a USA jersey with team crowds behind him in Logroño'),
      photo('madrid-street', 'A domed corner building on a Madrid street at dusk'),
      photo('toledo', 'A narrow street in Toledo leading to the cathedral spire'),
      photo('madrid-flatbreads', 'Two flatbreads on wooden boards at a restaurant table'),
    ],
  },
  { name: 'hawaii', lat: 20.8, lon: -156.3, photos: [
    photo('hawaii-koko-head', 'The steep Koko Head trail stairs looking down over Oahu'),
    photo('hawaii-horses', 'Horses grazing beside a car window among trees'),
    photo('hawaii-malasadas', 'A box of sugared malasadas filled with custard'),
  ] },
  { name: 'turkey', lat: 39.0, lon: 35.2, photos: [photo('istanbul-galata', 'Galata Tower above the Istanbul skyline across the water', 'istanbul')] },
  { name: 'florence, italy', lat: 43.77, lon: 11.26, photos: [photo('florence', 'Colin taking a selfie above the rooftops of Florence')] },
  {
    name: 'rome, italy',
    lat: 41.9,
    lon: 12.5,
    photos: [
      photo('rome-arch-of-constantine', 'Colin standing in front of the Arch of Constantine'),
      photo('rome-trevi', 'The Trevi Fountain with crowds in front of it'),
    ],
  },
  { name: 'sorrento, italy', lat: 40.63, lon: 14.38 },
  {
    name: 'beijing, china',
    lat: 39.9,
    lon: 116.41,
    photos: [
      photo('beijing-forbidden-city', 'Taking a photo of the Forbidden City’s red walls and golden roofs', 'the forbidden city'),
      photo('beijing-zoo-monkeys', 'Two macaques sitting together on stone paving at the Beijing Zoo', 'beijing zoo'),
    ],
  },
  { name: 'shanghai, china', lat: 31.23, lon: 121.47 },
  { name: 'hefei, china', lat: 31.82, lon: 117.23 },
  {
    name: 'nanfeng, china',
    lat: 27.22,
    lon: 116.53,
    photos: [
      photo('nanfeng-lanterns', 'A crowded street at night strung with red lanterns'),
      photo('nanfeng-street', 'Colin giving a laughing friend a piggyback ride down a sunny street'),
      photo('nanfeng-dinner', 'Colin and family around a big round table at a family dinner', 'fuzhou, nanfeng'),
    ],
  },
  { name: 'huangshan, china', lat: 30.13, lon: 118.17 },
]

// The words around the backpack on the desk, under the resume's section
// headings (plus Other Tools for what's only on this site), a group to a `side`. `tier` (1 to
// 3) sets the size: what Colin reaches for most, not a self-rating. `studies` lists the case
// studies (ids in caseStudies.js) that really use the skill; the word links to
// the first and highlights them all, and a word with none stays plain text.
const skill = (name, tier, ...studies) => ({ name, tier, studies })

export const skills = [
  {
    group: 'Languages',
    side: 'top',
    words: [
      skill('Python', 3, 'ai-merchandise-planner', 'speech-dysfluency-removal'),
      skill('JavaScript', 2, 'ashbya-genome-database', 'snaily'),
      skill('SQL', 2, 'ashbya-genome-database'),
      skill('Java', 1),
      skill('TypeScript', 1),
      skill('PHP', 1, 'ashbya-genome-database'),
      skill('C++', 2, 'event-horizon'),
      skill('R', 1),
      skill('HTML/CSS', 1),
    ],
  },
  {
    group: 'Frameworks & Libraries',
    side: 'left',
    words: [
      skill('React', 3, 'ashbya-genome-database', 'insight'),
      skill('PyTorch', 3, 'frisbee-play-classifier'),
      skill('scikit-learn', 2, 'speech-dysfluency-removal'),
      skill('YOLOv8', 2, 'frisbee-play-classifier'),
      skill('Computer vision', 1, 'frisbee-play-classifier'),
      skill('Streamlit', 1, 'ai-merchandise-planner'),
      skill('Plotly', 1, 'ai-merchandise-planner'),
      skill('pandas', 1),
      skill('NumPy', 1),
      skill('Vite', 1),
    ],
  },
  {
    group: 'Databases & Infrastructure',
    side: 'right',
    words: [
      skill('PostgreSQL', 3, 'ashbya-genome-database'),
      skill('MySQL/MariaDB', 1),
      skill('Linux server admin', 1),
      skill('Git', 1),
      skill('Docker', 1),
      skill('Vercel', 1),
    ],
  },
  {
    group: 'AI & Bioinformatics',
    side: 'right',
    words: [
      skill('Claude API', 2, 'ai-merchandise-planner'),
      skill('Groq API', 1, 'insight'),
      skill('LLM integration', 1, 'insight'),
      skill('Whisper', 1, 'speech-dysfluency-removal'),
      skill('BLAST+', 1, 'ashbya-genome-database'),
      skill('JBrowse2', 1, 'ashbya-genome-database'),
      skill('AlphaFold', 1, 'ashbya-genome-database'),
    ],
  },
  {
    group: 'Other Tools',
    side: 'bottom',
    words: [
      skill('Unreal Engine 5', 2, 'event-horizon'),
      skill('Blueprints', 1, 'event-horizon'),
      skill('Figma', 1, 'ai-merchandise-planner'),
      skill('Mathematica', 1),
      skill('STELLA', 1),
      skill('Gaussian', 1),
      skill('NetLogo', 1),
      skill('Maple', 1),
    ],
  },
]

// Where to find Colin, listed under the sidebar facts (the resume link is
// added after these when the PDF exists)
export const contact = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/colin-zeng/' },
  { label: 'github', href: 'https://github.com/cyzeng29' },
  { label: 'email', href: 'mailto:colin.zeng@duke.edu' },
]

// The PDF lives at public/Colin_Zeng_Resume.pdf. __RESUME_AVAILABLE__ is set by
// vite.config.js at build time; until the file exists the link shows "soon".
export const resume = {
  href: import.meta.env.BASE_URL + 'Colin_Zeng_Resume.pdf',
  available: __RESUME_AVAILABLE__,
}

// Recruiter Mode (/work/list): the short version. One line and the skills
// gained for each role and project. caseStudy (optional) is the id of its
// case study page in caseStudies.js.
export const recruiter = {
  summary: 'CS + Statistics @ Duke.',
  experience: [
    {
      id: 'dietrich-lab',
      org: 'Dietrich Lab, Duke University',
      role: 'Undergraduate Research Intern',
      when: 'Jan 2026 — present',
      line: 'Built the lab’s genome database and pangenome browser, answering strain queries in under 10 ms for 15 researchers.',
      skills: ['PostgreSQL schema design', 'React', 'PHP', 'BLAST + JBrowse2', 'Presenting research'],
      caseStudy: 'ashbya-genome-database',
    },
    {
      id: 'quantworks',
      org: 'Quantworks / SIZEO',
      role: 'Software Engineer Intern',
      when: 'Oct 2024 — Aug 2025',
      line: 'Built data pipelines and an artifact gallery for a Claude API inventory planner serving 10 retail clients, including JCPenney.',
      skills: ['Claude API', 'Python data pipelines', 'Retrieval augmented analysis', 'Figma wireframing'],
      caseStudy: 'ai-merchandise-planner',
    },
    {
      id: 'daml',
      org: 'Duke Applied Machine Learning',
      role: 'Machine Learning Engineer',
      when: 'Aug 2025 — May 2026',
      line: 'Detected and removed speech dysfluencies (NeMo, 79.6% accuracy) and fine tuned BERT for fake news detection.',
      skills: ['PyTorch', 'Whisper + NeMo', 'Hugging Face', 'Model benchmarking'],
      caseStudy: 'speech-dysfluency-removal',
    },
    {
      id: 'ncssm',
      org: 'NCSSM Summer Research',
      role: 'Research Intern',
      when: 'June 2023 — July 2024',
      line: 'Modeled neurons, cholera vaccination and real gases in 3 papers, presented at Summer Ventures and SRIP.',
      skills: ['Mathematical modeling', 'Differential equations', 'NetLogo', 'Scientific writing'],
    },
  ],
  projects: [
    {
      id: 'snaily',
      org: 'Snaily',
      role: 'Digital postcard app',
      line: 'Postcards for families who live far apart, built in a week for SVSD’s national design competition.',
      skills: ['three.js', 'Supabase', 'PWA', 'User centered design'],
      caseStudy: 'snaily',
    },
    {
      id: 'frisbee-classifier',
      org: 'Frisbee Play Classifier',
      role: 'Computer vision',
      line: 'Names the ultimate play from a single frame of game film, at 91.3% accuracy across 7 plays.',
      skills: ['PyTorch', 'YOLOv8', 'ResNet18'],
      caseStudy: 'frisbee-play-classifier',
    },
    {
      id: 'insight',
      org: 'Insight',
      role: 'Journal app',
      line: 'Writes reflection prompts from your own past entries, with retrieval built from scratch.',
      skills: ['React', 'RAG', 'Groq API'],
      caseStudy: 'insight',
    },
    {
      id: 'event-horizon',
      org: 'Event Horizon',
      role: 'Unreal Engine 5 game',
      line: 'A 3D precision platformer with reusable C++ platform components.',
      skills: ['C++', 'Unreal Engine 5', 'Blueprints'],
      caseStudy: 'event-horizon',
    },
  ],
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
        {
          kind: 'photo',
          ratio: '4/5',
          src: 'images/frisbee-mark.jpeg',
          alt: 'An ultimate frisbee player in #11 holding the disc while a defender in #13 marks him',
          placeholder: 'photo',
          caption: '',
        },
        {
          kind: 'photo',
          ratio: '4/5',
        src: 'images/frisbee2.jpeg',
        alt: 'Colin in USA #26 skying two France players for a disc',
          placeholder: 'photo',
        caption: '',
        },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: '' },
        {
          kind: 'photo',
          ratio: '4/5',
          src: 'images/pickleball.jpeg',
          alt: 'Colin and two friends holding pickleball paddles on a court under the lights at night',
          placeholder: 'photo',
          caption: '',
        },
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
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: '' },
        {
          kind: 'photo',
          ratio: '4/5',
          src: 'images/guitar.jpeg',
          alt: 'Colin playing an acoustic Fender guitar, seated with his legs crossed',
          placeholder: 'photo',
          caption: '',
        },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: '' },
        { kind: 'photo', ratio: '4/5', src: '', alt: '', placeholder: 'photo', caption: '' },
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
    {
      name: 'Duke Pickleball',
      role: '',
      when: '',
      blurb: 'A competitive sports club for pickleball enthusiasts at Duke University, qualifying for the travel team and playing in intercollegiate tournaments.',
      href: '',
      photo: { src: 'images/pickleball-club.jpeg', alt: 'Colin and three Duke Pickleball teammates dressed up, posing together in front of a wooden door', caption: '' },
    },
  ],
}

// The full sketchbook, opened from the desk on Home: the About page's art,
// with the ink drawings gathered a few to a page. A page with `items` holds
// several pieces; the grid view lists every piece on its own.
const ink = (file, name, alt) => ({ src: `images/drawings/${file}.jpeg`, alt, caption: `ink drawing — ${name}` })
const art = about.interests.find((it) => it.id === 'art').images
export const sketchbook = [
  ...art.slice(0, 3),
  {
    kind: 'drawing',
    caption: 'ink drawings — chamber, viper and jett',
    placeholder: 'from the sketchbook',
    items: [
      ink('chamber', 'chamber', 'Signed ink line drawing of Chamber from Valorant, his name lettered down the side'),
      ink('viper', 'viper', 'Signed ink line drawing of Viper from Valorant, her name lettered down the side'),
      ink('jett', 'jett', 'Signed ink line drawing of Jett from Valorant holding a knife, her name lettered at the top'),
    ],
  },
  {
    kind: 'drawing',
    caption: 'ink drawings — sova, omen and a mech',
    placeholder: 'from the sketchbook',
    items: [
      ink('sova', 'sova', 'Signed ink line drawing of Sova from Valorant with his bow, his name lettered down the side'),
      ink('omen', 'omen', 'Signed ink line drawing of Omen from Valorant, his name lettered at the top'),
      ink('mech', 'mech', 'Ink line drawing of an armoured mech holding a large gun'),
    ],
  },
  ...art.slice(3),
]
