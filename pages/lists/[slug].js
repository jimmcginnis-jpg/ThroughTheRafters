// pages/lists/[slug].js
// Drop this file into pages/lists/

import Head from 'next/head';
import Link from 'next/link';
import playersData from '../../data/players.json';

const players = playersData.players;
const profiledPlayers = players.filter(p => p.status === 'done');
const profiledCount = profiledPlayers.length;

const eraNames = {
  foundation: 'I. Foundation (1981–85)',
  dynasty1: 'II. First Dynasty (1986–94)',
  transition: 'III. Transition (1995–98)',
  dynasty2: 'IV. Second Dynasty (1999–04)',
  between: 'V. In Between (2005–09)',
  resurgence: 'VI. Resurgence (2010–15)',
  superteam: 'VII. Superteam Era (2016–22)',
  scheyer: 'VIII. The Scheyer Era (2022–)',
};

const eraOrder = ['foundation','dynasty1','transition','dynasty2','between','resurgence','superteam','scheyer'];

// ── Reusable table component ──
function ListTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#001A57] text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? 'bg-gray-50' : ''}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 border-b border-gray-200 whitespace-nowrap">
                  {cell && typeof cell === 'object' && cell.link ? (
                    <Link href={cell.link} className="text-[#001A57] hover:text-[#C5A258] font-medium">
                      {cell.text}
                    </Link>
                  ) : cell && typeof cell === 'object' && cell.stub ? (
                    <span className="text-gray-400">{cell.text}</span>
                  ) : cell && typeof cell === 'object' && cell.text ? (
                    cell.text
                  ) : (
                    String(cell != null ? cell : '—')
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Data filter functions ──
function getCurrentNBA() {
  return players.filter(p => {
    if (!p.nba) return false;
    if (p.nba.lastSeason && (p.nba.lastSeason.includes('2025') || p.nba.lastSeason.includes('2026'))) return true;
    if (p.nba.careerYears && p.nba.careerYears.includes('present')) return true;
    return false;
  }).sort((a, b) => (b.nba.ppg || 0) - (a.nba.ppg || 0));
}

function getLotteryPicks() {
  return players.filter(p => p.nba && p.nba.draftPick && p.nba.draftPick <= 14 && !p.nba.undrafted)
    .sort((a, b) => a.nba.draftYear - b.nba.draftYear);
}

function getNo1Picks() {
  return players.filter(p => p.nba && p.nba.draftPick === 1)
    .sort((a, b) => a.nba.draftYear - b.nba.draftYear);
}

function getMcDonalds() {
  return players.filter(p => JSON.stringify(p.bio || {}).toLowerCase().includes('mcdonald'))
    .sort((a, b) => (parseInt(a.years) || 0) - (parseInt(b.years) || 0));
}

function getCoaches() {
  return players.filter(p => {
    const n = (p.now || '').toLowerCase();
    return n.includes('hc ') || n.includes('head coach') || n.includes('coach') || n.includes('assistant coach');
  }).sort((a, b) => (parseInt(a.years) || 0) - (parseInt(b.years) || 0));
}

function getTopScorers() {
  return players.filter(p => p.nba && p.nba.ppg && p.nba.games >= 50)
    .sort((a, b) => b.nba.ppg - a.nba.ppg);
}

function getIronMen() {
  return players.filter(p => p.nba && p.nba.games >= 500)
    .sort((a, b) => b.nba.games - a.nba.games);
}

function getUndrafted() {
  return players.filter(p => p.nba && p.nba.undrafted)
    .sort((a, b) => (parseInt(a.years) || 0) - (parseInt(b.years) || 0));
}

function getDraftHistory() {
  return players.filter(p => p.nba && p.nba.draftYear && !p.nba.undrafted)
    .sort((a, b) => a.nba.draftYear - b.nba.draftYear);
}

// Helper to make a player cell with link
function pLink(p) {
  if (p.status === 'done') {
    return { text: p.name, link: `/players/${p.slug}` };
  }
  return { text: p.name, stub: true };
}

// ── List configurations ──
const listConfigs = {
  'all-players': {
    title: `All ${players.length} Brotherhood Players (1981–Present)`,
    subtitle: `${profiledCount} profiled with full narratives · ${players.length - profiledCount} more coming soon`,
    meta: `All ${players.length} Duke Brotherhood players across 8 eras — ${profiledCount} profiled with full narratives, the rest coming soon.`,
  },
  'currently-in-nba': {
    title: 'Brotherhood Players Currently in the NBA',
    subtitle: `Active in the 2025–26 NBA season, among the ${profiledCount} players profiled.`,
    meta: 'Brotherhood players currently active in the 2025-26 NBA season with stats and teams.',
  },
  'number-one-picks': {
    title: '#1 Overall NBA Draft Picks Among the Brotherhood',
    subtitle: 'Five Brotherhood players were selected first overall — more than any program in history.',
    meta: 'The five Duke Brotherhood players selected #1 overall in the NBA Draft.',
  },
  'lottery-picks': {
    title: `NBA Lottery Picks Among the ${profiledCount} Brotherhood Players`,
    subtitle: 'Every Brotherhood player drafted in the top 14, from Johnny Dawkins (1986) to Cooper Flagg (2025).',
    meta: 'Duke Brotherhood players selected in the NBA lottery with draft position, team, and career stats.',
  },
  'mcdonalds-all-americans': {
    title: "McDonald's All-Americans Among the Brotherhood",
    subtitle: "Brotherhood players who earned McDonald's All-American honors before arriving at Duke.",
    meta: `McDonald's All-Americans among the ${profiledCount} Duke Brotherhood players profiled.`,
  },
  'coaches': {
    title: 'Brotherhood Players Who Became Coaches',
    subtitle: `From NBA head coaches to college builders — coaching paths among the ${profiledCount} players profiled.`,
    meta: 'Duke Brotherhood players who became coaches, including JJ Redick, Quin Snyder, Tommy Amaker, and Jon Scheyer.',
  },
  'top-nba-scorers': {
    title: 'Top NBA Scorers Among the Brotherhood',
    subtitle: `Career PPG leaders among the ${profiledCount} Brotherhood players (min. 50 games).`,
    meta: `Highest NBA scorers among Duke's ${profiledCount} Brotherhood players, ranked by career PPG.`,
  },
  'nba-iron-men': {
    title: 'Brotherhood Iron Men: 500+ NBA Games',
    subtitle: 'Brotherhood players who logged 500 or more NBA games.',
    meta: 'Duke Brotherhood players with 500+ NBA career games, led by Grant Hill with 1,026.',
  },
  'undrafted': {
    title: 'Undrafted Brotherhood Players',
    subtitle: 'Not every Brotherhood member went to the NBA. Their stories are just as compelling.',
    meta: 'Duke Brotherhood players who went undrafted — coaches, broadcasters, executives, and more.',
  },
  'draft-history': {
    title: 'Brotherhood NBA Draft History (1986–2025)',
    subtitle: `Every drafted player among the ${profiledCount} Brotherhood profiles, year by year.`,
    meta: `NBA draft history for the ${profiledCount} Duke Brotherhood players profiled, from 1986 to 2025.`,
  },
  'by-the-numbers': {
    title: 'The Brotherhood: By the Numbers',
    subtitle: `Key stats and milestones across all ${players.length} players — ${profiledCount} profiled so far.`,
    meta: `Stats and milestones from Duke's Brotherhood — ${players.length} players, 8 eras, 40+ years.`,
  },
};

// ── Static generation ──
export async function getStaticPaths() {
  const paths = Object.keys(listConfigs).map(slug => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const config = listConfigs[params.slug];
  if (!config) return { notFound: true };
  return { props: { slug: params.slug, ...config } };
}

// ── Render functions for each list ──
function RenderAllPlayers() {
  return (
    <>
      <div className="flex items-center gap-6 text-sm mb-6 pb-4 border-b border-gray-200">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#001A57]"></span>
          <span className="font-medium text-[#001A57]">Profiled ({profiledCount})</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="text-gray-400">Coming Soon ({players.length - profiledCount})</span>
        </span>
      </div>
      {eraOrder.map(era => {
        const eraPlayers = players.filter(p => p.era === era);
        const eraProfiled = eraPlayers.filter(p => p.status === 'done').length;
        const eraStubs = eraPlayers.length - eraProfiled;
        return (
          <div key={era} className="mb-8">
            <h2 className="text-2xl font-bold text-[#001A57] mb-1">{eraNames[era]}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {eraPlayers.length} players · <span className="text-[#001A57] font-medium">{eraProfiled} profiled</span>{eraStubs > 0 && <> · <span className="text-gray-400">{eraStubs} coming soon</span></>}
            </p>
            <ListTable
              headers={['Player', 'Pos', 'Years', 'Drafted', 'NBA PPG', 'Now']}
              rows={eraPlayers.map(p => [
                pLink(p), p.pos, p.years,
                p.drafted || 'Undrafted',
                p.nba && p.nba.ppg ? `${p.nba.ppg} (${p.nba.games}g)` : '—',
                (p.now || '').substring(0, 45),
              ])}
            />
          </div>
        );
      })}
    </>
  );
}

function RenderCurrentlyInNBA() {
  const data = getCurrentNBA();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players are currently active in the NBA.</p>
      <ListTable
        headers={['Player', 'Current Team', 'Draft', 'Games', 'PPG', 'RPG', 'APG']}
        rows={data.map(p => [
          pLink(p),
          (p.nba.teams && p.nba.teams.length > 0) ? p.nba.teams[p.nba.teams.length - 1].team : '—',
          p.nba.draftPick ? `#${p.nba.draftPick} (${p.nba.draftYear})` : 'Undrafted',
          p.nba.games || '—', p.nba.ppg || '—', p.nba.rpg || '—', p.nba.apg || '—',
        ])}
      />
    </>
  );
}

function RenderNo1Picks() {
  const data = getNo1Picks();
  return (
    <ListTable
      headers={['Player', 'Year', 'Team', 'Games', 'PPG', 'RPG', 'Highlights']}
      rows={data.map(p => [
        pLink(p), p.nba.draftYear, p.nba.draftTeam,
        p.nba.games || '—', p.nba.ppg || '—', p.nba.rpg || '—',
        (p.nba.highlights || []).slice(0, 2).map(h => typeof h === 'string' ? h : h.note || '').join('; ') || p.now || '—',
      ])}
    />
  );
}

function RenderLotteryPicks() {
  const data = getLotteryPicks();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players have been selected in the NBA lottery.</p>
      <ListTable
        headers={['Player', 'Year', 'Pick', 'Team', 'Games', 'PPG', 'Era']}
        rows={data.map(p => [
          pLink(p), p.nba.draftYear, `#${p.nba.draftPick}`, p.nba.draftTeam,
          p.nba.games || '—', p.nba.ppg || '—',
          (eraNames[p.era] || '').split('(')[0].trim(),
        ])}
      />
    </>
  );
}

function RenderMcDonalds() {
  const data = getMcDonalds();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players earned McDonald&apos;s All-American honors.</p>
      <ListTable
        headers={['Player', 'Pos', 'Years', 'Drafted', 'Era']}
        rows={data.map(p => [
          pLink(p), p.pos, p.years,
          p.drafted || 'Undrafted',
          (eraNames[p.era] || '').split('(')[0].trim(),
        ])}
      />
    </>
  );
}

