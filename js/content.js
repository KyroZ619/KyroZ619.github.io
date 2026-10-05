/* ==========================================================================
   content.js — edit your info here.
   Facts below come from Kyro's résumé notes.
   Double-check anything marked  // CHECK  before publishing.
   ========================================================================== */
window.SITE = {
  name: 'Kyro Zhao',
  email: 'boxinzhao619@gmail.com',
  instagram: 'https://www.instagram.com/kyrozzzhao/',
  linkedin: '',                           // CHECK: paste your LinkedIn URL to show the button
  resume: 'assets/Kyro_Zhao_Resume.pdf',  // CHECK: drop your PDF résumé at this path

  /* ---------- CASE FILES (the poster wall) ----------
     style: naive | pixel | pop | flat | fuzzy | collage  — each poster gets its own art style */
  projects: [
    {
      id: 'session-ledger',
      style: 'pixel',
      kicker: 'Music-Tech Product',
      title: 'Session Ledger',
      role: 'Founder · product, design & full-stack build',
      date: '2026.03 — now',
      hook: 'A fair-split tool for songwriting sessions: log who did what, talk splits, lock the record.',
      metric: { n: '0 → 1', l: 'in 3 months — no CS background' },
      context: 'Co-writing at music school is fun until someone asks “so… who gets what?” Contributions are fuzzy, split talks are awkward, and nothing gets written down.',
      did: [
        'Defined the product, flows and UI, then built the front-end, database and deployment myself — vibe-coding with Claude and Cursor.',
        'Shipped an MVP around three moments: Contribution Logging → Split Discussion → Final Record Confirmation.',
        'Ran tests with music students and indie artists, collected real feedback and kept iterating.'
      ],
      outcome: [
        'Deployed by faculty to Raidar — a nonprofit music platform by MIT & Berklee — opening to students at both schools.'
      ],
      tools: ['Product design', 'User testing', 'Music copyright', 'Claude', 'Cursor', 'Vercel'],
      link: { href: 'https://sessionledger.vercel.app/', label: 'open sessionledger.vercel.app ↗' }
    },
    {
      id: 'go-for-show',
      style: 'pop',
      kicker: 'Tour-Tech Internship',
      title: 'Go For Show',
      role: 'Product Intern @ Articulate Entertainment · remote',
      date: '2026.01 — 2026.05',
      hook: 'Stress-testing an in-house tour-ops tool used on real artist tours.',
      metric: { n: 'A-list', l: 'tour-ops tool, used on real tours' },
      context: 'Articulate Entertainment (est. 2011) runs touring & live production for artists like Doechii and SZA. Go For Show is its in-house tool for running a tour day — itineraries, riders, cross-team handoffs.',
      did: [
        'Tested builds in depth and sent steady bug reports and feature ideas to the product team.',
        'With the company’s support, brought Go For Show into the Berklee Music Business Club and MB / product classes — ran trials with real musicians and students.',
        'Turned scattered feedback into a user-perspective product report, benchmarked against similar tools.'
      ],
      outcome: [
        'Fed the team’s requirements pool and pushed UX fixes across several versions.',
        'Learned how a show really gets on the road — and how to turn user pain into product language.'
      ],
      tools: ['QA & bug reports', 'User research', 'Benchmarking', 'Touring ops']
    },
    {
      id: 'culture-night',
      style: 'naive',
      kicker: 'Live Event',
      title: 'Asian Culture Night',
      role: 'Event planning & operations lead',
      date: '2022.02 — 2022.04',
      hook: 'A school-wide culture night that sold out a full week early.',
      metric: { n: '100%', l: 'seats filled · sold out 1 week early' },
      context: 'The goal: more buzz, better ticket conversion and a better night for the audience — on a student-club budget.',
      did: [
        'Programmed the show from trend research, polls and audience surveys — anime IP and K-pop acts people actually wanted.',
        'Ran socials: 20+ posts on Instagram & WeChat (behind-the-scenes, guest reveals, countdown posters) plus a #OOTD challenge for user-generated content.',
        'Designed referral ticketing — group discounts and share-to-win free tickets.',
        'Pitched local Chinese-owned businesses and landed 2 sponsors (food, prizes & cash) for a pre-show check-in wall and raffle.'
      ],
      outcome: ['Sold out a week early · 100% seats filled', '200+ person community · +30% social buzz', 'The school’s most popular Asian Culture Night in years'],
      tools: ['Event ops', 'Social campaigns', 'Sponsorship', 'Audience research']
    },
    {
      id: 'song-camp',
      style: 'flat',
      kicker: 'Songwriting Camp',
      title: '72-Hour Song',
      role: 'Project lead & main writer · team of 3',
      date: '2024.08',
      hook: 'A release-ready pop song in 72 hours — plus Best Concept and Best Melody.',
      metric: { n: '72h', l: 'from blank page to finished song' },
      context: 'Original songwriting camp: build a team, get a theme, deliver a commercial-standard pop song in 72 hours.',
      did: [
        'Pitched 3 concept directions from theme research and reference tracks; the team locked one fast.',
        'Led 4 brainstorms, split tasks by strengths, kept the timeline honest — 85% of the arrangement and motifs done on day one.',
        'Wrote every melody and the rap (100% kept); co-wrote lyrics and arrangement; sang lead and coached the vocal session.'
      ],
      outcome: ['Finished 12 hours early', '#1 peer vote · #2 judges · Best Concept · Best Melody'],
      tools: ['Topline & rap', 'Logic Pro', 'Vocal production', 'Team lead']
    },
    {
      id: 'vocal-tutor',
      style: 'fuzzy',
      kicker: 'Teaching',
      title: 'Vocal Tutor',
      role: 'Cross-Instrument Exchange Program',
      date: '2025.01 — now',
      hook: 'Built a singing curriculum for non-singers — and got voted a top-3 tutor.',
      metric: { n: '45h+', l: 'taught · 10+ students' },
      context: 'Selected as the voice department’s student rep to teach singing to instrumentalists.',
      did: [
        'Turned faculty material, books and online resources into a system: 3 core methods and 200+ exercises (breath, technique, diction).',
        'Added 15 vocal-health habits, 10 singer stretches and live-performance coaching.',
        'Tracked each student’s sticking points and progress, and adjusted lessons week by week.'
      ],
      outcome: ['Top 3 tutor in student satisfaction (first-cycle review)'],
      tools: ['Curriculum design', 'Coaching', 'Cross-cultural communication']
    }
  ],

  /* ---------- ORIGINAL MUSIC (shown first in Case Files) ---------- */
  songs: [
    {
      id: 'paradise',
      title: 'Paradise',
      file: 'assets/music/paradise.mp3',
      cover: 'assets/covers/paradise.jpg',
      tagline: 'If you could already see the danger behind the sweetness, would you still taste this fatal temptation with me?',
      credits: [
        ['Vocals', 'Kyro'], ['Lyrics', 'Kyro'], ['Composition', 'Kyro'],
        ['Arrangement', 'Zheng He, Kyro'], ['Mixing & mastering', 'RSS Studios']
      ],
      tags: ['Phrygian dominant', 'African percussion', 'Trap', 'Rap + vocals'],
      story: [
        'Paradise is a descent you can’t resist and can’t win: a psychological game of desire, struggle and surrender.',
        'The Phrygian dominant scale gives the song its mysterious, predatory edge. Every note is a silky line with a threat hidden inside, tightening as the emotion builds. African percussion is the heartbeat: raw, primal drums fused with trap create a rhythm that is wild and dangerous, seductive but feral, like a ritual from somewhere dark.',
        'From the reckless rap of the opening to the whispered spell of the pre-chorus, you slowly lose your grip and step toward the edge. When the chorus breaks, the melody coils around you like a snake and there is no way out. “Swallow you in one gulp like a viper.”',
        'Kyro’s voice is dangerous, lethal and addictive. Once you cross the red line and taste the forbidden fruit, there is no turning back. You surrender willingly to the trap and sink completely into Paradise.'
      ]
    },
    {
      id: 'take-my-heart-away',
      title: 'Take My Heart Away',
      file: 'assets/music/take-my-heart-away.mp3',
      cover: 'assets/covers/take-my-heart-away.jpg',
      tagline: 'Even if we live in different worlds, I will keep watching over you in my own way.',
      credits: [
        ['Vocals', 'Kyro'], ['Lyrics', 'Kyro, Junhao'], ['Composition', 'Kyro'],
        ['Arrangement', 'Alex Tao, Kyro, Junhao'], ['Backing vocals', 'Kyro, Junhao'], ['Mixing & mastering', 'Alex Tao, Kyro']
      ],
      tags: ['Ballad', 'Greek myth', 'Storytelling', 'Co-write'],
      story: [
        'Take My Heart Away is an eternal promise, and the courage to give everything for love.',
        'Legend has it that Dionysus, the Greek god of wine, once spilled the wine of love onto a white rose. It soaked into the petals like blood; the white rose turned crimson and its fragrance filled the sky. A bee, drawn by the scent, fell deeply in love with the flower.',
        'When Cupid reached out to pick the rose, the bee stung the god’s finger to protect it. Furious, Venus pulled out the bee’s stinger and tossed it into the flowerbed, where it took root in the rose’s stem and became its thorns.',
        '“If my death can save your situation.” This is a conversation across souls, across life and death. Stripped of its sting, the bee found a new purpose: it became a knight, guarding the rose until the end of time.'
      ]
    }
  ],

  /* ---------- what pixel-Kyro says in each section ---------- */
  lines: {
    hello: ['hi! I’m pixel Kyro ✿', 'scroll — I’ll give you the tour!', 'in a hurry? résumé is up top ↗'],
    about: ['headphones on, brain on ♪', 'jazz → R&B → C-pop → K-pop. no skips.', 'taught myself sax in one semester!'],
    work: ['business mode: ON', 'click a poster to open the case file!', 'numbers go up ↗'],
    tracklist: ['every job is a track ♫', 'side A: work. side B: school.', 'this one’s a banger →'],
    lineup: ['now presenting… the lineup!', 'headliner: product thinking!', 'EN · Mandarin · Korean = triple album'],
    backstage: ['hire me? pretty please ♥', 'thanks for reading my diary!', 'say hi — I reply fast ✿'],
    travel: ['wheee!', 'coming!', 'wait for me!', 'next page →'],
    poke: ['hehe that tickles', 'boop!', 'I’m 64×64 pixels of hire-able', 'Berklee MB, class of 2028 ✶']
  }
};
