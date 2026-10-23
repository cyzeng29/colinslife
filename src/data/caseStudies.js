// Case studies: the grid under the Home landing (where the EXPERIENCE key
// goes) and the page each card opens (/work/<id>). Edit the words here; no JSX
// editing needed. Order here is the order on the page.
//
// Each case study builds on an entry in content.js (`from`), which supplies
// its role, organisation, dates, tools and links, so those stay in one place.
//
// Per case study:
//   id        — the page's address (/work/<id>); keep it unique
//   from      — id of the experience or project entry in content.js
//   title     — card and page title; `at` is shown after it as "@ at"
//   kind, date — the card's "Discipline | Date" line
//   summary   — one line under the card title
//   tile      — card image: { src, fit, bg, labels? }. fit is 'contain' (a
//               framed screenshot), 'cover' (fills the tile) or 'phone'; bg
//               is the tile's colour behind a contained image. labels are
//               faint words laid over the picture: { text, right, y }, where
//               right is the text's right edge and y its middle, both as % of
//               the tile
//   headline, context — the page's opening heading and paragraphs
//   contextImage — optional { src, alt, caption } beside the context
//   solution  — { title, image: { src, alt, caption, phone? }, challenges:
//               [[name, line]], text }
//   process   — [[step, line]] in the order they happened
//   results   — optional [[figure, label]]
//   reflection — your own words; the Reflection section appears once it's set
import { experience, projects } from './content.js'

const entries = [...experience, ...projects]

