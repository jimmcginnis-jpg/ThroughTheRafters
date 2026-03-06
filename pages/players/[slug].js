import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

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
    .map(p => ({ name: p.name, slug: p.slug }))
    .sort((a, b) => b.name.length - a.name.length); // longest names first to avoid partial matches

  // Convert paragraph text into React elements with auto-linked player names
  const linkifyParagraph = (text, paragraphIndex) => {
    if (!linkablePlayers.length) return text;

    const parts = [];
    let remaining = text;
    let keyCounter = 0;

    while (remaining.length > 0) {
      let earliestMatch = null;
      let earliestIndex = remaining.length;

      for (const lp of linkablePlayers) {
        const idx = remaining.indexOf(lp.name);
        if (idx !== -1 && idx < earliestIndex) {
          earliestIndex = idx;
          earliestMatch = lp;
        }
      }

      if (earliestMatch) {
        // Add text before the match
        if (earliestIndex > 0) {
          parts.push(remaining.substring(0, earliestIndex));
        }
        // Add the linked name
        parts.push(
          <Link
            key={`${paragraphIndex}-${keyCounter++}`}
            href={`/players/${earliestMatch.slug}/`}
            className="text-duke-navy underline decoration-duke-gold/40 hover:decoration-duke-gold transition-colors"
          >
            {earliestMatch.name}
          </Link>
        );
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
            <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
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
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-duke-navy mb-2">Profile Coming Soon</p>
            <p className="font-body text-gray-500">
              {player.name}&rsquo;s full documentary profile is in development.
            </p>
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
            url: `https://dukebrotherhood.com/players/${player.slug}/`,
            alumniOf: {
              '@type': 'CollegeOrUniversity',
              name: 'Duke University',
            },
            sport: 'Basketball',
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
