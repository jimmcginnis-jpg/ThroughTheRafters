// pages/bracket.js
// Brotherhood Bracket Simulator — pick 16 Duke teams, seed by margin, simulate

import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import teamsData from '../data/teams.json';

const CHAMP_SEASONS = ['1990-91','1991-92','2000-01','2009-10','2014-15'];

const ERA_LABELS = {
  foundation: 'Foundation',
  dynasty1: 'Dynasty I',
  transition: 'Transition',
  dynasty2: 'Dynasty II',
  between: 'Between Crowns',
  resurgence: 'Resurgence',
  superteam: 'Superteam',
  scheyer: 'Scheyer Era',
};

const ERA_ORDER = ['foundation','dynasty1','transition','dynasty2','between','resurgence','superteam','scheyer'];

// ─── SIMULATION ENGINE ───
function simulateGame(teamA, teamB) {
  const strengthA = (teamA.ppg * 0.6 + (80 - teamA.oppPpg) * 0.4) + teamA.margin * 0.3;
  const strengthB = (teamB.ppg * 0.6 + (80 - teamB.oppPpg) * 0.4) + teamB.margin * 0.3;
  const rng = () => (Math.random() - 0.5) * 14;
  let scoreA = Math.round(strengthA + rng());
  let scoreB = Math.round(strengthB + rng());
  scoreA = Math.max(55, Math.min(105, scoreA));
  scoreB = Math.max(55, Math.min(105, scoreB));
  if (scoreA === scoreB) scoreA += Math.random() > 0.5 ? 1 : -1;

  const winner = scoreA > scoreB ? teamA : teamB;
  const loser = scoreA > scoreB ? teamB : teamA;
  const winScore = Math.max(scoreA, scoreB);
  const loseScore = Math.min(scoreA, scoreB);

  const starIdx = Math.floor(Math.random() * Math.min(2, winner.scorers.length));
  const star = winner.scorers[starIdx];
  const starPts = star ? Math.round(star.ppg + (Math.random() - 0.3) * 8) : 0;

  return { winner, loser, winScore, loseScore, star: star?.name || '', starPts };
}

// ─── PRESETS ───
function getTop16(teams) {
  return [...teams].sort((a, b) => b.margin - a.margin).slice(0, 16).map(t => t.season);
}

function getChampionsPlus(teams) {
  const champs = teams.filter(t => CHAMP_SEASONS.includes(t.season));
  const titleGame = teams.filter(t => t.ncaa.includes('Title Game') || t.ncaa.includes('Final Four'));
  const rest = [...teams].sort((a, b) => b.margin - a.margin);
  const pool = [...champs, ...titleGame, ...rest];
  const seen = new Set();
  const result = [];
  for (const t of pool) {
    if (!seen.has(t.season)) { seen.add(t.season); result.push(t.season); }
    if (result.length === 16) break;
  }
  return result;
}

function getBestOfEachEra(teams) {
  const picks = [];
  for (const era of ERA_ORDER) {
    const eraTeams = teams.filter(t => t.era === era).sort((a, b) => b.margin - a.margin);
    picks.push(...eraTeams.slice(0, 2).map(t => t.season));
  }
  return picks;
}

// ─── TEAM CARD ───
function TeamCard({ team, selected, onClick }) {
  const isChamp = CHAMP_SEASONS.includes(team.season);
  return (
    <button
      onClick={() => onClick(team.season)}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all relative ${
        selected
          ? 'border-duke-gold bg-duke-gold/5'
          : 'border-gray-100 bg-white hover:border-gray-300'
      }`}
    >
      {isChamp && <span className="absolute top-2 right-2 text-xs">🏆</span>}
      <div className="flex items-center gap-2">
        <span className={`font-display font-bold text-base ${selected ? 'text-duke-navy' : 'text-gray-800'}`}>
          {team.season}
        </span>
        <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
          team.margin >= 14 ? 'bg-green-50 text-green-700' :
          team.margin >= 10 ? 'bg-blue-50 text-blue-700' :
          team.margin >= 5 ? 'bg-gray-50 text-gray-600' :
          'bg-red-50 text-red-600'
        }`}>
          {team.margin > 0 ? '+' : ''}{team.margin}
        </span>
      </div>
      <div className="font-mono text-xs text-gray-400 mt-0.5">
        {team.record} · {ERA_LABELS[team.era]} · {team.scorers[0]?.name || ''}
      </div>
    </button>
  );
}