function RenderCoaches() {
  const data = getCoaches();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood members went into coaching.</p>
      <ListTable
        headers={['Player', 'Years at Duke', 'Current Coaching Role', 'NBA Games']}
        rows={data.map(p => [
          pLink(p), p.years,
          (p.now || '').substring(0, 80),
          (p.nba && p.nba.games) || '—',
        ])}
      />
    </>
  );
}

function RenderTopScorers() {
  const data = getTopScorers();
  return (
    <ListTable
      headers={['#', 'Player', 'PPG', 'RPG', 'APG', 'Games', 'Draft']}
      rows={data.map((p, i) => [
        i + 1, pLink(p),
        p.nba.ppg, p.nba.rpg || '—', p.nba.apg || '—', p.nba.games,
        p.nba.draftPick ? `#${p.nba.draftPick} (${p.nba.draftYear})` : 'Undrafted',
      ])}
    />
  );
}

function RenderIronMen() {
  const data = getIronMen();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players logged 500+ NBA games.</p>
      <ListTable
        headers={['Player', 'Games', 'PPG', 'RPG', 'APG', 'Career Span']}
        rows={data.map(p => [
          pLink(p), p.nba.games,
          p.nba.ppg || '—', p.nba.rpg || '—', p.nba.apg || '—',
          p.nba.careerYears || '—',
        ])}
      />
    </>
  );
}

