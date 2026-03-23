# Duke's Brotherhood: Where Are They Now?

**dukebrotherhood.com** — A comprehensive documentary profile series covering every significant player across eight eras of Duke basketball under Coach K and Jon Scheyer (1981–present), plus season-by-season team history for all 46 seasons.

## Content Stats (March 2026)
- **238 players** across 8 eras
- **122 profiles complete** with full narrative bios
- **46 season pages** with multi-tab team histories (1980-81 through 2025-26)
- **~905,000 characters** of original, researched narrative (~200,000 words)
- **Average profile:** ~7,400 characters (~1,650 words)
- **27 current NBA players** tracked with live team/stat data
- **~281 auto-generated internal links** (player cross-links + season links)
- **14 list pages**, 7 visualization pages, bracket simulator, "What If?" tool

---

## Project Architecture

```
dukebrotherhood/
├── data/
│   ├── players.json          ← 238 players: bios, stats, NBA data, charities
│   └── teams.json            ← 46 seasons: narratives, stats, UNC games, March
│
├── pages/
│   ├── index.js              ← Home page
│   ├── _app.js               ← Global app wrapper
│   ├── about.js              ← About the project
│   ├── methodology.js        ← Research methodology
│   ├── search.js             ← Search page
│   ├── players/
│   │   ├── index.js          ← All Players listing (/players/)
│   │   └── [slug].js         ← Player profiles (/players/cooper-flagg/)
│   │                            Auto-links player names, charities, seasons
│   ├── teams/
│   │   ├── index.js          ← All Seasons by era (/teams/)
│   │   └── [season].js       ← Season pages (/teams/2024-25/)
│   │                            Six tabs: Players, Season, Stats, GTHC, The Game, March
│   ├── eras/
│   │   ├── index.js          ← All Eras listing (/eras/)
│   │   └── [key].js          ← Era pages (/eras/dynasty1/)
│   ├── lists/
│   │   ├── index.js          ← Lists hub (/lists/)
│   │   └── [slug].js         ← 14 dynamic list pages:
│   │                            all-players, currently-in-nba, number-one-picks,
│   │                            lottery-picks, draft-history, top-nba-scorers,
│   │                            nba-iron-men, mcdonalds-all-americans, coaches,
│   │                            undrafted, by-the-numbers, charities, birthdays
│   ├── viz/
│   │   ├── index.js          ← Viz hub (/viz/)
│   │   ├── nba.js            ← Duke in the NBA by season (bar chart + SEO prose)
│   │   ├── nba-teams.js      ← Duke players by NBA team (all-time + current)
│   │   ├── map.js            ← Recruiting map (geographic origins)
│   │   ├── height.js         ← All players by height
│   │   └── chain.js          ← Brotherhood chain (overlapping careers)
│   ├── bracket.js            ← Bracket simulator (45 Duke teams, NCAA format)
│   └── what-if.js            ← "What If They Stayed?" (early departures)
│
├── components/
│   ├── Layout.js             ← Shared header, nav, footer, SEO meta
│   ├── LinkedText.js         ← Auto-links player names + season references
│   └── SearchOverlay.js      ← Search modal component
│
├── scripts/
│   ├── validate_players.py   ← Pre-push validation (schema, types, completeness)
│   └── generate-sitemap.js   ← XML sitemap generator
│
├── styles/
│   └── globals.css           ← Tailwind + Duke theming
│
├── public/                   ← Static assets (favicon, images)
├── package.json
├── next.config.js            ← Static export configuration
├── tailwind.config.js        ← Duke color palette + custom fonts
└── postcss.config.js
```

---

## How It Works

### Static Site Generation (SSG)
At build time, Next.js reads `data/players.json` and `data/teams.json` and generates standalone HTML pages for every player, every season, every era, every list, and every visualization. No server required. Vercel auto-deploys from GitHub on every push to `main`.

### Auto-Linking
Two systems create a dense internal link network:
- **Player profiles** (`[slug].js`): Scans bio text for player names, charity names, and season strings (e.g., `1991-92` or `1991–92`). Matches both hyphens and em dashes. Season links are restricted to "Road to Duke" and "At Duke" tabs to avoid false positives with NBA season references.
- **Team pages** (`LinkedText.js`): Scans season narratives for player names and cross-season references. Same hyphen/em-dash matching.

### SEO
Every page is pre-rendered as real HTML with `<title>`, `<meta description>`, Open Graph tags, Schema.org JSON-LD, canonical URLs, and proper heading hierarchy. Key pages (viz/nba, draft-history) include rich indexable prose sections targeting common search queries.

---

## Data Schema

### Player (`data/players.json`)

