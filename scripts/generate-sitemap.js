const fs = require('fs');
const path = require('path');
const config = require('../school.config');
const data = require('../data/players.json');
const teams = require('../data/teams.json');

const BASE = config.siteUrl;

function today() {
  return new Date().toISOString().split('T')[0];
}

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/players/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/eras/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/teams/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/lists/', priority: '0.7', changefreq: 'monthly' },
  { loc: '/viz/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/about/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/methodology/', priority: '0.4', changefreq: 'monthly' },
  { loc: '/search/', priority: '0.3', changefreq: 'monthly' },
  { loc: '/bracket/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/what-if/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/where-are-they-now/', priority: '0.7', changefreq: 'weekly' },
];

const urls = [];

// Static pages
staticPages.forEach(p => {
  urls.push(`  <url>\n    <loc>${BASE}${p.loc}</loc>\n    <lastmod>${today()}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`);
});

// Era pages
data.eras.forEach(era => {
  urls.push(`  <url>\n    <loc>${BASE}/eras/${era.key}/</loc>\n    <lastmod>${today()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
});

// Player pages
data.players.forEach(p => {
  const lastmod = p.lastUpdated || today();
  const priority = p.status === 'done' ? '0.8' : '0.4';
  urls.push(`  <url>\n    <loc>${BASE}/players/${p.slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
});

// Team/season pages
teams.seasons.forEach(s => {
  urls.push(`  <url>\n    <loc>${BASE}/teams/${s.season}/</loc>\n    <lastmod>${today()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap);
console.log(`Sitemap generated: ${urls.length} URLs for ${config.domain}`);
