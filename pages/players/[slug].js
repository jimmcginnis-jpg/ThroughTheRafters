import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import data from '../../data/players.json';
import teamsData from '../../data/teams.json';

const BIO_TABS = [
  { key: 'road', label: 'Road to Duke' },
  { key: 'duke', label: 'At Duke' },
  { key: 'after', label: 'After Duke' },
  { key: 'now', label: 'Where Is He Now' },
];

export default function PlayerPage({ player, era, prevPlayer, nextPlayer }) {
  const [activeTab, setActiveTab] = useState('road');

  if (!player) return null;

  const hasBio = player.bio && (player.bio.road || player.bio.duke || player.bio.after || player.bio.now);

  // Build player name → slug lookup for auto-linking (only completed profiles, not self)
  const linkablePlayers = data.players
    .filter(p => p.status === 'done' && p.id !== player.id)
    .map(p => ({ name: p.name, href: `/players/${p.slug}/`, type: 'player' }));

  // Build charity/foundation name → URL lookup from all players' charity data
  const charityLinks = data.players
    .filter(p => p.charity && p.charity.name && p.charity.url)
    .map(p => ({ name: p.charity.name, href: p.charity.url, type: 'charity' }));

  // Add well-known charities/orgs mentioned in profiles that aren't player-specific
  const knownOrgs = [
    { name: 'V Foundation', href: 'https://www.jimmyv.org/donate/', type: 'charity' },
    { name: 'Jimmy V Foundation', href: 'https://www.jimmyv.org/donate/', type: 'charity' },
    { name: 'Emily K Center', href: 'https://emilyk.org/donate/', type: 'charity' },
    { name: 'Ronald McDonald House', href: 'https://www.rmhc.org/donate', type: 'charity' },
    { name: 'Susan G. Komen Foundation', href: 'https://www.komen.org/donate/', type: 'charity' },
    { name: 'Susan G. Komen', href: 'https://www.komen.org/donate/', type: 'charity' },
    { name: 'Duke Children\u2019s Hospital', href: 'https://www.dukechildrens.org/giving', type: 'charity' },
  ];

  // Build season → team page lookup for auto-linking
  const seasonLinks = (teamsData.seasons || [])
    .map(s => ({ name: s.season, href: `/teams/${s.season}/`, type: 'season' }))
    .filter(s => s.name);

  // Combine all linkable items, deduplicate by name, sort longest first
  const seen = new Set();
  const allLinkable = [...linkablePlayers, ...charityLinks, ...knownOrgs, ...seasonLinks]
    .filter(item => { if (seen.has(item.name)) return false; seen.add(item.name); return true; })
    .sort((a, b) => b.name.length - a.name.length);

  // Convert paragraph text into React elements with auto-linked player names AND charity links
  const linkifyParagraph = (text, paragraphIndex) => {
    if (!allLinkable.length) return text;

    const parts = [];
    let remaining = text;
    let keyCounter = 0;

    while (remaining.length > 0) {
      let earliestMatch = null;
      let earliestIndex = remaining.length;

      for (const item of allLinkable) {
        const idx = remaining.indexOf(item.name);
        if (idx !== -1 && idx < earliestIndex) {
          earliestIndex = idx;
          earliestMatch = item;
        }
      }

      if (earliestMatch) {
        if (earliestIndex > 0) {
          parts.push(remaining.substring(0, earliestIndex));
        }
        if (earliestMatch.type === 'player') {
          parts.push(
            <Link
              key={`${paragraphIndex}-${keyCounter++}`}
              href={earliestMatch.href}
              className="text-duke-navy underline decoration-duke-gold/40 hover:decoration-duke-gold transition-colors"
            >
              {earliestMatch.name}
            </Link>
          );
        } else if (earliestMatch.type === 'season') {
          parts.push(
            <Link
              key={`${paragraphIndex}-${keyCounter++}`}
              href={earliestMatch.href}
              className="text-duke-navy underline decoration-duke-gold/40 hover:decoration-duke-gold transition-colors"
              title={`${earliestMatch.name} Duke Blue Devils season`}
            >
              {earliestMatch.name}
            </Link>
          );
        } else {
          parts.push(
            <a
              key={`${paragraphIndex}-${keyCounter++}`}
              href={earliestMatch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-duke-navy underline decoration-duke-gold/40 hover:decoration-duke-gold transition-colors"
              title={`Donate to ${earliestMatch.name}`}
            >
              {earliestMatch.name}
            </a>
          );
        }
        remaining = remaining.substring(earliestIndex + earliestMatch.name.length);
      } else {
        parts.push(remaining);
        remaining = '';
      }
    }

    return parts;
  };

  // Convert \n to paragraphs with auto-linked player names
  const renderBio = (text) => {
    if (!text) return <p className="text-gray-500 italic">Profile coming soon.</p>;
    return text.split('\n').filter(p => p.trim()).map((paragraph, i) => (
      <p key={i}>{linkifyParagraph(paragraph, i)}</p>
    ));
  };

  // Build SEO description from first ~160 chars of road bio
  const seoDescription = player.bio?.road
    ? player.bio.road.substring(0, 155).replace(/\n/g, ' ') + '...'
    : `${player.name} — Duke Basketball ${player.years}. ${player.tagline}`;

  return (
    <Layout
      title={`${player.name} — Duke Basketball ${player.years}`}
      description={seoDescription}
      canonical={`/players/${player.slug}/`}
    >
      {/* HERO */}
      <section className="bg-duke-slate text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <Link href="/" className="hover:text-duke-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/players/" className="hover:text-duke-gold">Players</Link>
            <span className="mx-2">/</span>
            <Link href={`/eras/${player.era}/`} className="hover:text-duke-gold">
              Era {era?.num}: {era?.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-duke-gold">{player.name}</span>
          </nav>

          {/* Player Name & Info */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            {player.name}
          </h1>

          <p className="font-body text-lg md:text-xl text-duke-goldLight italic mb-6">
            {player.tagline}
          </p>

          {/* Quick Facts Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-duke-goldLight">
            <span>{player.pos}</span>
            <span>{player.height}</span>
            <span>{player.years}</span>
            {player.drafted && <span>{player.drafted}</span>}
          </div>

          {/* Stats Line */}
          {player.stat && (
            <div className="mt-4 font-mono text-sm text-white/80 leading-relaxed">
              {player.stat}
            </div>
          )}

          {/* Current Status */}
          {player.now && player.status === 'done' && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="font-mono text-xs text-duke-gold uppercase tracking-wider">Now: </span>
              <span className="font-body text-white/90">{player.now}</span>
            </div>
          )}
        </div>
      </section>

      {/* BIO SECTION */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        {hasBio ? (
          <>
            {/* Tab Navigation */}
            <div id="bio-tabs" className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
              {BIO_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-button whitespace-nowrap ${activeTab === tab.key ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <article className="bio-content font-body text-duke-slate leading-relaxed">
              {renderBio(player.bio[activeTab])}
            </article>

            {/* Continue to next section */}
            {(() => {
              const currentIndex = BIO_TABS.findIndex(t => t.key === activeTab);
              const nextTab = currentIndex < BIO_TABS.length - 1 ? BIO_TABS[currentIndex + 1] : null;
              if (!nextTab || !player.bio[nextTab.key]) return null;
              return (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setActiveTab(nextTab.key);
                      document.getElementById('bio-tabs')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-mono text-sm text-duke-navy hover:text-duke-gold transition-colors cursor-pointer"
                  >
                    Continue to: {nextTab.label} &rarr;
                  </button>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-duke-navy mb-2">Profile Coming Soon</p>
            <p className="font-body text-gray-500">
              {player.name}&rsquo;s full documentary profile is in development.
            </p>
          </div>
        )}

        {/* SOURCES */}
        {player.sources && player.sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-3">Sources</h3>
            <ul className="space-y-1">
              {player.sources.map((source, i) => (
                <li key={i} className="font-body text-sm text-gray-500 leading-relaxed">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer"
                       className="hover:text-duke-navy transition-colors underline decoration-gray-300 hover:decoration-duke-gold">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </li>
              ))}
            </ul>
            <p className="font-body text-xs text-gray-400 mt-4 italic">
              All quotes are sourced from published interviews and reporting. 
              <Link href="/methodology/" className="underline hover:text-duke-navy ml-1">
                Read about our research methodology.
              </Link>
            </p>
          </div>
        )}

        {/* GIVE BACK */}
        {player.status === 'done' && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="bg-duke-cream border border-duke-gold/30 p-6">
              <h3 className="font-display text-lg text-duke-navy mb-2">
                {player.charity ? player.charity.label : 'Support the Brotherhood'}
              </h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">
                {player.charity ? player.charity.description : (
                  `Duke\u2019s Brotherhood Run supports Duke Children\u2019s Hospital, continuing the program\u2019s long-standing commitment to the Durham community. Consider making a donation in honor of ${player.name} and the Brotherhood.`
                )}
              </p>
              <a
                href={player.charity ? player.charity.url : 'https://www.dukechildrens.org/giving'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-duke-navy text-white font-mono text-xs tracking-wider uppercase px-5 py-2.5 hover:bg-duke-navyDark transition-colors"
              >
                {player.charity ? `Donate to ${player.charity.name}` : 'Donate to Duke Children\u2019s Hospital'}
              </a>
            </div>
          </div>
        )}

        {/* PREV / NEXT Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          {prevPlayer ? (
            <Link
              href={`/players/${prevPlayer.slug}/`}
              className="group text-left"
            >
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">&larr; Previous</span>
              <div className="font-display text-duke-navy group-hover:text-duke-gold transition-colors">
                {prevPlayer.name}
              </div>
            </Link>
          ) : <div />}

          {nextPlayer ? (
            <Link
              href={`/players/${nextPlayer.slug}/`}
              className="group text-right"
            >
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Next &rarr;</span>
              <div className="font-display text-duke-navy group-hover:text-duke-gold transition-colors">
                {nextPlayer.name}
              </div>
            </Link>
          ) : <div />}
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: player.name,
            description: seoDescription,
            url: `https://www.dukebrotherhood.com/players/${player.slug}/`,
            ...(player.hometown && { birthPlace: { '@type': 'Place', name: player.hometown } }),
            ...(player.height && { height: player.height }),
            alumniOf: {
              '@type': 'CollegeOrUniversity',
              name: 'Duke University',
              sameAs: 'https://en.wikipedia.org/wiki/Duke_University',
            },
            ...(player.now && { jobTitle: player.now }),
            ...(player.nba && player.nba.teams && player.nba.teams.length > 0 && {
              memberOf: player.nba.teams.map(t => ({
                '@type': 'SportsTeam',
                name: t.team,
                sport: 'Basketball',
                memberOf: { '@type': 'SportsOrganization', name: 'NBA' },
              })),
            }),
            ...(player.nba && player.nba.highlights && player.nba.highlights.length > 0 && {
              award: player.nba.highlights
                .map(h => typeof h === 'string' ? h : h.note || '')
                .filter(Boolean)
                .slice(0, 5),
            }),
            ...(player.sources && player.sources.length > 0 && {
              sameAs: player.sources
                .filter(s => s.url && (s.url.includes('wikipedia') || s.url.includes('basketball-reference') || s.url.includes('goduke.com')))
                .map(s => s.url),
            }),
          }),
        }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dukebrotherhood.com/' },
              { '@type': 'ListItem', position: 2, name: 'Players', item: 'https://www.dukebrotherhood.com/players/' },
              { '@type': 'ListItem', position: 3, name: era?.name || player.era, item: `https://www.dukebrotherhood.com/eras/${player.era}/` },
              { '@type': 'ListItem', position: 4, name: player.name, item: `https://www.dukebrotherhood.com/players/${player.slug}/` },
            ],
          }),
        }}
      />
    </Layout>
  );
}

// ============================================================
// STATIC SITE GENERATION
// At build time, Next.js calls these functions to:
// 1. Generate a list of all player URLs (getStaticPaths)
// 2. Fetch the data for each URL (getStaticProps)
// Result: pre-rendered HTML for every player — perfect for SEO
// ============================================================

export async function getStaticPaths() {
  const paths = data.players.map(player => ({
    params: { slug: player.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const playerIndex = data.players.findIndex(p => p.slug === params.slug);
  const player = data.players[playerIndex];
  const era = data.eras.find(e => e.key === player.era);

  // Get same-era players for prev/next navigation
  const eraPlayers = data.players.filter(p => p.era === player.era);
  const eraIndex = eraPlayers.findIndex(p => p.slug === params.slug);
  const prevPlayer = eraIndex > 0 ? { name: eraPlayers[eraIndex - 1].name, slug: eraPlayers[eraIndex - 1].slug } : null;
  const nextPlayer = eraIndex < eraPlayers.length - 1 ? { name: eraPlayers[eraIndex + 1].name, slug: eraPlayers[eraIndex + 1].slug } : null;

  return {
    props: { player, era, prevPlayer, nextPlayer },
  };
}
