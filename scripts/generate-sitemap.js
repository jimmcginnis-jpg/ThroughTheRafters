// scripts/generate-sitemap.js
// Automatically generates public/sitemap.xml from players.json
// Runs as a prebuild step — no manual updates needed

const fs = require('fs');
const path = require('path');

const playersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'players.json'), 'utf8')
);
const players = playersData.players;

const BASE_URL = 'https://www.dukebrotherhood.com';
const today = new Date().toISOString().split('T')[0];

const urls = [];

// ── Static pages ──
urls.push({ loc: '/', priority: '1.0', changefreq: 'weekly' });
urls.push({ loc: '/players', priority: '0.9', changefreq: 'weekly' });
urls.push({ loc: '/eras', priority: '0.8', changefreq: 'monthly' });
urls.push({ loc: '/lists', priority: '0.9', changefreq: 'weekly' });
urls.push({ loc: '/about', priority: '0.5', changefreq: 'monthly' });
urls.push({ loc: '/methodology', priority: '0.4', changefreq: 'monthly' });

// ── List pages ──
const listSlugs = [
  'all-players',
  'currently-in-nba',
  'number-one-picks',
  'lottery-picks',
  'mcdonalds-all-americans',
  'coaches',
  'top-nba-scorers',
  'nba-iron-men',
  'undrafted',
  'draft-history',
  'by-the-numbers',
];
listSlugs.forEach(slug => {
  urls.push({ loc: `/lists/${slug}`, priority: '0.8', changefreq: 'weekly' });
});

// ── Era pages (auto-detected from players.json) ──
const eras = [...new Set(players.map(p => p.era))];
eras.forEach(era => {
  urls.push({ loc: `/eras/${era}`, priority: '0.8', changefreq: 'weekly' });
});

// ── Individual player pages (auto-generated from players.json) ──
players.forEach(p => {
  urls.push({ loc: `/players/${p.slug}`, priority: '0.7', changefreq: 'monthly' });
});

// ── Build XML ──
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);

console.log(`✅ Sitemap generated: ${urls.length} URLs → public/sitemap.xml`);
console.log(`   ${6} static pages`);
console.log(`   ${listSlugs.length} list pages`);
console.log(`   ${eras.length} era pages`);
console.log(`   ${players.length} player pages`);
