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
  'charities': {
    title: 'Charities the Brotherhood Supports',
    subtitle: `Every profiled player links to a charitable organization — player-specific foundations and Duke-connected causes.`,
    meta: `Charitable organizations supported by Duke's Brotherhood — from player-specific foundations to Duke-connected causes across ${profiledCount} profiled players.`,
  },
  'birthdays': {
    title: 'Brotherhood Birthdays',
    subtitle: `${players.filter(p => p.dob).length} birthdays tracked across the Brotherhood — wish them a happy birthday and share their story.`,
    meta: `Birthday calendar for Duke's Brotherhood players. Find out which Blue Devil shares your birthday and explore their story.`,
  },
  'x-handles': {
    title: 'Follow the Brotherhood on X',
    subtitle: `${players.filter(p => p.twitter).length} Brotherhood players and coaches on X/Twitter — follow and connect.`,
    meta: `X/Twitter handles for Duke Brotherhood players and coaches. Follow ${players.filter(p => p.twitter).length} Blue Devils.`,
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

function RenderCharities() {
  const charityPlayers = players.filter(p => p.status === 'done' && p.charity);
  const customPlayers = charityPlayers.filter(p => !p.charity.isDefault);
  const defaultPlayers = charityPlayers.filter(p => p.charity.isDefault);

  // Group custom charities by URL (shared charities like Luol Deng Foundation)
  const customGroups = {};
  customPlayers.forEach(p => {
    const key = p.charity.url;
    if (!customGroups[key]) customGroups[key] = { ...p.charity, players: [] };
    customGroups[key].players.push(p);
  });
  const customList = Object.values(customGroups);

  // Group defaults into 3 foundations with player counts
  const defaultGroups = {};
  defaultPlayers.forEach(p => {
    const key = p.charity.name;
    if (!defaultGroups[key]) defaultGroups[key] = { ...p.charity, players: [] };
    defaultGroups[key].players.push(p);
  });
  const defaultList = Object.values(defaultGroups);

  return (
    <>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-200">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#C5A258]"></span>
          <span><strong className="text-[#001A57]">{customList.length}</strong> player-specific foundations</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#001A57]"></span>
          <span><strong className="text-[#001A57]">{defaultList.length}</strong> Duke-connected charities</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span>
          <span><strong className="text-gray-700">{charityPlayers.length}</strong> total players with charity links</span>
        </span>
      </div>

      {/* Player-Specific Foundations */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-[#001A57] mb-1">Player-Specific Foundations</h2>
        <p className="text-gray-500 mb-6">
          These charities are directly tied to a Brotherhood player&apos;s personal story &mdash; causes they
          founded, survived, or championed.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {customList.map(c => (
            <div key={c.url} className="rounded-xl border border-[#C5A258] bg-gradient-to-br from-[#001A57]/[0.02] to-[#C5A258]/[0.04] p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[#001A57]">{c.name}</h3>
                <svg className="w-5 h-5 text-[#C5A258] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{c.description}</p>
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Connected to</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {c.players.map(p => (
                    p.status === 'done' ? (
                      <Link key={p.slug} href={`/players/${p.slug}`} className="inline-block text-xs bg-[#001A57]/10 text-[#001A57] px-2 py-0.5 rounded-full hover:bg-[#001A57] hover:text-white transition-colors">
                        {p.name}
                      </Link>
                    ) : (
                      <span key={p.name} className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p.name}</span>
                    )
                  ))}
                </div>
              </div>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-[#C5A258] hover:text-[#001A57] transition-colors">
                {c.label}
                <svg className="inline w-3.5 h-3.5 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Duke-Connected Charities */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-[#001A57] mb-1">Duke-Connected Charities</h2>
        <p className="text-gray-500 mb-6">
          For players without a specific personal foundation, we rotate among three organizations
          with deep ties to the Duke basketball family.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {defaultList.map(c => (
            <div key={c.url} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-shadow">
              <h3 className="text-base font-bold text-gray-800 mb-2">{c.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{c.description}</p>
              <p className="text-xs text-gray-400 mb-3">
                Featured on <strong className="text-gray-600">{c.players.length}</strong> Brotherhood profiles
              </p>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-[#001A57] hover:text-[#C5A258] transition-colors">
                {c.label}
                <svg className="inline w-3.5 h-3.5 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#001A57]/[0.03] rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#001A57] mb-3">How Charity Links Work on This Site</h2>
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>
            Every profiled Brotherhood player has a charity link at the bottom of their profile page.
            When we can tie a player to a specific cause &mdash; a foundation they started, a disease they or their
            family faced, or an organization that shaped their journey &mdash; we feature that charity directly.
          </p>
          <p>
            For players where we haven&apos;t yet identified a personal cause, we rotate among three
            Duke-connected organizations: <strong>Duke Children&apos;s Hospital</strong>,
            the <strong>Emily Krzyzewski Center</strong>, and <strong>The V Foundation for Cancer Research</strong>.
          </p>
          <p>
            The Duke Brotherhood project is not affiliated with any of these organizations.
            All links go directly to each charity&apos;s official donation page.
          </p>
        </div>
      </section>
    </>
  );
}

function RenderBirthdays() {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthAbbr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const withDob = players.filter(p => p.dob).map(p => {
    const [y, m, d] = p.dob.split('-').map(Number);
    return { ...p, dobYear: y, dobMonth: m, dobDay: d };
  });

  const today = new Date();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  // Group by month
  const byMonth = {};
  monthNames.forEach((_, i) => { byMonth[i + 1] = []; });
  withDob.forEach(p => { byMonth[p.dobMonth].push(p); });
  // Sort within each month by day
  Object.values(byMonth).forEach(arr => arr.sort((a, b) => a.dobDay - b.dobDay));

  // Find today's and this week's birthdays
  const todayBirthdays = withDob.filter(p => p.dobMonth === todayM && p.dobDay === todayD);
  const weekBirthdays = withDob.filter(p => {
    const bd = new Date(today.getFullYear(), p.dobMonth - 1, p.dobDay);
    const diff = (bd - today) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  });

  const siteUrl = 'https://www.dukebrotherhood.com';

  function tweetUrl(p) {
    const age = today.getFullYear() - p.dobYear;
    const playerUrl = `${siteUrl}/players/${p.slug}/`;
    const text = `🎂 Happy Birthday to Duke Brotherhood member ${p.name}! Born ${monthAbbr[p.dobMonth - 1]} ${p.dobDay}, ${p.dobYear} (${age} today). Read his story: ${playerUrl} #DukeBrotherhood #GoDuke`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }

  // Reorder months starting from current month
  const monthOrder = [];
  for (let i = 0; i < 12; i++) {
    monthOrder.push(((todayM - 1 + i) % 12) + 1);
  }

  return (
    <>
      {/* Today's Birthdays */}
      {todayBirthdays.length > 0 && (
        <div className="mb-8 rounded-xl border-2 border-[#C5A258] bg-gradient-to-r from-[#001A57]/[0.03] to-[#C5A258]/[0.08] p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎂</span>
            <h2 className="text-xl font-bold text-[#001A57]">Today&apos;s Birthday{todayBirthdays.length > 1 ? 's' : ''}!</h2>
          </div>
          {todayBirthdays.map(p => {
            const age = today.getFullYear() - p.dobYear;
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 border-b last:border-0 border-[#C5A258]/30">
                <div>
                  {p.status === 'done' ? (
                    <Link href={`/players/${p.slug}/`} className="text-lg font-bold text-[#001A57] hover:text-[#C5A258]">{p.name}</Link>
                  ) : (
                    <span className="text-lg font-bold text-gray-600">{p.name}</span>
                  )}
                  <span className="ml-2 text-sm text-gray-500">turns {age} today</span>
                  <div className="text-sm text-gray-500">{p.pos} · {p.years} · {p.hometown || ''}</div>
                </div>
                <a href={tweetUrl(p)} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#001A57] text-white text-sm font-semibold hover:bg-[#C5A258] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Tweet Happy Birthday
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Coming Up This Week */}
      {weekBirthdays.length > 0 && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Coming Up This Week</h2>
          <div className="flex flex-wrap gap-4">
            {weekBirthdays.map(p => (
              <div key={p.id} className="text-sm">
                <span className="font-mono text-[#C5A258] font-bold">{monthAbbr[p.dobMonth - 1]} {p.dobDay}</span>
                {' '}
                {p.status === 'done' ? (
                  <Link href={`/players/${p.slug}/`} className="text-[#001A57] hover:text-[#C5A258] font-medium">{p.name}</Link>
                ) : (
                  <span className="text-gray-500">{p.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Calendar by Month - starting from current month */}
      {monthOrder.map(m => {
        const monthPlayers = byMonth[m];
        if (monthPlayers.length === 0) return null;
        const isCurrent = m === todayM;
        return (
          <div key={m} className="mb-8" id={`month-${m}`}>
            <h2 className={`text-2xl font-bold mb-1 ${isCurrent ? 'text-[#C5A258]' : 'text-[#001A57]'}`}>
              {monthNames[m - 1]}
              <span className="ml-2 text-sm font-normal text-gray-400">({monthPlayers.length} birthday{monthPlayers.length !== 1 ? 's' : ''})</span>
              {isCurrent && <span className="ml-2 text-sm font-semibold text-[#C5A258]">← This month</span>}
            </h2>
            <ListTable
              headers={['Date', 'Player', 'Born', 'Age', 'Pos', 'Years', 'Tweet']}
              rows={monthPlayers.map(p => {
                const age = today.getFullYear() - p.dobYear;
                const isToday = p.dobMonth === todayM && p.dobDay === todayD;
                const dateStr = `${monthAbbr[m - 1]} ${p.dobDay}`;
                return [
                  isToday ? { text: `🎂 ${dateStr}` } : dateStr,
                  pLink(p),
                  p.dobYear,
                  age,
                  p.pos,
                  p.years,
                  p.status === 'done' ? { text: (
                    <a href={tweetUrl(p)} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#001A57] text-white text-xs hover:bg-[#C5A258] transition-colors"
                       onClick={e => e.stopPropagation()}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Post
                    </a>
                  )} : '—',
                ];
              })}
            />
          </div>
        );
      })}

      {/* Month Quick Jump */}
      <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Jump to Month</h3>
        <div className="flex flex-wrap gap-2">
          {monthOrder.map(m => {
            const count = byMonth[m].length;
            return (
              <a key={m} href={`#month-${m}`}
                 className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${m === todayM ? 'bg-[#C5A258] text-white' : 'bg-white border border-gray-200 text-[#001A57] hover:border-[#C5A258]'}`}>
                {monthAbbr[m - 1]} <span className="text-xs opacity-60">({count})</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Social tip */}
      <div className="mt-8 p-5 rounded-xl bg-[#001A57]/[0.03] border border-[#001A57]/10">
        <h3 className="font-bold text-[#001A57] mb-2">How to Use This Page</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Check back daily to see which Brotherhood member&apos;s birthday it is. Hit the Tweet button to post a birthday
          message that links directly to their profile on the site. Tag <strong>@DukeBrotherhood</strong> and use
          <strong> #DukeBrotherhood #GoDuke</strong> to connect with other fans celebrating.
        </p>
      </div>
    </>
  );
}

function RenderXHandles() {
  const withHandles = players
    .filter(p => p.twitter)
    .sort((a, b) => {
      const eraIdx = (e) => eraOrder.indexOf(e);
      if (eraIdx(a.era) !== eraIdx(b.era)) return eraIdx(a.era) - eraIdx(b.era);
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <p className="text-lg text-gray-700 mb-6">
        {withHandles.length} Brotherhood players and coaches are on X/Twitter.
        Handles are shown without the @ for easy copying.
      </p>

      {eraOrder.map(era => {
        const eraPlayers = withHandles.filter(p => p.era === era);
        if (eraPlayers.length === 0) return null;
        return (
          <div key={era} className="mb-8">
            <h2 className="text-xl font-bold text-[#001A57] mb-3">{eraNames[era] || era}</h2>
            <ListTable
              headers={['Player', 'Years', 'X Handle', 'Where They Are Now']}
              rows={eraPlayers.map(p => [
                pLink(p),
                p.years,
                { text: (
                  <a
                    href={`https://x.com/${p.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#001A57] hover:text-[#C5A258] font-mono"
                  >
                    @{p.twitter}
                  </a>
                )},
                (p.now || '').substring(0, 60) || '—',
              ])}
            />
          </div>
        );
      })}
    </>
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
  'charities': RenderCharities,
  'birthdays': RenderBirthdays,
  'x-handles': RenderXHandles,
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