```json
{
  "id": "cooper_flagg",
  "slug": "cooper-flagg",
  "era": "scheyer",
  "name": "Cooper Flagg",
  "pos": "Forward",
  "years": "2024–25",
  "seasons": ["2024-25"],
  "height": "6'9\"",
  "hometown": "Newport, ME",
  "dob": "2006-12-21",
  "tagline": "The most hyped recruit in Duke history.",
  "status": "done",
  "now": "Dallas Mavericks — rookie averaging 20+ ppg",
  "drafted": "1st Rd, 1st — Dallas Mavericks (2025)",
  "stat": "1 Duke season • 39 games • 18.9 ppg",
  "lastUpdated": "2026-03-22",
  
  "bio": {
    "road": "Full text...",
    "duke": "Full text...",
    "after": "Full text...",
    "now": "Full text..."
  },
  
  "nba": {
    "draftYear": 2025,
    "draftPick": 1,
    "draftRound": 1,
    "draftTeam": "Dallas Mavericks",
    "teams": [{"team": "Dallas Mavericks", "seasons": ["2025-26"]}],
    "careerYears": "2025-present",
    "ppg": 20.1, "rpg": 6.7, "apg": 4.5,
    "games": 59
  },
  
  "charity": {
    "name": "The V Foundation for Cancer Research",
    "label": "The V Foundation",
    "description": "Founded by Jim Valvano...",
    "url": "https://www.v.org/",
    "isDefault": true
  },
  
  "sources": [
    {"title": "Source Title", "url": "https://..."}
  ]
}
```

**Key rules:**
- `nba.careerYears` must be a **string** (never integer)
- `nba.teams` must be **objects** with `team` and `seasons` keys (never plain strings)
- `sources` must use `"title"` (never `"label"`)
- Done profiles require `charity`, `lastUpdated`, and `sources`
- `seasons` array drives team page rosters — gaps make players invisible

### Season (`data/teams.json`)

```json
{
  "season": "2024-25",
  "record": "35-4",
  "accRecord": "19-1",
  "tagline": "Flagg's Masterpiece...",
  "overview": "Full season narrative...",
  "march": "NCAA Tournament narrative...",
  "unc": [{"date": "2025-02-01", "result": "W", "score": "87-70", "narrative": "..."}],
  "theGame": {"narrative": "The signature game of the season..."},
  "stats": {
    "team": {"ppg": 84.2, "oppPpg": 65.7, "fgPct": 50.1, ...},
    "leaders": [{"name": "Cooper Flagg", "playerId": "cooper_flagg", "category": "PTS", "ppg": 18.9, "total": 737}]
  },
  "whatIf": {
    "returnees": [{"name": "Cooper Flagg", "id": "cooper_flagg", "wouldBe": "Sophomore", "draftPick": 1, ...}],
    "lotteryCount": 3,
    "futurePros": [{"name": "...", "classYear": "Freshman", "draftPick": 1, ...}]
  },
  "sources": [{"title": "...", "url": "..."}]
}
```

---

## The Update Workflow

### To update a player profile:
1. Open `data/players.json`
2. Find the player by `id` (always use `id`, not `name`, to avoid false matches)
3. Edit fields as needed
4. Run `python scripts/validate_players.py` to check schema compliance
5. Push to GitHub → Vercel auto-rebuilds

### To add a new player:
1. Add entry to the `players` array in `data/players.json`
2. Set `status: "done"` and fill all required fields (bio, charity, lastUpdated, sources)
3. Validate and push

### To add/update a season:
1. Edit the matching season entry in `data/teams.json`
2. All six tabs (Players, Season, Stats, GTHC, The Game, March) pull from this single entry
3. Push to GitHub

---

## Validation

Run before every push:
```bash
python scripts/validate_players.py
```

Catches: integer `careerYears`, string `teams` arrays, missing `charity`/`lastUpdated`, `label` vs. `title` in sources, invalid season formats, numeric type errors on NBA stats.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run Locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### Build for Production
```bash
npm run build
```
Generates static output for deployment.

### Deploy to Vercel
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Point domain (dukebrotherhood.com) to Vercel
4. Every push to `main` triggers automatic rebuild

**Cost:** Free on Vercel's hobby tier.

---

## Design System
- **Colors:** Duke Navy (#001A57), Gold (#C5A258), Cream (#FAF8F3), Slate (#0d1f3c)
- **Fonts:** Playfair Display (headings), EB Garamond (body), Space Mono (labels/stats)
- **Layout:** Four-tab biography (Road to Duke / At Duke / After Duke / Where Is He Now)
- **Internal Links:** Player names, charity names, and season references auto-link throughout

---

## Eight Eras of Duke Basketball

| Era | Years | Seasons | Players | Profiles Done |
|-----|-------|---------|---------|---------------|
| I. Foundation | 1981–86 | 5 | 32 | 13 |
| II. First Dynasty | 1986–94 | 8 | 29 | 15 |
| III. Transition | 1994–98 | 4 | 18 | 9 |
| IV. Second Dynasty | 1998–04 | 6 | 26 | 12 |
| V. Between Crowns | 2004–09 | 5 | 24 | 11 |
| VI. Resurgence + Title | 2009–15 | 6 | 27 | 16 |
| VII. Superteam | 2015–22 | 7 | 45 | 21 |
| VIII. Scheyer Era | 2022– | 4+ | 37 | 25 |

---

## License

This is an independent project. Not affiliated with Duke University or Duke Athletics.

© 2026 Duke's Brotherhood.
