// pages/where-are-they-now.js
// Hub page grouping all done players by what they're doing now

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import data from '../data/players.json';

// Categorization logic — order matters, first match wins
function categorize(p) {
  const now = (p.now || '').toLowerCase();

  // Deceased — check first
  if (now.includes('died') || now.includes('deceased')) return 'deceased';

  // Current Duke players/staff/students
  if (now.includes('duke blue devils') || now.includes('active —') || now.includes('senior —') ||
      now.includes('senior at duke') || now.includes('graduate student at duke') ||
      now.includes('duke freshman') || now.includes('duke\'s fuqua') ||
      (now.includes('recovering from') && now.includes('duke'))) return 'current';

  // Still playing college basketball (transfers)
  if (now.match(/(junior|sophomore|senior|redshirt|rs-junior)/) && now.match(/(at |university|tigers|hokies|cardinals|rams|hoyas|charleston|penn |baylor|utsa|stanford)/i)) return 'college_transfer';

  // Head coaches — check BEFORE NBA
  if (now.includes('head coach')) return 'head_coach';

  // Assistant coaches — check BEFORE NBA
  if (now.includes('assistant coach') || now.includes('associate head coach') ||
      now.includes('player development') || now.includes('coaching')) return 'asst_coach';

  // Front office, media, analytics — check BEFORE NBA
  if (now.includes('general manager') || now.includes('president of basketball') ||
      now.includes('front office') || now.includes('analyst') || now.includes('co-owner') ||
      now.includes('espn') || now.includes('nbc sports') || now.includes('fox sports') ||
      now.includes('broadcast') || now.includes('color analyst') || now.includes('scout') ||
      now.includes('consultant,')) return 'front_office_media';

  // NBA active players — now safe to match team names
  if (now.match(/(celtics|lakers|warriors|nets|knicks|bulls|hawks|magic|suns|maverick|bucks|clippers|raptors|pistons|hornets|jazz|thunder|pelicans|spurs|76ers|heat|rockets|cavaliers|kings|grizzlies|pacers|wolves|nuggets|blazers|wizards)/i) &&
      !now.includes('retired') && !now.includes('coach') && !now.includes('analyst')) return 'nba';

  // Playing overseas / G-League
  if (now.includes('professional basketball') || now.includes('playing') || now.includes('g-league') ||
      now.includes('g league') || now.includes('overseas') || now.includes('free agent') ||
      now.match(/(israel|turkey|china|japan|spain|germany|serbia|italy|france|australia|cba|bsl|liga|lega|bundesliga|b\.league)/i)) return 'overseas';

  // Business, finance, law, tech
  if (now.includes('consultant') || now.includes('founder') || now.includes('managing director') ||
      now.includes('partner') || now.includes('entrepreneur') || now.includes('real estate') ||
      now.includes('investor') || now.includes('executive') || now.includes('technology') ||
      now.includes('mba') || now.includes('attorney') || now.includes('engineer') ||
      now.includes('vice president') || now.includes('jpmorgan') || now.includes('bcg') ||
      now.includes('agent') || now.includes('director,') || now.includes('business school') ||
      now.includes('owner') || now.includes('salesperson')) return 'business';

  return 'other';
}

const CATEGORIES = [
  { key: 'nba', label: 'In the NBA', icon: '🏀', desc: 'Active on NBA rosters right now' },
  { key: 'current', label: 'Still at Duke', icon: '🔵', desc: 'Current players, grad students, and staff in Durham' },
  { key: 'college_transfer', label: 'Still playing college ball', icon: '🎓', desc: 'Duke transfers still competing at other programs' },
  { key: 'head_coach', label: 'Head coaches', icon: '📋', desc: 'Running their own programs' },
  { key: 'asst_coach', label: 'Coaching staffs', icon: '🏟', desc: 'Assistant coaches and player development' },
  { key: 'front_office_media', label: 'Front office & media', icon: '🎙', desc: 'GMs, analysts, and broadcasters' },
  { key: 'overseas', label: 'Playing overseas', icon: '🌍', desc: 'Professional basketball outside the NBA' },
  { key: 'business', label: 'Business & beyond', icon: '💼', desc: 'Entrepreneurs, executives, and professionals' },
  { key: 'other', label: 'Other paths', icon: '🛤', desc: 'Retired, camps, ministry, and more' },
  { key: 'deceased', label: 'In memoriam', icon: '🕊', desc: '' },
];