const studies = [
  {
    id: 'ashbya-genome-database',
    from: 'dietrich-lab',
    title: 'Ashbya Genome Database',
    at: 'Dietrich Lab',
    kind: 'Full-Stack Engineering',
    date: '2026 to present',
    summary: 'A genome database and pangenome browser that lets the Dietrich Lab search and compare yeast strains in milliseconds.',
    tile: { src: 'images/agd_cover.png', fit: 'cover', bg: '#dddddd' },
    headline: 'Building a searchable home for the lab’s yeast genomes',
    context: [
      'I joined the Dietrich Lab at Duke as an undergraduate research intern, working on the genome data tools the lab uses to study Saccharomyces cerevisiae and Ashbya gossypii.',
      'Much of the lab’s ortholog and pathway data started out in spreadsheets. My job was to design and build the database and web tools that let a team of 15 researchers search it, compare strains and browse genes in one place.',
    ],
    contextImage: { src: 'images/labtubes.jpeg', alt: 'Labeled Falcon tubes of Candida samples in a rack', caption: 'Streaked Candida samples in the lab' },
    solution: {
      title: 'One database, three ways in',
      image: { src: 'images/agd_preview.png', alt: 'AGD gene overview page with orthologs table and genome browser', caption: 'Gene overview page in the Ashbya Genome Database, with orthologs and the genome browser' },
      challenges: [
        ['Scale', '1,482 strains compared across core genes and pangenome traits'],
        ['Scattered sources', 'Orthologs, pathways, sequences and genome views lived in separate files and tools'],
        ['Speed', 'Comparisons had to come back fast enough to explore freely'],
      ],
      text: 'A PostgreSQL schema answers strain and gene questions in under 10 ms. On top of it sits a React web app with sitewide search, and an SGD-style Ashbya Genome Database that brings gene pages, BLAST search and a JBrowse2 genome browser together.',
    },
    process: [
      ['Model the pangenome', 'Designed a PostgreSQL schema mapping 1,482 S. cerevisiae strains across core genes and pangenome traits, serving queries in under 10 ms.'],
      ['Build it for the lab', 'A React web app for a team of 15 researchers, with sitewide search and session-based autocomplete caching, released to the department.'],
      ['Design the Ashbya browser', 'An SGD-style genome browser with live search across 6,294 genes. Presented the direction to the head of SGD and at the Yeast Genetics Meeting.'],
      ['Connect the data', 'A PHP pipeline turning ortholog and pathway spreadsheets into per-gene records, plus BLAST search and a JBrowse2 genome view.'],
    ],
    results: [
      ['1,482', 'yeast strains mapped'],
      ['< 10 ms', 'per query'],
      ['6,294', 'genes searchable'],
      ['15', 'researchers using it'],
    ],
    reflection: '',
  },
  {
    id: 'ai-merchandise-planner',
    from: 'quantworks',
    title: 'AI Merchandise Planner',
    at: 'Quantworks',
    kind: 'Software Engineering',
    date: '2024 to 2025',
    summary: 'Turns a retailer’s sales data into budget, packaging and seasonal inventory forecasts.',
    tile: {
      src: 'images/quantworks_cover.png',
      fit: 'cover',
      bg: '#dddddd',
      // on the three green boxes of the drawing
      labels: [
        { text: 'Multi-Trend Graphs', right: 62.5, y: 25.4 },
        { text: 'Box Optimization', right: 62.5, y: 50.4 },
        { text: 'Seasonal Planner', right: 62.5, y: 75.8 },
      ],
    },
    headline: 'Turning retail sales data into planning recommendations',
    context: [
      'At Quantworks / SIZEO in Durham, I worked as a software engineer intern on an AI planning platform for retail clients including JCPenney and Aeropostale.',
      'Merchandise planners upload their sales data and get budget allocation, packaging and seasonal inventory forecasts back, generated with Anthropic’s Claude API.',
    ],
    contextImage: { src: 'images/Quantworks.jpeg', alt: 'Colin at his desk in the Quantworks office', caption: 'At the Quantworks office in Durham' },
    solution: {
      title: 'From upload to recommendation',
      image: { src: 'images/figma.png', alt: 'Figma prototype of the artifact gallery for LLM output analysis', caption: 'Figma prototype of the job selection window and artifact gallery' },
      challenges: [
        ['Varied inputs', 'Client CSVs had to be turned into clean, comparable sales and demand data'],
        ['Answers that last', 'Generated charts and reports needed to be saved and compared over time'],
      ],
      text: 'Python pipelines turn uploaded CSVs into interactive Streamlit and Plotly dashboards, Claude generates the forecasts, and an artifact store keeps every chart and report so teams can revisit past decisions. I prototyped the job selection window and artifact gallery in Figma before building them.',
    },
    process: [
      ['Prototype the flow', 'Designed the job selection window and artifact gallery in Figma before building.'],
      ['Generate the forecasts', 'A web platform on Anthropic’s Claude API giving merchandise planners at JCPenney and Aeropostale budget, packaging and inventory recommendations.'],
      ['Turn uploads into dashboards', 'Python pipelines that take client CSVs and build interactive sales and demand views in Streamlit and Plotly.'],
      ['Keep past answers', 'An artifact store that saves generated charts and reports so teams can revisit and compare earlier forecasts.'],
    ],
    results: [
      ['2', 'national retail clients'],
      ['3', 'forecast types'],
    ],
    reflection: '',
  },
  {
    id: 'insight',
    from: 'insight',
    title: 'Insight',
    at: '',
    kind: 'App Design & Engineering',
    date: 'Personal project',
    summary: 'A journal that reads your past entries and asks you better questions.',
    tile: { src: 'images/Insight.png', fit: 'phone', bg: '#9fb492' },
    headline: 'A journal that asks better questions',
    context: [
      'Insight is a personal project: a React journaling app that reads your past entries and writes reflection prompts from them.',
      'I designed and built it end to end, from the retrieval system that picks which entries matter to the onboarding flow and themes.',
    ],
    solution: {
      title: 'Prompts grounded in your own writing',
      image: { src: 'images/Insight.png', alt: 'Insight app on a phone-sized screen with Today, Journal and Write tabs and an empty new-entry box', caption: 'Writing a new entry; past journals become context for daily prompts', phone: true },
      challenges: [
        ['Relevant memory', 'Prompts should draw on the right past entries, not only the latest'],
        ['Trust', 'Personal writing and API keys need to stay private'],
      ],
      text: 'Entries are vectorized and matched by cosine similarity, and the closest ones are passed to an open-weight model (gpt-oss-20b) over the Groq API. An onboarding flow, 5 themes and saved entries make it feel like a real journal, and API keys are stored only as SHA-256 hashes.',
    },
    process: [
      ['Prompts from your own writing', 'A React app that writes personal reflection prompts from past entries, using an open-weight model over the Groq API.'],
      ['Retrieval from scratch', 'Vectorized entries and cosine similarity to pull the most relevant ones into each prompt.'],
      ['A gentle first run', 'An onboarding flow, 5 themes and saved entries, so it feels like a real journal from day one.'],
      ['Keys stay private', 'API keys kept client-side as SHA-256 hashes, so no raw credentials are stored.'],
    ],
    results: [
      ['5', 'themes'],
      ['0', 'raw keys stored'],
    ],
    reflection: '',
  },
  {
    id: 'frisbee-play-classifier',
    from: 'frisbee-classifier',
    title: 'Frisbee Play Classifier',
    at: '',
    kind: 'Computer Vision',
    date: 'Personal project',
    summary: 'Names the ultimate play being run from a single frame of game film.',
    tile: { src: 'images/frisbee_cover.png', fit: 'cover', bg: '#d8d9d7' },
    headline: 'Reading ultimate frisbee plays from game film',
    context: [
      'A personal project combining computer vision with a sport I play competitively.',
      'The goal: look at a single frame of game film and name which of 7 plays the offense is running.',
    ],
    contextImage: { src: 'images/morefrisbee.jpeg', alt: 'Team USA players holding gold medals in the stands', caption: 'The sport behind the classifier' },
    solution: {
      title: 'A two-stage pipeline',
      image: { src: 'images/frisbee-pipeline.png', alt: 'Pipeline: a broadcast frame, YOLO teammate and opponent detections, a dot map of player positions, and the predicted play', caption: 'Original frame → YOLO detections → dot map → predicted play' },
      challenges: [
        ['Busy frames', 'Broadcast frames are full of sidelines, crowds and overlapping players'],
        ['What matters', 'A play is defined by where players stand, not by how the frame looks'],
      ],
      text: 'A fine-tuned YOLOv8 model finds players and the disc, and each frame is reduced to a simple dot map of positions. A ResNet18 classifier then names the play from the dot map.',
    },
    process: [
      ['Find the players', 'Fine-tuned YOLOv8 on a Roboflow dataset to detect players and the disc: 85% precision and 87% recall across 3 object classes.'],
      ['Simplify the frame', 'Turned detections into dot maps of player positions.'],
      ['Name the play', 'Benchmarked ResNet18 against a custom CNN and EfficientNet-B0; ResNet18 reached 91.3% accuracy at 1/36th the size, 20 points above the custom CNN.'],
    ],
    results: [
      ['91.3%', 'play accuracy'],
      ['7', 'plays recognized'],
      ['85% / 87%', 'detection precision / recall'],
    ],
    reflection: '',
  },
  {
    id: 'speech-dysfluency-removal',
    from: 'speech-dysfluency',
    title: 'Speech Dysfluency Removal',
    at: 'DAML',
    kind: 'Machine Learning',
    date: 'Duke Applied ML',
    summary: 'Finds repeats, pauses and slips in recorded speech and cuts them out.',
    tile: { src: 'images/F1.png', fit: 'contain', bg: '#252b1d' },
    headline: 'Detecting and removing dysfluencies in speech',
    context: [
      'A Duke Applied Machine Learning team project to detect, categorize and remove speech dysfluencies such as repetitions and pauses from recorded audio.',
    ],
    solution: {
      title: 'Transcribe, flag, compare',
      image: { src: 'images/F1.png', alt: 'Classification report with precision, recall and F1 for the five dysfluency types; 79.6% accuracy, macro F1 0.783', caption: 'Precision, recall and F1 for all 5 dysfluency types' },
      challenges: [
        ['Five kinds of slip', 'Repetitions, insertions, deletions, pauses and substitutions each look different'],
        ['A fair comparison', 'Audio features, speech models and LLMs needed to be tested on the same set'],
      ],
      text: 'Whisper transcribes 162 audio clips, and rule-based logic flags and labels 5 dysfluency types. Three classifiers were then benchmarked on an 88-sample test set.',
    },
    process: [
      ['Transcribe', 'Whisper transcripts for 162 audio clips.'],
      ['Flag and sort', 'Rule-based logic labeling 5 dysfluency types: repetition, insertion, deletion, pause and substitution.'],
      ['Compare models', 'A NeMo model reached 79.6% accuracy (0.78 macro F1), 44% above an MFCC random forest and 3 times as accurate as the Llama 3 baseline.'],
    ],
    results: [
      ['79.6%', 'accuracy'],
      ['0.78', 'macro F1'],
      ['5', 'dysfluency types'],
    ],
    reflection: '',
  },
  {
    id: 'event-horizon',
    from: 'event-horizon',
    title: 'Event Horizon',
    at: '',
    kind: 'Game Development',
    date: 'Personal project',
    summary: 'A 3D precision platformer built in Unreal Engine 5.',
    tile: { src: 'images/EventHorizon.png', fit: 'cover', bg: '#2f3a2c' },
    headline: 'Learning game systems by building a platformer',
    context: ['A personal project to learn low-level systems programming and game development workflows in Unreal Engine 5.'],
    solution: {
      title: 'Levels built from reusable parts',
      image: { src: 'images/EventHorizon.png', alt: 'Event Horizon game screenshot', caption: 'Event Horizon in Unreal Engine 5' },
      challenges: [
        ['Precision', 'A precision platformer depends on platforms behaving predictably'],
        ['Reuse', 'Platform behaviors needed settings, not rewrites'],
      ],
      text: 'Blueprints handle in-game triggers and UI, and reusable C++ components add sliding and bouncing platforms with adjustable settings.',
    },
    process: [
      ['Build the levels', 'Blueprints for in-game triggers and UI.'],
      ['Make platforms move', 'Reusable C++ components adding sliding and bouncing platforms with adjustable settings.'],
    ],
    results: [],
    reflection: '',
  },
]

// Each case study with its source entry's role, organisation, dates, tools
// and links filled in (tools also split into a list for the skill chips).
export const caseStudies = studies.map((s) => {
  const source = entries.find((e) => e.id === s.from)
  if (!source) throw new Error(`case study "${s.id}" points at missing entry "${s.from}"`)
  return {
    ...s,
    role: source.org ? source.title : '',
    org: source.org || '',
    when: source.when || '',
    tools: source.tools ? source.tools.split(' · ') : [],
    links: source.links || [],
  }
})

export const findCaseStudy = (id) => caseStudies.find((c) => c.id === id)
