// pages/what-if.js
// "What If They Stayed?" — hypothetical rosters if no one left early

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import teamsData from '../data/teams.json';
import playerData from '../data/players.json';

const ERA_LABELS = {
  foundation: 'Foundation', dynasty1: 'Dynasty I', transition: 'Transition',
  dynasty2: 'Dynasty II', between: 'Between Crowns', resurgence: 'Resurgence',
  superteam: 'Superteam', scheyer: 'Scheyer Era',
};

function PlayerLink({ id, name }) {
  const p = playerData.players.find(pl => pl.id === id);
  if (p && p.status === 'done') {
    return <Link href={`/players/${p.slug}/`} className="text-uk-blue hover:text-uk-white transition-colors font-semibold">{name}</Link>;
  }
  return <span className="text-gray-600">{name}</span>;
}

function PickBadge({ pick }) {
  if (!pick) return null;
  const isLottery = pick <= 14;
  const isTop3 = pick <= 3;
  return (
    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
      isTop3 ? 'bg-uk-white/20 text-uk-white font-bold' :
      isLottery ? 'bg-blue-50 text-blue-700' :
      'bg-gray-100 text-gray-500'
    }`}>
      #{pick}
    </span>
  );
}

function SeasonCard({ season }) {
  const { whatIf } = season;
  if (!whatIf) return null;
  const hasReturnees = whatIf.returnees && whatIf.returnees.length > 0;
  const hasFuturePros = whatIf.futurePros && whatIf.futurePros.length > 0;
  if (!hasReturnees && !hasFuturePros) return null;

  const returnees = whatIf.returnees;
  const lotteryCount = whatIf.lotteryCount || 0;

  // Star rating
  const stars = lotteryCount >= 5 ? '★★★★★' : lotteryCount >= 3 ? '★★★★' : lotteryCount >= 2 ? '★★★' : lotteryCount >= 1 ? '★★' : '★';

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100" style={{ background: lotteryCount >= 5 ? '#001A57' : lotteryCount >= 3 ? '#0a2a6e' : '#f8f8f5' }}>
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/teams/${season.season}/`} className="group">
              <h3 className={`font-display text-2xl font-bold ${lotteryCount >= 3 ? 'text-white' : 'text-uk-blue'} group-hover:text-uk-white transition-colors`}>
                {season.season}
              </h3>
            </Link>
            <div className={`font-mono text-xs mt-1 ${lotteryCount >= 3 ? 'text-uk-silver' : 'text-gray-500'}`}>
              {ERA_LABELS[season.era]} · Actual: {season.record} · {season.ncaaTournament}
            </div>
          </div>
          <div className="text-right">
            <div className={`font-display text-lg font-bold ${lotteryCount >= 3 ? 'text-uk-white' : 'text-uk-white'}`}>
              {stars}
            </div>
            <div className={`font-mono text-[10px] ${lotteryCount >= 3 ? 'text-uk-silver' : 'text-gray-400'}`}>
              {lotteryCount} lottery · {whatIf.firstRoundCount} 1st-round
            </div>
          </div>
        </div>
      </div>

      {/* Returnees */}
      <div className="p-5">
        {returnees.length > 0 && (
          <>
            <div className="font-mono text-[10px] text-uk-white uppercase tracking-wider mb-3 font-bold">
              If they had stayed
            </div>
            <div className="space-y-2">
              {returnees
                .sort((a, b) => (a.draftPick || 99) - (b.draftPick || 99))
                .map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <div className="w-6 text-center">
                      <PickBadge pick={r.draftPick} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlayerLink id={r.id} name={r.name} />
                        <span className="font-mono text-[10px] text-gray-400">{r.pos}</span>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {r.wouldBe}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Future Pros — players actually on this roster who got drafted */}
        {whatIf.futurePros && whatIf.futurePros.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-bold">
              Future pros on this roster
            </div>
            <div className="space-y-2">
              {whatIf.futurePros
                .sort((a, b) => (a.draftPick || 99) - (b.draftPick || 99))
                .map((fp, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <div className="w-6 text-center">
                      <PickBadge pick={fp.draftPick} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlayerLink id={fp.id} name={fp.name} />
                        <span className="font-mono text-[10px] text-gray-400">{fp.pos}</span>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-gray-400 text-right">
                      <span>{fp.classYear}</span>
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-uk-white">{fp.lastSeason ? 'left after' : `drafted '${String(fp.draftYear).slice(-2)}`}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Total count */}
        <div className="mt-3 pt-2 border-t border-gray-50">
          <div className="font-mono text-[10px] text-gray-300">
            {(returnees.length || 0) + (whatIf.futurePros?.length || 0)} total NBA draft picks connected to this roster
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhatIfPage({ seasons }) {
  const [minLottery, setMinLottery] = useState(0);

  const filtered = seasons.filter(s => {
    const wi = s.whatIf;
    const hasReturnees = wi.returnees && wi.returnees.length > 0;
    const hasFuturePros = wi.futurePros && wi.futurePros.length > 0;
    if (!hasReturnees && !hasFuturePros) return false;
    return (wi.lotteryCount || 0) >= minLottery;
  });

  const totalReturnees = filtered.reduce((sum, s) => sum + s.whatIf.returnees.length, 0);
  const totalLottery = filtered.reduce((sum, s) => sum + (s.whatIf.lotteryCount || 0), 0);
  const totalFuturePros = filtered.reduce((sum, s) => sum + (s.whatIf.futurePros?.length || 0), 0);

  return (
    <Layout
      title="What If They Stayed?"
      description="Hypothetical Kentucky rosters if every early departure had played out their eligibility. From Elton Brand to Zion Williamson."
      canonical="/what-if/"
    >
      <Head>
        <meta property="og:title" content="What If They Stayed? | Through the Rafters" />
        <meta property="og:description" content="The most terrifying college basketball rosters that never existed." />
      </Head>

      {/* Hero */}
      <section className="bg-uk-slate text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="font-mono text-xs text-uk-silver mb-6 tracking-wider">
            <Link href="/" className="hover:text-uk-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-uk-white">What If They Stayed?</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            What If They Stayed?
          </h1>
          <p className="font-body text-uk-silver text-lg italic max-w-2xl">
            The most terrifying college basketball rosters that never existed. Every season, rebuilt with
            the players who left early for the NBA Draft — as if they&apos;d played out their full eligibility.
          </p>
          <div className="flex gap-6 mt-6 font-mono text-sm">
            <div>
              <span className="text-uk-white font-bold text-2xl">{filtered.length}</span>
              <span className="text-uk-silver ml-1">seasons</span>
            </div>
            <div>
              <span className="text-uk-white font-bold text-2xl">{totalReturnees}</span>
              <span className="text-uk-silver ml-1">what-if returnees</span>
            </div>
            <div>
              <span className="text-uk-white font-bold text-2xl">{totalLottery}</span>
              <span className="text-uk-silver ml-1">lottery picks</span>
            </div>
            <div>
              <span className="text-uk-white font-bold text-2xl">{totalFuturePros}</span>
              <span className="text-uk-silver ml-1">future pros on rosters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-wider mr-2">Show:</span>
          {[
            { label: 'All Seasons', value: 0 },
            { label: '1+ Lottery', value: 1 },
            { label: '3+ Lottery', value: 3 },
            { label: '5+ Lottery', value: 5 },
          ].map(f => (
            <button key={f.value} onClick={() => setMinLottery(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                minLottery === f.value ? 'bg-uk-blue text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Season Cards — reverse chronological */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {filtered
            .sort((a, b) => b.season.localeCompare(a.season))
            .map(season => (
              <SeasonCard key={season.season} season={season} />
            ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-display text-xl text-gray-400">No seasons match this filter.</p>
          </div>
        )}
      </section>

      {/* The crown jewel callout */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="p-6 rounded-xl border-2 border-uk-white bg-uk-white/5 text-center">
          <div className="font-mono text-[10px] text-uk-white uppercase tracking-wider mb-2">The ultimate what-if</div>
          <h2 className="font-display text-2xl font-bold text-uk-blue mb-2">
            2019-20: Eight NBA players. One roster.
          </h2>
          <p className="font-body text-gray-600 text-sm max-w-xl mx-auto">
            Jayson Tatum as a senior. Zion Williamson and RJ Barrett as sophomores.
            Marvin Bagley III as a junior. Wendell Carter Jr. Cam Reddish. Gary Trent Jr. Harry Giles III.
            Plus the actual roster of Vernon Carey Jr., Tre Jones, and Cassius Stanley.
            A team that would have been favored against most NBA rosters.
          </p>
        </div>
      </section>

      {/* Footer nav */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex justify-between border-t border-gray-200 pt-6">
          <Link href="/bracket/" className="font-mono text-sm text-uk-white hover:underline">
            &larr; Bracket Simulator
          </Link>
          <Link href="/lists/" className="font-mono text-sm text-uk-white hover:underline">
            All Lists &rarr;
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'What If They Stayed? — Kentucky Through the Rafters',
            url: 'https://www.throughtherafters.com/what-if/',
            description: 'Hypothetical Kentucky basketball rosters if every early departure had stayed through their senior year.',
          }),
        }}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const seasons = teamsData.seasons
    .filter(s => {
      const wi = s.whatIf;
      if (!wi) return false;
      const hasReturnees = wi.returnees && wi.returnees.length > 0;
      const hasFuturePros = wi.futurePros && wi.futurePros.length > 0;
      return hasReturnees || hasFuturePros;
    })
    .map(s => ({
      season: s.season,
      era: s.era,
      record: s.record,
      ncaaTournament: s.ncaaTournament || '',
      whatIf: {
        returnees: s.whatIf?.returnees || [],
        lotteryCount: s.whatIf?.lotteryCount || 0,
        firstRoundCount: s.whatIf?.firstRoundCount || 0,
        futurePros: s.whatIf?.futurePros || [],
      },
    }));

  return { props: { seasons } };
}
