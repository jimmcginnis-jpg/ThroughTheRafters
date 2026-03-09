// components/LinkedText.js
// Automatically links player names in text to their profile pages
// Only links profiled players (status: 'done')

import Link from 'next/link';
import playerData from '../data/players.json';

// Build lookup of profiled players, sorted longest name first to avoid partial matches
const profiledPlayers = playerData.players
  .filter(p => p.status === 'done')
  .map(p => ({ name: p.name, slug: p.slug }))
  .sort((a, b) => b.name.length - a.name.length);

// Also match common short names / last names for very famous players
// Only add these if they won't cause false positives
const ALIASES = {
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
  'Henderson': 'david-henderson',
  'Billy King': 'billy-king',
  'Brickey': 'robert-brickey',
  'Nessley': 'marty-nessley',
  'Cooper Flagg': 'cooper-flagg',
  'Scheyer': 'jon-scheyer',
};

export default function LinkedText({ text, className }) {
  if (!text) return null;

  // Build combined pattern: full names + aliases
  const allPatterns = [];

  profiledPlayers.forEach(p => {
    allPatterns.push({ pattern: p.name, slug: p.slug });
  });

  Object.entries(ALIASES).forEach(([alias, slug]) => {
    // Only add if not already covered by full name
    if (!allPatterns.find(p => p.pattern === alias)) {
      allPatterns.push({ pattern: alias, slug });
    }
  });

  // Sort by pattern length descending to match longest first
  allPatterns.sort((a, b) => b.pattern.length - a.pattern.length);

  // Build regex that matches any player name
  const escaped = allPatterns.map(p => p.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  // Split text into segments
  const parts = text.split(regex);

  // Map patterns to slugs for quick lookup
  const patternToSlug = {};
  allPatterns.forEach(p => { patternToSlug[p.pattern] = p.slug; });

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const slug = patternToSlug[part];
        if (slug) {
          return (
            <Link
              key={i}
              href={`/players/${slug}/`}
              className="text-duke-gold hover:text-duke-navy border-b border-duke-gold/30 hover:border-duke-navy transition-colors"
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
