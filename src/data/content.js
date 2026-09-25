// Edit the arrays below to add, remove, or update entries.
// Every card on the Work page is generated from this file — no JSX editing needed.

export const experience = [
  {
    title: 'Undergraduate Research Intern',
    org: 'Dietrich Lab, Duke University',
    when: 'Jan 2026 — present',
    bullets: [
      'Designed a PostgreSQL schema mapping 1,482 yeast strains across core genes and pangenome traits',
      'Built a full-stack frontend loading 10,000+ genes with SQL-backed queries (pondslime.ccn.duke.edu)',
      'Used AlphaFold and BLAST for protein prediction and sequence alignment',
    ],
    tools: 'React · JavaScript · PostgreSQL · AlphaFold · BLAST',
  },
  {
    title: 'Software Engineer Intern',
    org: 'Quantworks / SIZEO, Durham NC',
    when: 'Oct 2024 — Aug 2025',
    bullets: [
      'Helped build a platform using the Claude API to optimize budget, packaging, and seasonal inventory for retail clients including JCPenney and Aeropostale',
      'Built backend data pipelines in Python, visualized with Streamlit and Plotly',
      'Designed dashboards in Figma and built an artifact gallery for LLM output analysis',
    ],
    tools: 'Python · Claude API · Streamlit · Plotly · Figma',
  },
  {
    title: 'Research Intern',
    org: 'NCSSM Summer Research Programs',
    when: 'Summer 2023 — Summer 2024',
    bullets: [
      'Presented research on agent-based neuron modeling, real gas behavior, and a modified cholera transmission model incorporating vaccination effects',
    ],
    tools: 'Mathematica · STELLA · Gaussian · NetLogo · Maple',
  },
]

export const projects = [
  {
    title: 'Speech Dysfluency Detection & Removal',
    bullets: [
      'End-to-end pipeline to detect, categorize, and remove speech dysfluencies',
      'Used Whisper to transcribe audio and rule-based logic to flag dysfluency types',
      'Benchmarked a custom random forest classifier against a premade model',
    ],
    tools: 'Python · Whisper · scikit-learn',
  },
  {
    title: 'Insight — Journal Reflection App',
    bullets: [
      'React app generating reflective prompts from journal entries via an open-weight LLM (gpt-oss-20b) over the Groq API',
      'From-scratch retrieval system using vectorization and cosine similarity',
      'Client-side isolation using SHA-256 hashed API keys — no raw credentials stored',
    ],
    tools: 'React · Groq API · LLM integration',
  },
  {
    title: 'Ultimate Frisbee Play Classifier',
    bullets: [
      'Fine-tuned YOLOv8 on labeled field-photo data — 85% precision, 87% recall',
      'Converted detections into dot-map representations for a downstream play classifier',
      'Benchmarked ResNet18 against a self-built CNN and EfficientNet-B0; ResNet18 hit 91.3% accuracy at 1/36th the size',
    ],
    tools: 'PyTorch · YOLOv8 · Computer vision',
  },
  {
    title: 'Event Horizon — Unreal Engine 5',
    bullets: [
      'Personal project to learn low-level systems programming and game dev workflows',
      'Built gameplay systems with C++ components and Blueprint scripting (kooling.itch.io)',
    ],
    tools: 'C++ · Unreal Engine 5 · Blueprints',
  },
]
