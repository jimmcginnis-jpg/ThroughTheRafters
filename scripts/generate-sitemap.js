// scripts/generate-sitemap.js
// Generates public/sitemap.xml from players.json, teams.json
// Priority tiers: done profiles > stubs, high-traffic lists > low-traffic
// Trailing slashes on all URLs to match canonical tags
// Uses lastUpdated from player data when available

const fs = require('fs');
const path = require('path');

const playersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'players.json'), 'utf8')
);
const DATA_DIR = path.join(__dirname, '..', 'data');
const players = playersData.players;

const BASE_URL = 'https://www.dukebrotherhood.com';
const today = new Date().toISOString().split('T')[0];

const urls = [];

// ── Static pages ──
urls.push({ loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today });
urls.push({ loc: '/players/', priority: '0.9', changefreq: 'weekly', lastmod: today });
urls.push({ loc: '/eras/', priority: '0.8', changefreq: 'monthly', lastmod: today });
urls.push({ loc: '/lists/', priority: '0.9', changefreq: 'weekly', lastmod: today });
urls.push({ loc: '/where-are-they-now/', priority: '0.9', changefreq: 'weekly', lastmod: today });
urls.push({ loc: '/about/', priority: '0.5', changefreq: 'monthly', lastmod: '2026-03-01' });
urls.push({ loc: '/methodology/', priority: '0.4', changefreq: 'monthly', lastmod: '2026-03-01' });
urls.push({ loc: '/search/', priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' });

// ── Viz pages ──
['', '/height', '/map', '/nba', '/nba-teams'].forEach(sub => {
  urls.push({ loc: '/viz' + sub + '/', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-01' });
});

// ── Teams hub + individual seasons ──
let teamsData;
try { teamsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'teams.json'), 'utf8')); } catch(e) {}
if (teamsData && teamsData.seasons) {
  urls.push({ loc: '/teams/', priority: '0.8', changefreq: 'monthly', lastmod: today });
  teamsData.seasons.forEach(s => {
    const endYear = parseInt(s.season.split('-')[0]) + 1;
    const pri = endYear >= 2024 ? '0.8' : endYear >= 2000 ? '0.7' : '0.6';
    urls.push({ loc: '/teams/' + s.season + '/', priority: pri, changefreq: 'monthly', lastmod: today });
  });
}

// ── List pages — all of them, tiered by search value ──
const highValueLists = [
  'draft-history', 'currently-in-nba', 'lottery-picks', 'number-one-picks',
  'coaches', 'all-americans', 'all-players',
];
const medValueLists = [
  'top-nba-scorers', 'nba-iron-men', 'undrafted', 'mcdonalds-all-americans',
  'by-the-numbers', 'birthdays',
];
const lowValueLists = [
  'charities', 'x-handles',
];

highValueLists.forEach(slug => {
  urls.push({ loc: '/lists/' + slug + '/', priority: '0.9', changefreq: 'weekly', lastmod: today });
});
medValueLists.forEach(slug => {
  urls.push({ loc: '/lists/' + slug + '/', priority: '0.8', changefreq: 'weekly', lastmod: today });
});
lowValueLists.forEach(slug => {
  urls.push({ loc: '/lists/' + slug + '/', priority: '0.7', changefreq: 'monthly', lastmod: today });
});

// ── Era pages ──
const eras = [...new Set(players.map(p => p.era))];
eras.forEach(era => {
  urls.push({ loc: '/eras/' + era + '/', priority: '0.8', changefreq: 'weekly', lastmod: today });
});

// ── Individual player pages — done profiles get higher priority than stubs ──
players.forEach(p => {
  const isDone = p.status === 'done';
  const hasNBA = p.nba && p.nba.draftPick;
  const isCurrentPlayer = p.seasons && p.seasons.includes('2025-26');

  let pri = '0.5';
  if (isDone && hasNBA) pri = '0.8';
  else if (isDone) pri = '0.7';
  else if (isCurrentPlayer) pri = '0.6';

  const lastmod = p.lastUpdated || (isDone ? '2026-03-15' : '2026-01-01');

  urls.push({
    loc: '/players/' + p.slug + '/',
    priority: pri,
    changefreq: isDone ? 'monthly' : 'yearly',
    lastmod: lastmod,
  });
});

// ── Build XML ──
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url>\n    <loc>' + BASE_URL + u.loc + '</loc>\n    <lastmod>' + u.lastmod + '</lastmod>\n    <changefreq>' + u.changefreq + '</changefreq>\n    <priority>' + u.priority + '</priority>\n  </url>').join('\n') +
  '\n</urlset>\n';

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);

const doneCount = players.filter(p => p.status === 'done').length;
const stubCount = players.length - doneCount;

console.log('Sitemap generated: ' + urls.length + ' URLs -> public/sitemap.xml');
console.log('   Static/hub pages: 13');
console.log('   Team pages: ' + (teamsData ? teamsData.seasons.length + 1 : 0));
console.log('   List pages: ' + (highValueLists.length + medValueLists.length + lowValueLists.length));
console.log('   Era pages: ' + eras.length);
console.log('   Player pages: ' + players.length + ' (' + doneCount + ' done @ 0.7-0.8, ' + stubCount + ' stubs @ 0.5-0.6)');