// ─── MATCHUP BOX ───
function MatchupBox({ game }) {
  if (!game) return null;
  const { teamA, teamB, result } = game;

  const Row = ({ team, seed, isTop }) => {
    const isWinner = result && result.winner.season === team?.season;
    const score = result
      ? (result.winner.season === team?.season ? result.winScore : result.loseScore)
      : null;
    return (
      <div className={`flex items-center justify-between px-3 py-2 ${
        isTop ? 'border-b border-gray-100' : ''
      } ${isWinner ? 'bg-duke-gold/5' : ''}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono text-xs text-gray-400 w-4 text-center shrink-0">{seed}</span>
          <span className={`font-display text-sm truncate ${
            isWinner ? 'font-bold text-duke-navy' : team ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {team ? team.season : 'TBD'}
          </span>
          {isWinner && CHAMP_SEASONS.includes(team.season) && <span className="text-[10px]">🏆</span>}
        </div>
        {score !== null && (
          <span className={`font-mono text-sm ${isWinner ? 'font-bold text-duke-navy' : 'text-gray-400'}`}>
            {score}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm w-48">
      <Row team={teamA} seed={game.seeds?.[0]} isTop />
      <Row team={teamB} seed={game.seeds?.[1]} isTop={false} />
      {result && (
        <div className="px-3 py-1 text-[10px] text-duke-gold font-mono border-t border-gray-50 bg-gray-50/50 italic">
          {result.star} — {result.starPts} pts
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ───
export default function BracketPage({ allTeams }) {
  const [phase, setPhase] = useState('select');
  const [selected, setSelected] = useState(() => getTop16(allTeams));
  const [bracket, setBracket] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [filterEra, setFilterEra] = useState('All');
  const [champion, setChampion] = useState(null);

  const filtered = filterEra === 'All' ? allTeams : allTeams.filter(t => ERA_LABELS[t.era] === filterEra);

  const toggleTeam = useCallback((season) => {
    setSelected(prev => {
      if (prev.includes(season)) return prev.filter(s => s !== season);
      if (prev.length >= 16) return prev;
      return [...prev, season];
    });
  }, []);

  const initBracket = useCallback(() => {
    const teams = selected.map(s => allTeams.find(t => t.season === s)).filter(Boolean);
    teams.sort((a, b) => b.margin - a.margin);
    const seeded = teams.map((t, i) => ({ ...t, seed: i + 1 }));

    // 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
    const order = [0,15,7,8,4,11,3,12,5,10,2,13,6,9,1,14];
    const round0 = [];
    for (let i = 0; i < 16; i += 2) {
      round0.push({
        teamA: seeded[order[i]], teamB: seeded[order[i+1]],
        seeds: [seeded[order[i]].seed, seeded[order[i+1]].seed],
        result: null,
      });
    }
    setBracket([round0, [], [], []]);
    setCurrentRound(0);
    setChampion(null);
    setPhase('bracket');
  }, [selected, allTeams]);

  const simulateRound = useCallback(() => {
    if (!bracket) return;
    const round = bracket[currentRound];
    const newRound = round.map(g => ({ ...g, result: g.result || simulateGame(g.teamA, g.teamB) }));
    const newBracket = [...bracket];
    newBracket[currentRound] = newRound;

    if (currentRound < 3) {
      const nextRound = [];
      for (let i = 0; i < newRound.length; i += 2) {
        const w1 = newRound[i].result.winner;
        const w2 = newRound[i+1]?.result.winner;
        if (w2) nextRound.push({ teamA: w1, teamB: w2, seeds: [w1.seed, w2.seed], result: null });
      }
      newBracket[currentRound + 1] = nextRound;
    }
    setBracket(newBracket);

    if (currentRound === 3) {
      setChampion(newRound[0].result.winner);
    } else {
      setCurrentRound(currentRound + 1);
    }
  }, [bracket, currentRound]);

  const simulateAll = useCallback(() => {
    if (!bracket) return;
    let b = [...bracket];
    for (let r = currentRound; r <= 3; r++) {
      b[r] = b[r].map(g => ({ ...g, result: g.result || simulateGame(g.teamA, g.teamB) }));
      if (r < 3) {
        const next = [];
        for (let i = 0; i < b[r].length; i += 2) {
          const w1 = b[r][i].result.winner;
          const w2 = b[r][i+1]?.result.winner;
          if (w2) next.push({ teamA: w1, teamB: w2, seeds: [w1.seed, w2.seed], result: null });
        }
        b[r+1] = next;
      }
    }
    setBracket(b);
    setCurrentRound(3);
    setChampion(b[3][0].result.winner);
  }, [bracket, currentRound]);

  const roundLabels = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Championship'];

  return (
    <Layout
      title="Bracket Simulator"
      description="Pit any 16 Duke teams against each other across 45 seasons. Who's the greatest team in Brotherhood history?"
      canonical="/bracket/"
    >
      <Head>
        <meta property="og:title" content="Brotherhood Bracket Simulator | Duke's Brotherhood" />
        <meta property="og:description" content="Pick 16 Duke teams from 45 seasons. Simulate a tournament. Settle the debate." />
      </Head>

      {/* Hero */}
      <section className="bg-duke-slate text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <Link href="/" className="hover:text-duke-gold">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-duke-gold">Bracket Simulator</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            {champion ? `🏆 ${champion.season}` : 'Brotherhood Bracket'}
          </h1>
          <p className="font-body text-duke-goldLight text-lg italic">
            {champion
              ? `The ${champion.record} squad from the ${ERA_LABELS[champion.era]} era wins the Brotherhood Title.`
              : 'Pick 16 Duke teams from 45 seasons. Seed them by scoring margin. Simulate the tournament.'
            }
          </p>
        </div>
      </section>

      {/* ───── SELECTION PHASE ───── */}
      {phase === 'select' && (
        <section className="max-w-5xl mx-auto px-4 py-8">
          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: 'Top 16 by Margin', fn: () => setSelected(getTop16(allTeams)) },
              { label: 'Champions + Contenders', fn: () => setSelected(getChampionsPlus(allTeams)) },
              { label: 'Best of Each Era', fn: () => setSelected(getBestOfEachEra(allTeams)) },
              { label: 'Clear All', fn: () => setSelected([]) },
            ].map(p => (
              <button key={p.label} onClick={p.fn}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-xs font-mono font-semibold text-gray-600 hover:border-duke-gold hover:text-duke-navy transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Era Filter */}
          <div className="flex flex-wrap gap-1 mb-4">
            {['All', ...Object.values(ERA_LABELS)].map(era => (
              <button key={era} onClick={() => setFilterEra(era)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                  filterEra === era ? 'bg-duke-navy text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {era}
              </button>
            ))}
          </div>

          {/* Count + Start */}
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <span className={`font-mono text-sm font-bold ${
              selected.length === 16 ? 'text-green-600' : 'text-duke-gold'
            }`}>
              {selected.length} / 16 selected
            </span>
            <button
              disabled={selected.length !== 16}
              onClick={initBracket}
              className={`px-6 py-2 rounded-lg font-mono text-sm font-bold tracking-wider uppercase transition-all ${
                selected.length === 16
                  ? 'bg-duke-navy text-white hover:bg-duke-gold hover:text-duke-navy cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Tournament →
            </button>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map(team => (
              <TeamCard key={team.season} team={team} selected={selected.includes(team.season)} onClick={toggleTeam} />
            ))}
          </div>
        </section>
      )}

      {/* ───── BRACKET PHASE ───── */}
      {phase === 'bracket' && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setPhase('select'); setBracket(null); setChampion(null); }}
              className="px-4 py-2 rounded-lg border border-gray-200 font-mono text-xs font-semibold text-gray-600 hover:border-duke-gold transition-all"
            >
              ← Reselect Teams
            </button>
            {!champion && (
              <>
                <button onClick={simulateRound}
                  className="px-4 py-2 rounded-lg bg-duke-navy text-white font-mono text-xs font-bold hover:bg-duke-gold hover:text-duke-navy transition-all"
                >
                  Simulate {roundLabels[currentRound]}
                </button>
                <button onClick={simulateAll}
                  className="px-4 py-2 rounded-lg bg-duke-gold text-duke-navy font-mono text-xs font-bold hover:bg-duke-navy hover:text-white transition-all"
                >
                  Simulate All →
                </button>
              </>
            )}
            {champion && (
              <button onClick={initBracket}
                className="px-4 py-2 rounded-lg bg-duke-gold text-duke-navy font-mono text-xs font-bold hover:bg-duke-navy hover:text-white transition-all"
              >
                Run It Again
              </button>
            )}
          </div>

          {/* Round indicators */}
          <div className="flex gap-1 mb-6">
            {roundLabels.map((label, i) => (
              <div key={label} className={`px-3 py-1.5 rounded text-xs font-mono font-semibold ${
                bracket && bracket[i]?.some(g => g.result)
                  ? 'bg-duke-navy/10 text-duke-navy'
                  : 'bg-gray-50 text-gray-400'
              }`}>
                {label}
              </div>
            ))}
          </div>

          {/* Bracket Grid */}
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-6 items-start min-w-max">
              {bracket && bracket.map((round, rIdx) => (
                <div key={rIdx} className="flex flex-col justify-center"
                  style={{
                    gap: rIdx === 0 ? '8px' : rIdx === 1 ? '52px' : rIdx === 2 ? '120px' : '0px',
                    paddingTop: rIdx === 0 ? '0' : rIdx === 1 ? '30px' : rIdx === 2 ? '70px' : '150px',
                  }}
                >
                  {round.map((game, gIdx) => (
                    <MatchupBox key={gIdx} game={game} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Champion Card */}
          {champion && (
            <div className="max-w-lg mx-auto mt-10 p-6 rounded-xl border-2 border-duke-gold bg-duke-gold/5 text-center">
              <div className="text-5xl mb-2">🏆</div>
              <div className="font-display text-3xl font-bold text-duke-navy">{champion.season}</div>
              <div className="font-mono text-sm text-gray-500 mt-1">
                {champion.record} · {ERA_LABELS[champion.era]}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {champion.scorers.slice(0, 3).map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display text-sm font-bold text-duke-navy">{s.name}</div>
                    <div className="font-mono text-xs text-duke-gold">{s.ppg} ppg</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-xs text-gray-400 mt-4 italic tracking-wider uppercase">
                Brotherhood Champion
              </div>
            </div>
          )}
        </section>
      )}

      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Brotherhood Bracket Simulator',
            url: 'https://www.dukebrotherhood.com/bracket/',
            description: 'Pit any 16 Duke teams against each other across 45 seasons of Coach K and Scheyer basketball.',
            applicationCategory: 'GameApplication',
          }),
        }}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const allTeams = teamsData.seasons.map(s => {
    const ppg = s.stats?.team?.ppg || 70;
    const oppPpg = s.stats?.team?.oppPpg || 70;
    const ptsLeaders = (s.stats?.leaders || [])
      .filter(l => l.category === 'PTS')
      .slice(0, 3)
      .map(l => ({ name: l.name, ppg: l.ppg || 0 }));

    return {
      season: s.season,
      era: s.era,
      record: s.record,
      ncaa: s.ncaaTournament || '',
      ppg,
      oppPpg,
      margin: Math.round((ppg - oppPpg) * 10) / 10,
      scorers: ptsLeaders,
    };
  });

  return { props: { allTeams } };
}
