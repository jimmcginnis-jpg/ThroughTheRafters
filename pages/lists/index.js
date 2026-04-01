import config from '../../school.config';
// pages/lists/index.js

import Head from 'next/head';
import Link from 'next/link';
import playersData from '../../data/players.json';

const profiledCount = playersData.players.filter(p => p.status === 'done').length;

const totalPlayers = playersData.players.length;

const lists = [
  { slug: '../where-are-they-now', title: 'Where Are They Now?', desc: `${profiledCount} Through the Rafters players grouped by what they're doing now — NBA, coaching, business, overseas, and more.`, featured: true },
  { slug: 'all-players', title: `All ${totalPlayers} Through the Rafters Players (1930–Present)`, desc: `${profiledCount} profiled with full narratives · ${totalPlayers - profiledCount} more coming soon.` },
  { slug: 'currently-in-nba', title: config.siteName + ' Players Currently in the NBA', desc: `Active in the 2025–26 NBA season, among the ${profiledCount} players profiled.` },
  { slug: 'number-one-picks', title: '#1 Overall NBA Draft Picks Among Through the Rafters', desc: 'Five Through the Rafters players were selected first overall — more than any program in history.' },
  { slug: 'lottery-picks', title: `NBA Lottery Picks Among the ${profiledCount} Through the Rafters Players`, desc: 'Every Brotherhood player drafted in the top 14, from the greatest Kentucky players in NBA Draft history.' },
  { slug: 'mcdonalds-all-americans', title: "McDonald's All-Americans Among Through the Rafters", desc: config.siteName + " players who earned McDonald's All-American honors before arriving at Duke." },
  { slug: 'all-americans', title: 'Kentucky Consensus All-Americans', desc: '23 players, 30 selections — more consensus first-team All-Americans since 2000 than any program in basketball.' },
  { slug: 'coaches', title: config.siteName + ' Players Who Became Coaches', desc: `From NBA head coaches to college builders — coaching paths among the ${profiledCount} players profiled.` },
  { slug: 'top-nba-scorers', title: 'Top NBA Scorers Among Through the Rafters', desc: `Career PPG leaders among the ${profiledCount} Through the Rafters players (min. 50 games).` },
  { slug: 'nba-iron-men', title: config.siteName + ' Iron Men: 500+ NBA Games', desc: config.siteName + ' players who logged 500 or more NBA games.' },
  { slug: 'undrafted', title: 'Undrafted Through the Rafters Players', desc: 'Not every Through the Rafters player went to the NBA. Their stories are just as compelling.' },
  { slug: 'draft-history', title: config.siteName + ' NBA Draft History (1986–2025)', desc: `Every drafted player among the ${profiledCount} Through the Rafters profiles, year by year.` },
  { slug: 'by-the-numbers', title: config.siteName + ': By the Numbers', desc: `Key stats and milestones across all ${totalPlayers} players — ${profiledCount} profiled so far.` },
  { slug: 'charities', title: 'Charities Through the Rafters Supports', desc: `Every profiled player links to a charitable organization — player-specific foundations and Duke-connected causes.` },
  { slug: 'birthdays', title: config.siteName + ' Birthdays', desc: `${profiledCount}+ birthdays tracked — tweet happy birthday to your favorite Wildcat and link to their story.` },
];

export default function ListsIndex() {
  return (
    <>
      <Head>
        <title>Lists &amp; Rankings | Through the Rafters: Where Are They Now?</title>
        <meta name="description" content={`Explore lists across the ${totalPlayers} Through the Rafters players (${profiledCount} profiled): current NBA rosters, lottery picks, McDonald's All-Americans, coaches, top scorers, and more.`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#001A57]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#001A57]">Lists &amp; Rankings</span>
        </nav>

        <h1 className="text-4xl font-bold text-[#001A57] mb-2">Lists &amp; Rankings</h1>
        <p className="text-lg text-gray-600 mb-10">
          Slice Through the Rafters data every way that matters — {profiledCount} players profiled across all {totalPlayers} in the series.
        </p>

        <div className="grid gap-4">
          {lists.map((list) => (
            <Link
              key={list.slug}
              href={list.slug.startsWith('../') ? `/${list.slug.replace('../', '')}/` : `/lists/${list.slug}`}
              className={`block p-5 border rounded-lg hover:shadow-md transition-all ${
                list.featured
                  ? 'border-[#C5A258] bg-[#FDFBF5] hover:shadow-lg'
                  : 'border-gray-200 hover:border-[#C5A258]'
              }`}
            >
              {list.featured && (
                <span className="inline-block font-mono text-[10px] text-[#C5A258] uppercase tracking-wider mb-1">Featured</span>
              )}
              <h2 className="text-xl font-semibold text-[#001A57]">{list.title}</h2>
              <p className="text-gray-500 mt-1">{list.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
