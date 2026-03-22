// pages/lists/index.js

import Head from 'next/head';
import Link from 'next/link';
import playersData from '../../data/players.json';

const profiledCount = playersData.players.filter(p => p.status === 'done').length;

const totalPlayers = playersData.players.length;

const players = playersData.players;

const lists = [
  { slug: 'all-players', title: `All ${totalPlayers} Brotherhood Players (1981–Present)`, desc: `${profiledCount} profiled with full narratives · ${totalPlayers - profiledCount} more coming soon.` },
  { slug: 'currently-in-nba', title: 'Brotherhood Players Currently in the NBA', desc: `Active in the 2025–26 NBA season, among the ${profiledCount} players profiled.` },
  { slug: 'number-one-picks', title: '#1 Overall NBA Draft Picks Among the Brotherhood', desc: 'Five Brotherhood players were selected first overall — more than any program in history.' },
  { slug: 'lottery-picks', title: `NBA Lottery Picks Among the ${profiledCount} Brotherhood Players`, desc: 'Every Brotherhood player drafted in the top 14, from Johnny Dawkins (1986) to Cooper Flagg (2025).' },
  { slug: 'mcdonalds-all-americans', title: "McDonald's All-Americans Among the Brotherhood", desc: "Brotherhood players who earned McDonald's All-American honors before arriving at Duke." },
  { slug: 'coaches', title: 'Brotherhood Players Who Became Coaches', desc: `From NBA head coaches to college builders — coaching paths among the ${profiledCount} players profiled.` },
  { slug: 'top-nba-scorers', title: 'Top NBA Scorers Among the Brotherhood', desc: `Career PPG leaders among the ${profiledCount} Brotherhood players (min. 50 games).` },
  { slug: 'nba-iron-men', title: 'Brotherhood Iron Men: 500+ NBA Games', desc: 'Brotherhood players who logged 500 or more NBA games.' },
  { slug: 'undrafted', title: 'Undrafted Brotherhood Players', desc: 'Not every Brotherhood member went to the NBA. Their stories are just as compelling.' },
  { slug: 'draft-history', title: 'Brotherhood NBA Draft History (1986–2025)', desc: `Every drafted player among the ${profiledCount} Brotherhood profiles, year by year.` },
  { slug: 'by-the-numbers', title: 'The Brotherhood: By the Numbers', desc: `Key stats and milestones across all ${totalPlayers} players — ${profiledCount} profiled so far.` },
  { slug: 'charities', title: 'Charities the Brotherhood Supports', desc: `Every profiled player links to a charitable organization — player-specific foundations and Duke-connected causes.` },
  { slug: 'birthdays', title: 'Brotherhood Birthdays', desc: `${profiledCount}+ birthdays tracked — tweet happy birthday to your favorite Blue Devil and link to their story.` },
  { slug: 'x-handles', title: 'Follow the Brotherhood on X', desc: `${players.filter(p => p.twitter).length} Brotherhood players and coaches on X/Twitter — follow and connect.` },
];

export default function ListsIndex() {
  return (
    <>
      <Head>
        <title>Lists &amp; Rankings | Duke&apos;s Brotherhood: Where Are They Now?</title>
        <meta name="description" content={`Explore lists across the ${totalPlayers} Brotherhood players (${profiledCount} profiled): current NBA rosters, lottery picks, McDonald's All-Americans, coaches, top scorers, and more.`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#001A57]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#001A57]">Lists &amp; Rankings</span>
        </nav>

        <h1 className="text-4xl font-bold text-[#001A57] mb-2">Lists &amp; Rankings</h1>
        <p className="text-lg text-gray-600 mb-10">
          Slice the Brotherhood data every way that matters — {profiledCount} players profiled across all {totalPlayers} in the series.
        </p>

        <div className="grid gap-4">
          {lists.map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="block p-5 border border-gray-200 rounded-lg hover:border-[#C5A258] hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-[#001A57]">{list.title}</h2>
              <p className="text-gray-500 mt-1">{list.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
