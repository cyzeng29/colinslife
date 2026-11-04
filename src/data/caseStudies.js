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
//               framed screenshot), 'cover' (fills the tile, cropping to fit),
//               'whole' (edge to edge, never cropped; set bg to the picture's
//               background colour so the two run together) or 'phone'; bg
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
//                 { images: [{ src, alt, title?, caption }] }  full-width pictures;
//                                        add beside: true for smaller ones with
//                                        their captions to the side, or columns:
//                                        a CSS grid column list such as '1fr 2fr'
//                                        to set them side by side. title is a
//                                        heading over the caption
//                 { video: { src, alt, caption } }  a silent full-width clip that
//                                        loops (from public/videos/)
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
    title: 'Genome Database',
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
            beside: true,
            images: [
              { src: 'images/agd_3d.png', alt: 'Pangenome gene page for YAL001C with biological function, locus details and a 3-D protein structure view', title: 'Pangenome Gene Page', caption: 'Shown for YAL001C (TFC3) in the S. cerevisiae pangenome browser. The page presents biological function, Gene Ontology terms, locus details and phenotype data alongside a 3-D model of the protein structure.' },
              { src: 'images/agd_foldseek.png', alt: 'Foldseek structure search form comparing an A. gossypii gene against S. cerevisiae AlphaFold structures, with a results table', title: 'Foldseek Structure Search', caption: 'Compares the A. gossypii gene AGR387C against 5,708 S. cerevisiae S288C AlphaFold structures. Each hit is listed with its percent identity, E-value, TM-score and LDDT, revealing structural matches that sequence comparison alone may miss.' },
              { src: 'images/agd_overview.png', alt: 'AGD overview page for AAL004W with locus details, S. cerevisiae orthologs and their 3-D structures', title: 'AGD Gene Overview', caption: 'Shown for AAL004W in the Ashbya Genome Database. The page lists the gene’s identifiers and annotations, its syntenic S. cerevisiae ortholog (YCL005W, LDB16) and the 3-D structures for comparison.' },
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
    title: 'AI Merchandise Planning',
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
    headline: 'Envisioning SIZEO Dashboard',
    sections: [
      {
        id: 'context',
        label: 'Context',
        eyebrow: 'context & overview',
        image: { src: 'images/Quantworks.jpeg', alt: 'Colin at his desk in the Quantworks office' },
        body: [
          'I worked as a software engineer intern in Quantworks and SIZEO, startups focused on using machine learning and cutting-edge analytics, where I was tasked with designing the interface and features.',
          'The companies’ purpose was to help global fashion brands such as JCPenney and Aeropostale reduce inventory cost and increase margins using AI. Along with the backend engineers that were beta testing features the product could perform, I was the sole UX designer of the team.',
        ],
      },
      {
        id: 'goal',
        label: 'Goal',
        title: 'Specific Towards Fashion Brands',
        body: [
          'Making the interface clean for retail clients that are not as tech-oriented, and making analytics and metrics available to inform users of inventory decisions.',
        ],
      },
      {
        id: 'research',
        label: 'Research',
        title: 'Understanding the Agentic Tools',
        body: [
          'To build a strong foundation of the tools performed by different agents, I began by having discussions with my manager and senior engineers to review each agent’s role and what each person of the team was currently programming.',
        ],
      },
      {
        id: 'process',
        label: 'Process',
        title: 'Categorizing Visualizations',
        body: [
          'Starting with wireframes, my goal was to turn it into graphs that users could find without help, so I gave each screen a single job. For example, the Trend Almanac defines the six trend types with standardized definitions. Trend Identification then takes one trend and lays out the evidence: a list of trends to choose from, a chart that splits historical data from the predicted trend at today’s date, and a table of the products behind it with sales, dollar sales, sell through and inventory. Map Store View answers the last question, where the trend is happening, with filters for trend classification and distance, bubbles for store clusters, and a store list with each location’s forecasted trend. Because each screen answers one question, users can move from what a trend is, to whether the numbers support it, to where it matters.',
          {
            video: {
              src: 'videos/quantworks_trends.mp4',
              alt: 'Walkthrough of the SIZEO Trend Almanac, Trend Identification and Map Store View screens',
              caption: 'Trend Almanac, Trend Identification and Map Store View',
            },
          },
        ],
      },
      {
        id: 'artifacts',
        label: 'Multi-Trend Tool',
        eyebrow: 'process',
        title: 'Multi-Trend Tool Development and Artifact Gallery',
        body: [
          'Beyond designing this screen, I built in the trend/multi-trend tool. When a size agent finishes a job, the results panel shows the downloadable size curve for products across stores and a table of the underlying numbers. Every chart and report the agents create is also saved to the Artifact Gallery, so users can reopen, filter, and download past results.',
          {
            images: [
              { src: 'images/figma.png', alt: 'Figma prototype of the artifact gallery for LLM output analysis', caption: 'Figma prototype of the job selection window and artifact gallery' },
            ],
          },
        ],
      },
      {
        id: 'agents',
        label: 'Agents & Chatbot',
        eyebrow: 'process',
        title: 'Intuitive Management of Agents and Chatbot',
        body: [
          {
            video: {
              src: 'videos/quantworks_agents.mp4',
              alt: 'Walkthrough of the SIZEO chatbot, an agent overview page, an agent’s work summary with results, and the Artifact Gallery',
              caption: 'The chatbot, agent overview, agent work summary and Artifact Gallery',
            },
          },
        ],
      },
      {
        id: 'scope',
        label: 'Scope',
        eyebrow: 'impact',
        title: 'Scope',
        body: [
          {
            stats: [
              ['30+', 'dashboards'],
              ['6', 'agents'],
              ['Millions', 'of SKUs processed weekly'],
              ['~10', 'enterprise clients'],
              ['100s', 'of users on the platform'],
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
          {
            points: [
              ['Tools in Process with Developers', 'I created several screen recordings to explain the thinking behind the dashboard to our developers. The tools are still being refined: as we talk with customers, we keep updating the purpose of each agent and how each tool works.'],
              ['Understanding Trends with New Factors', 'Working with GLP-1 trend data showed me that trends are shaped by more than fashion cycles and past sales. As more people use these medications, body sizes are changing, and so is the demand for each size. I learned that a forecasting tool has to account for outside factors, otherwise it can recommend inventory that no longer matches what customers need.'],
              ['Designing Customer Interface', 'The dashboard served planners, buyers and managers, and each group came with its own goals, which often conflicted. Designing for all of them taught me to organize information in layers. A clear, high level overview lets anyone grasp the key metrics at a glance, and more detailed views give each user the depth their role requires.'],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'snaily',
    from: 'snaily',
    title: 'Snaily',
    at: '',
    kind: 'Product Design & Engineering',
    date: 'SVSD design competition',
    summary: 'Customizable digital postcards for families and loved ones who live far apart.',
    tile: { src: 'images/snaily_cover.png', fit: 'whole', bg: '#d8d9d7' },
    headline: 'The love of physical snail mail turned digital',
    sections: [
      {
        id: 'about',
        label: 'About',
        eyebrow: 'context & overview',
        image: { src: 'images/snaily_logo.png', alt: 'The Snaily logo: a smiling snail on a postage stamp beside the word Snaily, on deep red' },
        body: [
          'The Silicon Valley School of Design (SVSD) hosted a national, virtual design and prototyping competition for students, built around the theme of storytelling. Alayna and I teamed up to design something for a very specific audience: families and loved ones who live far apart. I was a co-product designer and software engineer, and we implemented the app and live demo over the course of a week.',
          { links: true },
        ],
      },
      {
        id: 'problem',
        label: 'Problem',
        title: 'Online Communication is Restrictive',
        body: [
          'Texting between immigrant parents and their kids can feel one-dimensional and repetitive. Additionally, a language barrier makes it harder to say what you feel, so messages shrink down to logistics.',
          'Coming to college, the texts my parents and I send each other are a good example. They are practical and leave behind parts of a more substantial update. Further exemplified with my extended family in China, I’ve always regretted not being more in touch with them – the languages and distance kept us apart.',
          'Many other second generation kids told us the same thing. So we asked ourselves how we could show effort in communication in a way that texting never can.',
        ],
      },
      {
        id: 'values',
        label: 'Values',
        title: 'Three ideas borrowed from the mailbox',
        body: [
          'Before we designed anything, we wanted to understand the problem and the values that should sit behind it. Texting can feel dry. It does not show intention or care, especially for parents and kids who already have a communication barrier. So how do you show care in a digital world?',
          'We thought about physical snail mail and postcards. You can see the care in them, because someone spent time personalizing each one. That gave us three central values:',
          {
            points: [
              ['Customization', 'Every postcard should feel like it was made by one person for one person.'],
              ['Intention', 'The time and thought behind a message should be visible.'],
              ['Connection', 'Personal touches that keep families and relationships close when they are far apart.'],
            ],
          },
          'We carried these ideas into every part of the app, while still making it feel like a story the recipient gets to open.',
        ],
      },
      {
        id: 'ideation',
        label: 'Ideation',
        title: 'Rough ideas first',
        body: [
          'These are our very first ideas for the different pieces of Snaily, some on paper and some drawn out. They show how we were thinking. From screen to screen, we made sure at least one creative feature stayed in place to protect customization, and that every digital gift kept the intention you feel in physical mail.',
          'The scrapbook style photo section is my favorite example. It carries over the warmth of something handmade and extends it to the relationship on the other end.',
          {
            columns: '1124fr 2098fr', // their widths, so the two come out the same height
            images: [
              {
                src: 'images/snaily_ideation_paper.jpeg',
                alt: 'Handwritten notebook page mapping out Snaily: notes on making messages more personal, a flow of sketched screens for writing and sending a postcard, and a sketch of the receiving side',
                caption: 'Paper first: the sending and receiving flows sketched in a notebook',
              },
              {
                src: 'images/snaily_ideation_digital.png',
                alt: 'Digital sketches on a dark canvas: snail stamps, hand-drawn app icons for the archive, home and settings, an envelope with a snail, and rough photo and postcard screens',
                caption: 'Then drawn out: snail stamps, navigation icons and early photo screens',
              },
            ],
          },
        ],
      },
      {
        id: 'iteration',
        label: 'Iteration',
        title: 'Three versions',
        body: [
          'Each version taught us something about who we were designing for.',
          {
            points: [
              ['First AI prototype', 'Prompted with features we wanted to keep, like an archive for postcards. The tradeoff: overpowering screens with too much text. That created friction and cognitive load, especially for parents who may not be comfortable with technology, and left no room for personalization.'],
              ['Second iteration', 'Added more customization, like choosing postcards and customizing uploaded photos. The tradeoff: it still lacked personalization features, and gave far less creative freedom than where we ended up.'],
              ['Final solution', 'A simple, straightforward flow with interactive, customizable elements at every step. It streamlines both sending and receiving. The tradeoff: it needs testing with real users to find the friction we cannot see yet.'],
            ],
          },
          {
            columns: '678fr 632fr 672fr', // their widths, so they come out the same height
            images: [
              {
                src: 'images/snaily_iteration_1.png',
                alt: 'First prototype, called snailpost: a cream screen with several lines of text asking what you would like to send home today',
                title: 'First AI prototype',
                caption: 'Clean, but heavy on text with little room to personalize',
              },
              {
                src: 'images/snaily_iteration_2.png',
                alt: 'Second version on a deep red background: a note editor reading a note from me to you, with color swatches and flip and next buttons',
                title: 'Second iteration',
                caption: 'Warmer, with first steps towards choosing colors',
              },
              {
                src: 'images/snaily_iteration_3.png',
                alt: 'Final version: a Craft Your Postcard screen with a carousel of illustrated cards, color choices and stamps',
                title: 'Final solution',
                caption: 'A simpler flow, with creative choices at every step',
              },
            ],
          },
          'The final version is the best approach for our audience. Those small customization details were essential to us, because they are how a screen can carry more love.',
          {
            video: {
              src: 'videos/snaily_walkthrough.mp4',
              alt: 'Walkthrough of Snaily on phones: the welcome screen, crafting and writing a postcard, drawing on a photo, arranging the postcard, sending it off and receiving it',
              caption: 'The final flow: welcome, craft and write, draw on a photo, arrange, send it off and receive it',
            },
          },
        ],
      },
      {
        id: 'decisions',
        label: 'Design Decisions',
        title: 'Design Decisions',
        body: [
          'Our biggest design decisions came from serving two audiences at the same time: younger kids and older parents. Whatever we added had to feel fun to one and easy to the other.',
        ],
      },
      {
        id: 'photos',
        label: 'Photos',
        eyebrow: 'design decisions',
        title: 'Photos without the clutter',
        body: [
          'At first, you could only add a photo. We wanted to offer real customization without piling controls onto the screen, so we made two changes:',
          {
            list: [
              'Tapping a photo reveals three options (draw on it with a marker, replace it, or write a caption) and centers the chosen image, so only one thing is on screen at a time.',
              'We offered a grid view and a canvas view.',
            ],
          },
          {
            images: [
              {
                src: 'images/snaily_photos.png',
                alt: 'Three Snaily photo screens: photos in a tidy grid, the same photos taped loosely on a canvas, and one photo centered and enlarged with a caption reading hi there',
                caption: 'Grid view, canvas view, and one photo centered to add a caption',
              },
            ],
          },
        ],
      },
      {
        id: 'envelope',
        label: 'Envelope',
        eyebrow: 'design decisions',
        title: 'Envelope or no envelope',
        body: [
          'Alayna wanted to copy a physical envelope as closely as possible, with photos kept separate from the postcard. I disagreed. Separate photos and postcards would not feel like a new idea. It sits too close to texting someone a photo, it does not add to our mission of finding more unique and personal ways to send messages, and people can already send photos and postcards in any messaging app.',
          'We settled on a compromise: a toggle between two views. One has a paper clip of photos, where you choose the order they appear. The other is a free flowing canvas.',
          {
            columns: 'repeat(2, minmax(0, 1fr))',
            images: [
              {
                src: 'images/snaily_envelope_clip.png',
                alt: 'Your Postcard screen in paper clip view: photos clipped to a blue snail postcard, with an option to reorder them',
                caption: 'Paper clip view: choose the order the photos appear',
              },
              {
                src: 'images/snaily_envelope_canvas.png',
                alt: 'Your Postcard screen in canvas view: photos spread freely around a blue snail postcard',
                caption: 'Canvas view: photos flow freely around the postcard',
              },
            ],
          },
        ],
      },
      {
        id: 'reflection',
        label: 'Reflection',
        title: 'What I took away',
        body: [
          'We learned to balance audiences and design for different kinds of relationships. We added features that serve both sides of a postcard, so people can tell a story with words and photos together.',
          'The second lesson was about process. We ran a constant feedback loop, learning to keep critiquing our own work. Small 1% improvements every round compounded into big changes.',
        ],
      },
      {
        id: 'next',
        label: 'Next steps',
        title: 'Next steps',
        body: [
          {
            points: [
              ['Improve the craft', 'Streamline the visuals, then test the prototype with real users to find their frustrations and friction.'],
              ['Audio options', 'Let the letter be read aloud. Alayna knows her own parents would value this, and it adds another warm touch.'],
              ['Translation', 'Translate smoothly between languages right on the postcard.'],
              ['Themed postcards', 'For example, a Chinese New Year card.'],
              ['Prompts', 'Suggestions for what to write and which photos to add, tailored to someone’s background.'],
            ],
          },
        ],
      },
    ],
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
