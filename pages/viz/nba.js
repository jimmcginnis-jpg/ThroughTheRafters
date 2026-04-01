// pages/viz/nba.js
// Kentucky Players in the NBA by Season — bar chart visualization

import { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

const eraRanges = {
  foundation: ['1981-82','1985-86'],
  dynasty1: ['1986-87','1993-94'],
  transition: ['1994-95','1997-98'],
  dynasty2: ['1998-99','2003-04'],
  between: ['2004-05','2008-09'],
  resurgence: ['2009-10','2014-15'],
  superteam: ['2015-16','2021-22'],
  scheyer: ['2022-23','2025-26'],
};

function getEraForSeason(season) {
  for (const [era, [start, end]] of Object.entries(eraRanges)) {
    if (season >= start && season <= end) return era;
  }
  return 'scheyer';
}

const eraColors = {
  foundation: '#8B4513', dynasty1: '#C5A258', transition: '#6B8E23',
  dynasty2: '#B22222', between: '#4169E1', resurgence: '#2E8B57',
  superteam: '#9932CC', scheyer: '#FF6347',
};

export default function NBAViz() {
  const [hoveredSeason, setHoveredSeason] = useState(null);

  // Build per-season data with deduplication
  const seasonData = useMemo(() => {
    const seasons = {};

    data.players.forEach(p => {
      if (!p.nba || !p.nba.teams || !Array.isArray(p.nba.teams)) return;
      const seenSeasons = new Set();
      p.nba.teams.forEach(t => {
        if (!t.seasons || !Array.isArray(t.seasons)) return;
        t.seasons.forEach(s => {
          // Skip malformed entries
          if (!s || s.length < 7) return;
          if (seenSeasons.has(s)) return; // deduplicate within player
          seenSeasons.add(s);
          if (!seasons[s]) seasons[s] = [];
          seasons[s].push({
            name: p.name,
            slug: p.slug,
            status: p.status,
            team: t.team,
          });
        });
      });
    });

    // Sort by season and filter to valid NBA seasons
    return Object.entries(seasons)
      .filter(([s]) => s.match(/^\d{4}-\d{2,4}$/))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([season, players]) => ({
        season,
        count: players.length,
        players,
        era: getEraForSeason(season),
        label: season.split('-')[0] + '-' + season.split('-')[1].slice(-2),
      }));
  }, []);

  const maxCount = seasonData.length > 0 ? Math.max(...seasonData.map(s => s.count)) : 1;
  const hoveredData = hoveredSeason ? seasonData.find(s => s.season === hoveredSeason) : null;

  // Stats
  const currentSeason = seasonData.length > 0 ? seasonData[seasonData.length - 1] : null;
  const peak = seasonData.length > 0 ? seasonData.reduce((a, b) => b.count > a.count ? b : a, seasonData[0]) : null;
  const totalPlayerSeasons = seasonData.reduce((sum, s) => sum + s.count, 0);

  // SEO prose stats
  const uniqueNBAPlayers = useMemo(() => {
    const names = new Set();
    data.players.forEach(p => {
      if (p.nba && p.nba.teams && Array.isArray(p.nba.teams) && p.nba.teams.length > 0) {
        names.add(p.name);
      }
    });
    return names.size;
  }, []);

  const no1Picks = useMemo(() => {
    return data.players.filter(p => p.nba && p.nba.draftPick === 1).map(p => p.name);
  }, []);

  const lotteryPicks = useMemo(() => {
    return data.players.filter(p => p.nba && p.nba.draftPick && p.nba.draftPick <= 14 && !p.nba.undrafted);
  }, []);

  const avgPerSeason = seasonData.length > 0
    ? (totalPlayerSeasons / seasonData.length).toFixed(1)
    : 0;

  return (
    <Layout
      title="How Many Kentucky Players Are in the NBA? | Kentucky in the NBA by Season"
      description="Kentucky has had NBA players on opening-day rosters every season since 1983. Track how many Wildcats were in the league each year, from Johnny Dawkins to Cooper Flagg."
      canonical="/viz/nba/"
    >
      <div className="bg-uk-slate py-12">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="font-mono text-xs text-uk-silver mb-6 tracking-wider">
            <a href="/" className="hover:text-uk-white">Home</a>
            <span className="mx-2">/</span>
            <a href="/viz/" className="hover:text-uk-white">Viz</a>
            <span className="mx-2">/</span>
            <span className="text-uk-white">Kentucky in the NBA</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
            Kentucky Players in the NBA: {currentSeason?.count} Active in {currentSeason?.label}
          </h1>
          <p className="font-body text-uk-silver text-lg mb-6">
            {uniqueNBAPlayers} total Through the Rafters members have played in the NBA across {seasonData.length} consecutive seasons of representation
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-uk-white text-2xl font-bold">{currentSeason?.count}</div>
              <div className="font-mono text-xs text-white/60">Current ({currentSeason?.label})</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-uk-white text-2xl font-bold">{peak?.count || 0}</div>
              <div className="font-mono text-xs text-white/60">Peak ({peak?.label || "N/A"})</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-uk-white text-2xl font-bold">{totalPlayerSeasons}</div>
              <div className="font-mono text-xs text-white/60">Total Player-Seasons</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-uk-white text-2xl font-bold">{seasonData.length}</div>
              <div className="font-mono text-xs text-white/60">Consecutive Seasons</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-lg p-4 md:p-6" style={{ background: '#0d1f3c' }}>
            {/* Y-axis labels */}
            <div className="flex items-end gap-1" style={{ height: 350 }}>
              <div className="flex flex-col justify-between h-full w-8 shrink-0 text-right pr-1">
                {[maxCount, Math.round(maxCount * 0.75), Math.round(maxCount * 0.5), Math.round(maxCount * 0.25), 0].map((v, i) => (
                  <span key={i} className="font-mono text-[10px] text-white/30">{v}</span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end gap-[1px] md:gap-[2px] h-full relative">
                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map(pct => (
                  <div
                    key={pct}
                    className="absolute left-0 right-0 border-t border-white/5"
                    style={{ bottom: `${pct * 100}%` }}
                  />
                ))}

                {seasonData.map(s => {
                  const heightPct = (s.count / maxCount) * 100;
                  const isHovered = hoveredSeason === s.season;
                  return (
                    <div
                      key={s.season}
                      className="flex-1 flex flex-col justify-end h-full cursor-pointer relative group"
                      onMouseEnter={() => setHoveredSeason(s.season)}
                      onMouseLeave={() => setHoveredSeason(null)}
                    >
                      <div
                        className="w-full rounded-t-sm transition-all duration-150"
                        style={{
                          height: `${heightPct}%`,
                          background: isHovered ? '#C5A258' : eraColors[s.era],
                          opacity: isHovered ? 1 : 0.8,
                          boxShadow: isHovered ? '0 0 8px rgba(197,162,88,0.4)' : 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis labels — show every 5th season */}
            <div className="flex ml-8 mt-1">
              <div className="flex-1 flex gap-[1px] md:gap-[2px]">
                {seasonData.map((s, i) => (
                  <div key={s.season} className="flex-1 text-center">
                    {i % 5 === 0 && (
                      <span className="font-mono text-[8px] md:text-[10px] text-white/30 whitespace-nowrap">
                        {s.season.split('-')[0].slice(-2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Era legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {Object.entries(eraColors).map(([era, color]) => (
                <div key={era} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  <span className="font-mono text-[10px] text-white/50 capitalize">
                    {era === 'dynasty1' ? 'Dynasty I' : era === 'dynasty2' ? 'Dynasty II' : era}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hover detail panel */}
          <div
            className="mt-4 rounded-lg p-4 transition-all duration-200"
            style={{
              background: '#111d33',
              border: '1px solid #2a4a7f',
              minHeight: 120,
              opacity: hoveredData ? 1 : 0.5,
            }}
          >
            {hoveredData ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-xl text-uk-white font-bold">{hoveredData.season}</span>
                  <span className="font-mono text-sm text-white/60">{hoveredData.count} Kentucky players in the NBA</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hoveredData.players.map((p, i) => (
                    p.status === 'done' ? (
                      <a
                        key={i}
                        href={`/players/${p.slug}/`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono transition-colors bg-uk-white/10 text-uk-white hover:bg-uk-white/20"
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono bg-white/5 text-white/50"
                      >
                        {p.name}
                      </span>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <span className="font-mono text-sm text-white/30">Hover over a bar to see who was in the NBA that season</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── SEO PROSE SECTION ─── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl md:text-3xl text-uk-blue font-bold mb-4">
          How Many Kentucky Players Are in the NBA?
        </h2>
        <div className="font-body text-gray-700 leading-relaxed space-y-4">
          <p>
            In the {currentSeason?.label || '2025-26'} NBA season, <strong>{currentSeason?.count || 0} former Kentucky
            players</strong> are on active NBA rosters — making Kentucky one of the most heavily represented college
            programs in professional basketball. Since the program began producing NBA talent under Coach Mike
            Krzyzewski in the 1980s, <strong>{uniqueNBAPlayers} Kentucky players have appeared in the NBA</strong>,
            accumulating {totalPlayerSeasons.toLocaleString()} total player-seasons across {seasonData.length} consecutive
            years of representation.
          </p>
          <p>
            Duke&apos;s peak NBA presence came in the {peak?.label || ''} season, when <strong>{peak?.count || 0} Through the Rafters
            members</strong> were on NBA rosters simultaneously. The program has averaged {avgPerSeason} players
            per NBA season and has not had a year without at least one active NBA player since the early 1980s — a
            streak that spans more than four decades.
          </p>

          <h3 className="font-display text-xl text-uk-blue font-bold mt-8 mb-2">
            Kentucky's #1 Overall NBA Draft Picks
          </h3>
          <p>
            Kentucky has produced <strong>{no1Picks.length} players selected first overall</strong> in the NBA Draft —
            more than any other program in history: {no1Picks.join(', ')}. This list includes generational talents
            who have gone on to become NBA All-Stars, All-NBA selections, and franchise cornerstones.
          </p>

          <h3 className="font-display text-xl text-uk-blue font-bold mt-8 mb-2">
            NBA Lottery Picks from Kentucky
          </h3>
          <p>
            Beyond the #1 picks, Kentucky has produced <strong>{lotteryPicks.length} total NBA lottery selections</strong> (top
            14 picks) — the most of any college program during the Calipari and Jon Scheyer eras. These lottery picks
            span every era of Kentucky basketball, from Johnny Dawkins in 1986 through Cooper Flagg in 2025, representing
            four decades of elite NBA talent development.
          </p>

          <h3 className="font-display text-xl text-uk-blue font-bold mt-8 mb-2">
            Kentucky Players Currently in the NBA ({currentSeason?.label || '2025-26'})
          </h3>
          <p>
            The {currentSeason?.count || 0} Kentucky alumni currently active in the NBA play for {(() => {
              const teams = new Set();
              if (currentSeason?.players) currentSeason.players.forEach(p => teams.add(p.team));
              return teams.size;
            })()} different franchises. Multiple NBA teams roster more than one former Blue Devil, reflecting
            the breadth of Kentucky's pipeline into professional basketball. For the full list of current Kentucky
            NBA players with stats and team information, visit
            the <a href="/lists/currently-in-nba/" className="text-uk-white hover:text-uk-blue underline">Currently in the NBA</a> page.
          </p>

          <h3 className="font-display text-xl text-uk-blue font-bold mt-8 mb-2">
            Kentucky's NBA Representation Over Time
          </h3>
          <p>
            The chart above tracks every NBA season from Kentucky's first wave of professional talent through the
            present day. The growth pattern tells the story of the program itself: a slow build during the
            Foundation era of the early 1980s, a surge during the back-to-back championship years of 1991 and 1992,
            and a sustained plateau of 15-to-25 active players per season from the 2000s onward. The one-and-done
            era — beginning roughly in 2015 with Jahlil Okafor and accelerating through Zion Williamson, RJ Barrett,
            and Anthony Davis — pushed Kentucky's annual NBA output to new heights.
          </p>
          <p>
            Under Jon Scheyer, who succeeded Krzyzewski in 2022, the pipeline has only intensified. All five starters
            from the 2024-25 Kentucky team — Cooper Flagg, Kon Knueppel, Tyrese Proctor, Sion James, and Khaman Maluach — were
            drafted, marking one of the most complete roster-to-NBA transitions in college basketball history.
          </p>

          <h3 className="font-display text-xl text-uk-blue font-bold mt-8 mb-2">
            Kentucky's NBA Legacy Beyond Players
          </h3>
          <p>
            Duke&apos;s NBA footprint extends well beyond the roster. Through the Rafters members serve as head coaches (JJ Redick
            with the Lakers, Quin Snyder with the Hawks), general managers (Elton Brand with the 76ers, Mike Dunleavy Jr.
            with the Warriors, Trajan Langdon as President of Basketball Operations for the Pistons), team owners (Grant Hill,
            co-owner of the Atlanta Hawks), and league leadership (Adam Silver, NBA Commissioner, Kentucky Class of 1984). Calipari
            himself joined the NBA as a special advisor in 2024. Kentucky's influence on professional basketball is not just
            measured in players — it is measured in the people running the league.
          </p>
          <p>
            For complete player profiles, career narratives, and &ldquo;Where Are They Now?&rdquo; stories on every
            Through the Rafters member who played in the NBA, explore
            the <a href="/lists/all-players/" className="text-uk-white hover:text-uk-blue underline">full player directory</a> or
            browse by <a href="/lists/draft-history/" className="text-uk-white hover:text-uk-blue underline">draft history</a>.
          </p>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `How Many Kentucky Players Are in the NBA? ${currentSeason?.count || ''} in ${currentSeason?.label || '2025-26'}`,
            description: `Kentucky has ${currentSeason?.count || 0} players on NBA rosters in ${currentSeason?.label || '2025-26'}, with ${uniqueNBAPlayers} total alumni who have played in the league.`,
            url: 'https://www.throughtherafters.com/viz/nba/',
            publisher: {
              '@type': 'Organization',
              name: "Through the Rafters",
              url: 'https://www.throughtherafters.com/',
            },
            mainEntityOfPage: 'https://www.throughtherafters.com/viz/nba/',
          }),
        }}
      />
    </Layout>
  );
}