function RenderUndrafted() {
  const data = getUndrafted();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players went undrafted — many found remarkable paths.</p>
      <ListTable
        headers={['Player', 'Pos', 'Years', 'Where They Are Now']}
        rows={data.map(p => [
          pLink(p), p.pos, p.years,
          (p.now || '').substring(0, 90),
        ])}
      />
    </>
  );
}

function RenderDraftHistory() {
  const data = getDraftHistory();
  return (
    <>
      <p className="text-lg text-gray-700 mb-6">{data.length} Brotherhood players have been drafted across four decades.</p>
      <ListTable
        headers={['Year', 'Player', 'Pick', 'Team', 'Games', 'PPG']}
        rows={data.map(p => [
          p.nba.draftYear, pLink(p),
          `#${p.nba.draftPick}`, p.nba.draftTeam,
          p.nba.games || '—', p.nba.ppg || '—',
        ])}
      />
    </>
  );
}

function RenderByTheNumbers() {
  const currentNBA = getCurrentNBA();
  const lottery = getLotteryPicks();
  const ironMen = getIronMen();
  const mcD = getMcDonalds();
  const coaches = getCoaches();
  const undrafted = getUndrafted();
  const scorers = getTopScorers();
  const drafted = getDraftHistory();

  const stats = [
    ['Total Brotherhood Players', `${players.length}`],
    ['Players Profiled', `${profiledCount}`],
    ['Eras Covered', '8 (1981–present)'],
    ['NBA Draft Picks', `${drafted.length}`],
    ['Lottery Picks (Top 14)', `${lottery.length}`],
    ['#1 Overall Picks', `${players.filter(p => p.status === 'done' && p.nba && p.nba.draftPick === 1).length}`],
    ['Currently Active in NBA', `${currentNBA.length}`],
    ['Players with 500+ NBA Games', `${ironMen.length}`],
    ["McDonald's All-Americans", `${mcD.length}`],
    ['Players Who Became Coaches', `${coaches.length}`],
    ['Undrafted Players', `${undrafted.length}`],
    ['Highest Career PPG', scorers[0] ? `${scorers[0].name} (${scorers[0].nba.ppg})` : '—'],
    ['Most NBA Games', ironMen[0] ? `${ironMen[0].name} (${ironMen[0].nba.games})` : '—'],
  ];

  return (
    <div className="max-w-2xl">
      {stats.map(([label, value], i) => (
        <div key={i} className={`flex justify-between px-4 py-3 ${i % 2 === 1 ? 'bg-gray-50' : ''} border-b border-gray-200`}>
          <span className="font-medium text-[#001A57]">{label}</span>
          <span className="text-gray-700 font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Slug-to-renderer map ──
const renderers = {
  'all-players': RenderAllPlayers,
  'currently-in-nba': RenderCurrentlyInNBA,
  'number-one-picks': RenderNo1Picks,
  'lottery-picks': RenderLotteryPicks,
  'mcdonalds-all-americans': RenderMcDonalds,
  'coaches': RenderCoaches,
  'top-nba-scorers': RenderTopScorers,
  'nba-iron-men': RenderIronMen,
  'undrafted': RenderUndrafted,
  'draft-history': RenderDraftHistory,
  'by-the-numbers': RenderByTheNumbers,
};

// ── Page component ──
export default function ListPage({ slug, title, subtitle, meta }) {
  const RenderContent = renderers[slug];

  if (!RenderContent) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-red-600">List not found</h1>
        <Link href="/lists" className="text-[#001A57] hover:text-[#C5A258] mt-4 inline-block">← Back to Lists</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} | Duke&apos;s Brotherhood</title>
        <meta name="description" content={meta} />
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#001A57]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/lists" className="hover:text-[#001A57]">Lists</Link>
          <span className="mx-2">/</span>
          <span className="text-[#001A57]">{title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-[#001A57] mb-2">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{subtitle}</p>

        <RenderContent />

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/lists" className="text-[#001A57] hover:text-[#C5A258] font-medium">
            ← All Lists &amp; Rankings
          </Link>
        </div>
      </div>
    </>
  );
}