export default function WhereAreTheyNow({ groups, totalCount }) {
  return (
    <Layout
      title="Where Are They Now? — Every Duke Brotherhood Player"
      description={`What happened after Duke? ${totalCount} Brotherhood players tracked — NBA stars, head coaches, CEOs, and everyone in between.`}
      canonical="/where-are-they-now/"
    >
      <Head>
        <meta property="og:title" content="Duke Brotherhood — Where Are They Now?" />
        <meta property="og:description" content={`${totalCount} Duke basketball players from 1981 to today. Where they came from, what they did at Duke, and where life took them next.`} />
      </Head>

      {/* Hero */}
      <section className="bg-duke-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <Link href="/" className="hover:text-duke-gold">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-duke-gold">Where Are They Now?</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Where Are They Now?</h1>
          <p className="font-body text-duke-goldLight text-lg italic">
            {totalCount} Brotherhood players tracked — from the NBA to the boardroom.
          </p>
        </div>
      </section>

      {/* Jump links */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2">
            {groups.map(g => (
              <a
                key={g.key}
                href={`#${g.key}`}
                className="shrink-0 px-3 py-1.5 font-mono text-xs tracking-wider rounded-md border border-gray-200 text-gray-500 hover:border-duke-gold hover:text-duke-navy transition-all"
              >
                {g.label} <span className="text-duke-gold">{g.count}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {groups.map(g => (
          <div key={g.key} id={g.key} className="mb-12 scroll-mt-16">
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="font-display text-2xl text-duke-navy font-bold">{g.label}</h2>
              <span className="font-mono text-sm text-duke-gold">{g.count}</span>
            </div>
            {g.desc && (
              <p className="font-body text-gray-500 text-sm mb-4">{g.desc}</p>
            )}

            <div className="space-y-2">
              {g.players.map(p => (
                <Link
                  key={p.id}
                  href={`/players/${p.slug}/`}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-duke-gold hover:shadow-sm transition-all group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-duke-navy flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-duke-gold">
                      {p.jersey || '#'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-duke-navy group-hover:text-duke-gold transition-colors">
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">{p.years}</span>
                    </div>
                    <div className="font-body text-sm text-gray-600 mt-0.5 line-clamp-2">
                      {p.now}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Where Are They Now? — Duke Brotherhood',
            description: `${totalCount} Duke basketball players from 1981 to today, grouped by what they're doing now.`,
            url: 'https://www.dukebrotherhood.com/where-are-they-now/',
            publisher: { '@type': 'Organization', name: 'Duke Brotherhood', url: 'https://www.dukebrotherhood.com' },
          }),
        }}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const done = data.players
    .filter(p => p.status === 'done' && p.now)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      now: p.now,
      years: p.years,
      jersey: p.jersey || '',
      era: p.era,
      nba: p.nba,
      category: categorize(p),
    }));

  const groups = CATEGORIES
    .map(cat => {
      const players = done
        .filter(p => p.category === cat.key)
        .sort((a, b) => a.name.localeCompare(b.name));
      return {
        key: cat.key,
        label: cat.label,
        desc: cat.desc,
        count: players.length,
        players: players.map(p => ({
          id: p.id, slug: p.slug, name: p.name,
          now: p.now, years: p.years, jersey: p.jersey,
        })),
      };
    })
    .filter(g => g.count > 0);

  return {
    props: {
      groups,
      totalCount: done.length,
    },
  };
}
