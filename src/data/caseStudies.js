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
//   headline  — the page's opening heading
//
// The page itself is either written out as `sections` (see the first case
// study), or built from the simpler fields below it.
//
//   sections  — [{ id, label, eyebrow?, title?, image?, body }] in page order.
//               label names it in the sidebar; eyebrow is the small line above
//               the heading (defaults to the label). The first section takes
//               the headline as its heading, the role facts and an optional
//               image beside it. body is a list of:
//                 'text'                 a paragraph
//                 { list: [...] }        a numbered list
//                 { points: [[name, line]] }  numbered items with a name
//                 { images: [{ src, alt, caption }] }  full-width pictures
//                 { stats: [[figure, label]] }  big-number callouts
//                 { challenges: [[name, line]], image }  picture + challenges
//                 { links: true }        the entry's links from content.js
//
// Or, without sections:
//   context   — the opening paragraphs
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
    sections: [
      {
        id: 'context',
        label: 'Context',
        eyebrow: 'context & overview',
        image: { src: 'images/labtubes.jpeg', alt: 'Labeled Falcon tubes of Candida samples in a rack', caption: 'Streaked Candida samples in the lab' },
        body: [
          'SGD is the comprehensive database for Saccharomyces cerevisiae research, a species of yeast. The Dietrich Lab asks a broader question: what do we know about genes found in fungi?',
          'I joined as a research intern to add the lab’s dry lab side, using full stack development and web design to study Saccharomyces cerevisiae and Ashbya gossypii.',
        ],
      },
      {
        id: 'problem',
        label: 'Problem',
        title: 'New Approaches To Understanding Genes',
        body: [
          'Currently, genes are compared by their sequence similarity (the letters A, T, G, C), which poses issues:',
          {
            list: [
              'For gene families, near-identical genes are hard to differentiate.',
              'There is no consistent way of querying 8.7 million different genes across different strains.',
              'When genes are rearranged, letter-by-letter sequencing doesn’t register the move.',
              'How do we define “absent”? Letter sequencing would just define genes missing a codon or having a deletion as “absent”.',
            ],
          },
          'My challenge was making this usable: storing and querying data at that scale, then giving scientists an interface they could understand and explore, as the only developer on the team.',
        ],
      },
      {
        id: 'process',
        label: 'Process',
        title: 'Learning from SGD',
        body: [
          'Both webpages started with a large .CSV file cleaned up by the team, producing a database with PostgreSQL, PHP, and React. I first conducted a walkthrough of the product flow of SGD, analyzing the different features and layout that the webpage offered. Three things stood out:',
          {
            list: [
              'A single page layout with a brief introduction lets researchers reach every process from one place.',
              'Dropdown tabs group similar features, so it’s clear where each button lives.',
              'In a database this large, search with autocomplete is essential.',
            ],
          },
          'The main adaptations were adding new tools to the Saccharomyces cerevisiae pangenome and AGD: a 3-D view of the protein/gene structure, followed by Chimera and Foldseek approaches, being able to compare similarities of 3-D structures and proteins across genes and entire species.',
        ],
      },
      {
        id: 'audience',
        label: 'Audience',
        title: 'Designing for the Audience',
        body: [
          'The people using these sites are researchers, and they usually arrive with a specific goal: find a gene, understand it, and get back to their work. So I designed around the questions they bring to the page rather than around what would look impressive. The 3D view answers “what does this gene look like?” The Chimera and Foldseek comparisons answer “what else resembles it?”, which sequence matching alone handles poorly. Familiar features stayed where researchers expected them, and each new tool went in a logical place, so the site could grow without becoming unfamiliar.',
        ],
      },
      {
        id: 'visuals',
        label: 'Visuals',
        body: [
          {
            images: [
              { src: 'images/agd_preview.png', alt: 'AGD gene overview page with orthologs table and genome browser', caption: 'Gene overview page in the Ashbya Genome Database, with orthologs and the genome browser' },
            ],
          },
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        title: 'Results',
        body: [
          {
            stats: [
              ['1,482', 'yeast strains mapped'],
              ['< 10 ms', 'per query'],
              ['6,294', 'genes searchable'],
              ['15', 'researchers using it'],
            ],
          },
          { links: true },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'Looking back',
        body: [
          'As the only programmer in the lab, I was responsible for the whole path from a cleaned CSV to something a scientist could actually use. That taught me that how data is stored and how it is presented can’t be separated. A database with millions of genes is only useful if people can ask it questions quickly, so decisions about structure and query speed shaped what the interface could offer.',
          'It also showed me how much I needed to understand the science to design well. Deciding what to display meant understanding why sequence comparison fell short at ordering similarity in the first place.',
          'Most of my effort has gone into making features work and getting the database fast enough to query. Leaning more toward engineering than design, it is a good foundation for what is coming next.',
        ],
      },
      {
        id: 'next',
        label: 'Next steps',
        title: 'Some next steps',
        body: [
          {
            points: [
              ['Product design', 'With the features working and queries optimized, the next phase is how the site feels to use. I want to review each tool’s flow the way I first reviewed SGD, and watch researchers use the site to see where they hesitate or miss a feature. The goal is making the 3D views and structure comparisons easy to find and understand for someone seeing them for the first time.'],
              ['Publication', 'I am working toward publishing a paper on the pangenome and the Ashbya gossypii database, so the resources and the approach behind them can reach the wider research community.'],
            ],
          },
        ],
      },
    ],
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

// The sections of a case study written with the simpler fields
const toSections = (s) => [
  { id: 'context', label: 'Context', eyebrow: 'context & overview', image: s.contextImage, body: s.context },
  {
    id: 'solution',
    label: 'Solution',
    title: s.solution.title,
    body: [{ challenges: s.solution.challenges, image: s.solution.image }, s.solution.text],
  },
  { id: 'process', label: 'Process', title: 'How it came together', body: [{ points: s.process }] },
  ...(s.results.length
    ? [{ id: 'results', label: 'Results', eyebrow: 'impact', title: 'Results', body: [{ stats: s.results }, { links: true }] }]
    : []),
  ...(s.reflection ? [{ id: 'reflection', label: 'Reflection', title: 'Looking back', body: [s.reflection] }] : []),
]

// Each case study with its sections, and its source entry's role,
// organisation, dates, tools and links filled in (tools also split into a
// list for the skill chips).
export const caseStudies = studies.map((s) => {
  const source = entries.find((e) => e.id === s.from)
  if (!source) throw new Error(`case study "${s.id}" points at missing entry "${s.from}"`)
  return {
    ...s,
    sections: s.sections || toSections(s),
    role: source.org ? source.title : '',
    org: source.org || '',
    when: source.when || '',
    tools: source.tools ? source.tools.split(' · ') : [],
    links: source.links || [],
  }
})

export const findCaseStudy = (id) => caseStudies.find((c) => c.id === id)
