// components/LinkedText.js
// Automatically links player names and season references in text
// Player names link to profile pages; seasons link to team pages
// Only links profiled players (status: 'done')

import Link from 'next/link';
import playerData from '../data/players.json';

// Generate all Duke season strings (1980-81 through 2025-26) without importing huge teams.json
const ALL_DUKE_SEASONS = [];
for (let y = 1980; y <= 2026; y++) {
  const end = String(y + 1).slice(-2);
  ALL_DUKE_SEASONS.push(`${y}-${end}`);
}

// Build lookup of profiled players, sorted longest name first to avoid partial matches
const profiledPlayers = playerData.players
  .filter(p => p.status === 'done' || p.status === 'pledged')
  .map(p => ({ name: p.name, slug: p.slug }))
  .sort((a, b) => b.name.length - a.name.length);

// Build season patterns with both hyphen and en-dash variants
const seasonLinks = [];
const seasonToHref = {};
ALL_DUKE_SEASONS.forEach(s => {
  seasonLinks.push(s);
  seasonToHref[s] = s;
  const enDashVariant = s.replace('-', '\u2013');
  seasonLinks.push(enDashVariant);
  seasonToHref[enDashVariant] = s;
});

// Also match common short names / last names for very famous players
// Only add these if they won't cause false positives
const ALIASES = {
  // Last-name-only aliases (only for unique, famous players)
  'Dawkins': 'johnny-dawkins',
  'Laettner': 'christian-laettner',
  'Hurley': 'bobby-hurley',
  'Grant Hill': 'grant-hill',
  'Battier': 'shane-battier',
  'Redick': 'jj-redick',
  'Amaker': 'tommy-amaker',
  'Bilas': 'jay-bilas',
  'Alarie': 'mark-alarie',
  'Ferry': 'danny-ferry',
  'Billy King': 'billy-king',
  'Brickey': 'robert-brickey',
  'Nessley': 'marty-nessley',
  'Cooper Flagg': 'cooper-flagg',
  'Scheyer': 'jon-scheyer',
  'Snyder': 'quin-snyder',
  'Duhon': 'chris-duhon',
  'Abdelnaby': 'alaa-abdelnaby',
  'Boozer': 'carlos-boozer',
  'Maggette': 'corey-maggette',
  'Carrawell': 'chris-carrawell',

  // Alternate full names (Jr./III/periods/nicknames)
  'Jason Williams': 'jay-williams',
  'Mike Dunleavy': 'mike-dunleavy-jr',
  'J.J. Redick': 'jj-redick',
  'Wendell Carter': 'wendell-carter-jr',
  'Marvin Bagley': 'marvin-bagley-iii',
};

export default function LinkedText({ text, className }) {
  if (!text) return null;

  // Build combined pattern: full names + aliases + seasons
  const allPatterns = [];

  profiledPlayers.forEach(p => {
    allPatterns.push({ pattern: p.name, slug: p.slug, type: 'player' });
  });

  Object.entries(ALIASES).forEach(([alias, slug]) => {
    // Only add if not already covered by full name
    if (!allPatterns.find(p => p.pattern === alias)) {
      allPatterns.push({ pattern: alias, slug, type: 'player' });
    }
  });

  // Add season patterns (e.g., "2024-25" and "2024–25" → /teams/2024-25/)
  seasonLinks.forEach(season => {
    const canonical = seasonToHref[season] || season;
    allPatterns.push({ pattern: season, slug: canonical, type: 'season' });
  });

  // Sort by pattern length descending to match longest first
  allPatterns.sort((a, b) => b.pattern.length - a.pattern.length);

  // Build regex that matches any player name or season
  const escaped = allPatterns.map(p => p.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  // Split text into segments
  const parts = text.split(regex);

  // Map patterns to data for quick lookup
  const patternLookup = {};
  allPatterns.forEach(p => { patternLookup[p.pattern] = p; });

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = patternLookup[part];
        if (match && match.type === 'player') {
          return (
            <Link
              key={i}
              href={`/players/${match.slug}/`}
              className="text-duke-gold hover:text-duke-navy border-b border-duke-gold/30 hover:border-duke-navy transition-colors"
            >
              {part}
            </Link>
          );
        }
        if (match && match.type === 'season') {
          return (
            <Link
              key={i}
              href={`/teams/${match.slug}/`}
              className="text-duke-gold hover:text-duke-navy border-b border-duke-gold/30 hover:border-duke-navy transition-colors"
              title={`${match.slug} Duke Blue Devils season`}
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
