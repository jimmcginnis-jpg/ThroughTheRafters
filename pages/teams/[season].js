// pages/teams/[season].js
// Individual season page with four tabs

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import LinkedText from '../../components/LinkedText';
import teams from '../../data/teams.json';
import playerData from '../../data/players.json';
import playerSeasonsData from '../../data/playerseasons.json';

const eraNames = {
  foundation: 'Foundation', dynasty1: 'First Dynasty', transition: 'Transition',
  dynasty2: 'Second Dynasty', between: 'In Between', resurgence: 'Resurgence',
  superteam: 'Superteam', scheyer: 'Scheyer Era',
};

const TABS = [
  { key: 'players', label: 'Players' },
  { key: 'season', label: 'Season' },
  { key: 'stats', label: 'Stats' },
  { key: 'gthc', label: 'GTHC' },
  { key: 'thegame', label: 'The Game' },
  { key: 'march', label: 'March' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============ TAB: PLAYERS ============
function PlayersTab({ roster, season }) {
  const profiled = roster.filter(p => p.status === 'done' || p.status === 'pledged');
  const stubs = roster.filter(p => p.status === 'stub');

  // Detect recruits (first season in their seasons array)
  const recruits = roster.filter(p => p.seasons && p.seasons[0] === season);
  const returning = roster.filter(p => p.seasons && p.seasons[0] !== season);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg text-center py-3" style={{ background: '#f5f5f0' }}>
          <div className="font-display text-duke-navy text-2xl font-bold">{roster.length}</div>
          <div className="font-mono text-xs text-gray-500">Total Roster</div>
        </div>
        <div className="rounded-lg text-center py-3" style={{ background: '#f5f5f0' }}>
          <div className="font-display text-duke-navy text-2xl font-bold">{profiled.length}</div>
          <div className="font-mono text-xs text-gray-500">Profiled</div>
        </div>
        <div className="rounded-lg text-center py-3" style={{ background: '#f5f5f0' }}>
          <div className="font-display text-duke-navy text-2xl font-bold">{recruits.length}</div>
          <div className="font-mono text-xs text-gray-500">New Arrivals</div>
        </div>
        <div className="rounded-lg text-center py-3" style={{ background: '#f5f5f0' }}>
          <div className="font-display text-duke-navy text-2xl font-bold">{returning.length}</div>
          <div className="font-mono text-xs text-gray-500">Returning</div>
        </div>
      </div>

      {/* Recruits */}
      {recruits.length > 0 && (
        <div className="mb-6">
          <h3 className="font-mono text-xs text-duke-gold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            New Arrivals
          </h3>
          <div className="space-y-2">
            {recruits.map(p => (
              <PlayerRow key={p.id} player={p} isNew />
            ))}
          </div>
        </div>
      )}

      {/* Returning */}
      {returning.length > 0 && (
        <div>
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-3">
            Returning Players
          </h3>
          <div className="space-y-2">
            {returning.map(p => (
              <PlayerRow key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerRow({ player, isNew }) {
  const p = player;
  const hasProfile = p.status === 'done' || p.status === 'pledged';
  const inner = (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
      hasProfile
        ? 'border-gray-200 bg-white hover:border-duke-gold hover:shadow-sm cursor-pointer'
        : 'border-gray-100 bg-gray-50 opacity-70'
    }`}>
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        hasProfile ? 'bg-duke-navy' : 'bg-gray-200'
      }`}>
        <span className={`font-mono text-xs font-bold ${
          hasProfile ? 'text-duke-gold' : 'text-gray-500'
        }`}>
          {p.jersey || '#'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-display font-semibold truncate ${
            hasProfile ? 'text-duke-navy' : 'text-gray-600'
          }`}>{p.name}</span>
          {isNew && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">New</span>}
          {hasProfile && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-duke-gold/10 text-duke-gold">Profile</span>}
        </div>
        <div className="font-mono text-xs text-gray-400">
          {p.pos} {p.height ? `\u2022 ${p.height}` : ''} {p.hometown ? `\u2022 ${p.hometown}` : ''}
        </div>
      </div>
      {hasProfile && (
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </div>
  );

  return hasProfile
    ? <Link href={`/players/${p.slug}/`}>{inner}</Link>
    : inner;
}

// ============ TAB: SEASON ============
function SeasonTab({ team }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Record" value={team.record} />
        <StatCard label="ACC" value={team.accRecord} />
        <StatCard label="Preseason" value={team.ranking.preseason ? `#${team.ranking.preseason}` : 'NR'} />
        <StatCard label="Final" value={team.ranking.final ? `#${team.ranking.final}` : 'NR'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">ACC Tournament</div>
          <div className="font-display text-lg text-duke-navy font-bold">{team.accTournament}</div>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">NCAA Tournament</div>
          <div className="font-display text-lg text-duke-navy font-bold">{team.ncaaTournament}</div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h3 className="font-display text-xl text-duke-navy font-bold mb-3">Season Overview</h3>
        {team.overview.split('\n').map((para, i) => (
          <p key={i} className="font-body text-gray-700 leading-relaxed mb-4">
            <LinkedText text={para} />
          </p>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg text-center py-4 border border-gray-200 bg-white">
      <div className="font-display text-duke-navy text-2xl font-bold">{value}</div>
      <div className="font-mono text-xs text-gray-500">{label}</div>
    </div>
  );
}

// ============ TAB: STATS ============
const STAT_VIEWS = {
  avg: {
    label: 'Per Game',
    cols: ['Player','Cl','GP','GS','MPG','PTS','REB','AST','STL','BLK','TO','FG%','3P%','FT%'],
    keys: ['name','class','gp','gs','mpg','pts','reb','ast','stl','blk','to','fgPct','tpPct','ftPct'],
  },
  totals: {
    label: 'Totals',
    cols: ['Player','Cl','GP','PTS','REB','AST','STL','BLK','FGM','FGA','3PM','3PA','FTM','FTA'],
    keys: ['name','class','gp','totalPts','totalReb','totalAst','totalStl','totalBlk','fgm','fga','tpm','tpa','ftm','fta'],
  },
  shooting: {
    label: 'Shooting',
    cols: ['Player','Cl','GP','FGM','FGA','FG%','3PM','3PA','3P%','FTM','FTA','FT%'],
    keys: ['name','class','gp','fgm','fga','fgPct','tpm','tpa','tpPct','ftm','fta','ftPct'],
  },
};

function PlayerStatsTable({ playerSeasons, roster, teamTotals, opponentTotals }) {
  const [view, setView] = useState('avg');
  const [sortKey, setSortKey] = useState('pts');
  const [sortDir, setSortDir] = useState(-1);

  // Merge player names/positions into the stats
  const playerMap = {};
  roster.forEach(p => { playerMap[p.id] = p; });

  const rows = playerSeasons.map(ps => {
    const p = playerMap[ps.playerId] || {};
    return { ...ps, name: p.name || ps.playerId, pos: p.pos || '', slug: p.slug, status: p.status };
  });

  // Build footer row data from totals
  function buildTotalsRow(totals, label) {
    if (!totals || !totals.gp) return null;
    const gp = totals.gp;
    const safeAvg = (v) => (v && gp) ? Math.round(10 * v / gp) / 10 : 0;
    return {
      name: label, class: '', gp: gp, gs: '',
      mpg: '', pts: totals.ppg || safeAvg(totals.pts),
      reb: safeAvg(totals.reb), ast: safeAvg(totals.ast),
      stl: safeAvg(totals.stl), blk: safeAvg(totals.blk),
      to: safeAvg(totals.to),
      fgPct: totals.fgPct || 0, tpPct: totals.tpPct || 0, ftPct: totals.ftPct || 0,
      totalPts: totals.pts || 0, totalReb: totals.reb || 0,
      totalAst: totals.ast || 0, totalStl: totals.stl || 0,
      totalBlk: totals.blk || 0,
      fgm: totals.fgm || 0, fga: totals.fga || 0,
      tpm: totals.tpm || 0, tpa: totals.tpa || 0,
      ftm: totals.ftm || 0, fta: totals.fta || 0,
      _isFooter: true,
    };
  }

  const teamRow = buildTotalsRow(teamTotals, 'Team Totals');
  const oppRow = buildTotalsRow(opponentTotals, 'Opponents');

  // Sort
  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    if (typeof av === 'string') return sortDir * av.localeCompare(bv);
    return sortDir * (av - bv);
  });

  // Find leaders (max value among players with 10+ games)
  const vDef = STAT_VIEWS[view];
  const maxes = {};
  vDef.keys.forEach(k => {
    if (k === 'name' || k === 'class') return;
    const vals = rows.filter(r => r.gp >= 10).map(r => r[k] || 0);
    if (vals.length > 0) maxes[k] = Math.max(...vals);
  });

  function handleSort(key) {
    if (key === 'name' || key === 'class') return;
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  }

  function handleViewChange(v) {
    setView(v);
    if (v === 'avg') setSortKey('pts');
    else if (v === 'totals') setSortKey('totalPts');
    else setSortKey('fgPct');
    setSortDir(-1);
  }

  function fmt(val, key) {
    if (val == null) return '—';
    if (key.includes('Pct')) return val.toFixed(1);
    if (typeof val === 'number' && !Number.isInteger(val)) return val.toFixed(1);
    return val;
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        {Object.entries(STAT_VIEWS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => handleViewChange(k)}
            className={`px-3 py-1.5 font-mono text-xs tracking-wider rounded-md border transition-all ${
              view === k
                ? 'bg-duke-navy text-white border-duke-navy'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr>
              {vDef.cols.map((col, i) => {
                const key = vDef.keys[i];
                const isSorted = sortKey === key;
                const clickable = key !== 'name' && key !== 'class';
                return (
                  <th
                    key={col}
                    onClick={() => clickable && handleSort(key)}
                    className={`py-2 px-1.5 font-mono text-[10px] uppercase tracking-wider border-b border-gray-200 ${
                      i === 0 ? 'text-left pl-3' : 'text-right'
                    } ${clickable ? 'cursor-pointer hover:text-duke-navy' : ''} ${
                      isSorted ? 'text-duke-navy' : 'text-gray-400'
                    }`}
                    style={{ background: '#f9f9f6' }}
                  >
                    {col}{isSorted ? ' ▾' : ''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, ri) => (
              <tr key={row.playerId} className="hover:bg-gray-50 transition-colors">
                {vDef.keys.map((key, ci) => {
                  if (key === 'name') {
                    const nameContent = row.status === 'done' || row.status === 'pledged' ? (
                      <Link href={`/players/${row.slug}/`} className="text-duke-navy hover:text-duke-gold transition-colors">
                        {row.name}
                      </Link>
                    ) : (
                      <span>{row.name}</span>
                    );
                    return (
                      <td key={key} className={`py-2 pl-3 pr-1.5 font-display text-xs font-semibold border-b border-gray-100 ${
                        row.gs >= 20 ? 'border-l-2 border-l-duke-gold' : ''
                      }`}>
                        {nameContent}
                        <span className="font-mono text-[10px] text-gray-400 ml-1.5">{row.pos}</span>
                      </td>
                    );
                  }
                  const val = row[key];
                  const isLeader = maxes[key] != null && val === maxes[key] && row.gp >= 10 && val > 0;
                  return (
                    <td
                      key={key}
                      className={`py-2 px-1.5 text-right font-mono border-b border-gray-100 ${
                        isLeader ? 'text-duke-navy font-bold' : 'text-gray-700'
                      }`}
                    >
                      {fmt(val, key)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {(teamRow || oppRow) && (
            <tfoot>
              {[teamRow, oppRow].filter(Boolean).map(row => {
                // Skip opponent row if it has no meaningful data (ppg=0 and pts=0)
                if (row.name === 'Opponents' && !row.pts && !row.totalPts) return null;
                return (
                  <tr key={row.name} className={row.name === 'Team Totals' ? 'bg-duke-navy/5 font-semibold' : 'bg-gray-100/80'}>
                    {vDef.keys.map((key, ci) => {
                      if (key === 'name') {
                        return (
                          <td key={key} className="py-2 pl-3 pr-1.5 font-mono text-xs font-bold text-duke-navy border-t-2 border-duke-gold/40">
                            {row.name}
                          </td>
                        );
                      }
                      const val = row[key];
                      const display = (val === '' || val == null) ? '' : (typeof val === 'number' && !Number.isInteger(val)) ? val.toFixed(1) : (key.includes('Pct') && typeof val === 'number') ? val.toFixed(1) : val;
                      return (
                        <td key={key} className="py-2 px-1.5 text-right font-mono text-xs text-gray-700 border-t-2 border-duke-gold/40">
                          {display || '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tfoot>
          )}
        </table>
      </div>
      <div className="mt-2 font-mono text-[10px] text-gray-400">
        Gold border = starter (20+ games started) · Bold = team leader (10+ GP) · Click column to sort
      </div>
    </div>
  );
}

function StatsTab({ stats, roster, playerSeasons, teamTotals, opponentTotals }) {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-xl text-gray-400">Stats for this season coming soon</p>
        <p className="font-mono text-xs text-gray-400 mt-2">We're building stats for every season 1980–81 through 2024–25</p>
      </div>
    );
  }

  const { team, leaders: staticLeaders } = stats;
  const margin = (team.ppg - team.oppPpg).toFixed(1);
  const marginSign = margin > 0 ? '+' : '';

  const categories = ['PTS', 'REB', 'AST', 'BLK'];
  const catLabels = { PTS: 'Scoring', REB: 'Rebounding', AST: 'Assists', BLK: 'Blocks' };
  const catFields = { PTS: 'ppg', REB: 'rpg', AST: 'apg', BLK: 'bpg' };
  const catUnits = { PTS: 'ppg', REB: 'rpg', AST: 'apg', BLK: 'bpg' };

  // Try to resolve player slugs for linking
  const playerMap = {};
  roster.forEach(p => { playerMap[p.id] = p; });

  // Derive leaders from playerSeasons when available; fall back to static leaders
  const grouped = {};
  if (playerSeasons && playerSeasons.length > 0) {
    const psWithNames = playerSeasons.map(ps => {
      const p = playerMap[ps.playerId] || {};
      return { ...ps, name: p.name || ps.playerId };
    });
    // Scoring: sort by pts desc, take top 5
    grouped['PTS'] = [...psWithNames].filter(p => p.gp >= 5)
      .sort((a, b) => b.pts - a.pts).slice(0, 5)
      .map(p => ({ name: p.name, playerId: p.playerId, category: 'PTS', ppg: p.pts, total: p.totalPts }));
    // Rebounding: sort by reb desc
    grouped['REB'] = [...psWithNames].filter(p => p.gp >= 5)
      .sort((a, b) => b.reb - a.reb).slice(0, 5)
      .map(p => ({ name: p.name, playerId: p.playerId, category: 'REB', rpg: p.reb, total: p.totalReb }));
    // Assists: sort by ast desc
    grouped['AST'] = [...psWithNames].filter(p => p.gp >= 5)
      .sort((a, b) => b.ast - a.ast).slice(0, 5)
      .map(p => ({ name: p.name, playerId: p.playerId, category: 'AST', apg: p.ast, total: p.totalAst }));
    // Blocks: sort by blk desc
    grouped['BLK'] = [...psWithNames].filter(p => p.gp >= 5)
      .sort((a, b) => b.blk - a.blk).slice(0, 5)
      .map(p => ({ name: p.name, playerId: p.playerId, category: 'BLK', bpg: p.blk, total: p.totalBlk }));
  } else {
    categories.forEach(cat => {
      grouped[cat] = (staticLeaders || [])
        .filter(l => l.category === cat)
        .slice(0, 5);
    });
  }

  return (
    <div>
      {/* Team averages */}
      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-3">Team Averages</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.ppg}</div>
          <div className="font-mono text-[10px] text-gray-400">PPG</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-gray-500 text-xl font-bold">{team.oppPpg}</div>
          <div className="font-mono text-[10px] text-gray-400">Opp PPG</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className={`font-display text-xl font-bold ${parseFloat(margin) > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {marginSign}{margin}
          </div>
          <div className="font-mono text-[10px] text-gray-400">Margin</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.rpg}</div>
          <div className="font-mono text-[10px] text-gray-400">RPG</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.apg}</div>
          <div className="font-mono text-[10px] text-gray-400">APG</div>
        </div>
      </div>

      {/* Shooting + defense row */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-8">
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.fgPct}%</div>
          <div className="font-mono text-[10px] text-gray-400">FG%</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.threePct ? `${team.threePct}%` : '—'}</div>
          <div className="font-mono text-[10px] text-gray-400">3PT%</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.ftPct}%</div>
          <div className="font-mono text-[10px] text-gray-400">FT%</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.spg}</div>
          <div className="font-mono text-[10px] text-gray-400">SPG</div>
        </div>
        <div className="rounded-lg text-center py-3 border border-gray-200 bg-white">
          <div className="font-display text-duke-navy text-xl font-bold">{team.bpg}</div>
          <div className="font-mono text-[10px] text-gray-400">BPG</div>
        </div>
      </div>

      {/* Individual leaders by category */}
      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Individual Leaders</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const rows = grouped[cat];
          if (!rows || rows.length === 0) return null;
          const field = catFields[cat];
          const unit = catUnits[cat];

          return (
            <div key={cat} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold" style={{ background: '#001A57', color: '#C5A258' }}>
                {catLabels[cat]}
              </div>
              <div className="divide-y divide-gray-100">
                {rows.map((row, i) => {
                  const player = playerMap[row.playerId];
                  const nameEl = player && player.slug && (player.status === 'done' || player.status === 'pledged') ? (
                    <Link href={`/players/${player.slug}/`} className="text-duke-navy hover:text-duke-gold transition-colors">
                      {row.name}
                    </Link>
                  ) : (
                    <span className="text-gray-700">{row.name}</span>
                  );

                  return (
                    <div key={`${cat}-${i}`} className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-300 w-4">{i + 1}</span>
                        <span className="font-display text-sm font-semibold">{nameEl}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-duke-navy">
                          {row[field]} <span className="text-gray-400 text-xs">{unit}</span>
                        </span>
                        {row.total != null && (
                          <span className="font-mono text-xs text-gray-400 w-12 text-right">
                            {row.total}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Stats Table */}
      {playerSeasons && playerSeasons.length > 0 && (
        <div className="mt-8">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Player Stats</h3>
          <PlayerStatsTable playerSeasons={playerSeasons} roster={roster} teamTotals={teamTotals} opponentTotals={opponentTotals} />
        </div>
      )}
    </div>
  );
}

// ============ TAB: GTHC ============
function GthcTab({ games }) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-xl text-gray-400">UNC game data coming soon</p>
      </div>
    );
  }

  const wins = games.filter(g => g.result === 'W').length;
  const losses = games.filter(g => g.result === 'L').length;

  return (
    <div>
      <div className="flex items-center gap-6 mb-8 p-4 rounded-lg" style={{ background: '#001A57' }}>
        <div className="text-center">
          <div className="font-display text-3xl text-duke-gold font-bold">{wins}-{losses}</div>
          <div className="font-mono text-xs text-duke-goldLight">vs UNC</div>
        </div>
        <div className="font-display text-2xl text-white font-bold tracking-wider">
          GTHC
        </div>
      </div>

      <div className="space-y-4">
        {games.map((game, i) => (
          <div
            key={i}
            className={`p-5 rounded-lg border-l-4 ${
              game.result === 'W' ? 'border-l-green-500 bg-green-50' : 'border-l-red-400 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm font-bold ${
                  game.result === 'W' ? 'text-green-700' : 'text-red-600'
                }`}>
                  {game.result === 'W' ? 'W' : 'L'} {game.score}
                </span>
                {game.dukeRank && (
                  <span className="font-mono text-xs text-gray-500">#{game.dukeRank} Duke</span>
                )}
                {game.uncRank && (
                  <span className="font-mono text-xs text-gray-500">vs #{game.uncRank} UNC</span>
                )}
              </div>
              <span className="font-mono text-xs text-gray-400">{formatDate(game.date)}</span>
            </div>
            <div className="font-mono text-xs text-gray-500 mb-2">{game.location}</div>
            {game.story && (
              <p className="font-body text-sm text-gray-700 leading-relaxed">
                <LinkedText text={game.story} />
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ TAB: THE GAME ============
function TheGameTab({ game }) {
  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-xl text-gray-400">The Game — coming soon</p>
      </div>
    );
  }

  const isWin = game.result === 'W';

  return (
    <div>
      {/* Hero card */}
      <div
        className="rounded-lg overflow-hidden mb-8"
        style={{ background: isWin ? '#001A57' : '#2d1a1a' }}
      >
        <div className="p-6 md:p-8">
          <div className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: isWin ? '#C5A258' : '#cc8888' }}>
            {formatDate(game.date)} &bull; {game.location}
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
            {game.title}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <span className={`font-mono text-xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
              Duke {game.score}
            </span>
            <span className="font-mono text-sm text-white/50">
              vs {game.opponent}
            </span>
            {game.dukeRank && (
              <span className="font-mono text-xs text-white/40">#{game.dukeRank} Duke</span>
            )}
            {game.opponentRank && (
              <span className="font-mono text-xs text-white/40">#{game.opponentRank} {game.opponent}</span>
            )}
          </div>
          {game.headline && (
            <p className="font-body text-lg italic" style={{ color: isWin ? '#C5A258' : '#cc8888' }}>
              {game.headline}
            </p>
          )}
        </div>
      </div>

      {/* The story */}
      <div className="prose max-w-none">
        {game.story.split('\n').map((para, i) => (
          <p key={i} className="font-body text-gray-700 leading-relaxed mb-4">
            <LinkedText text={para} />
          </p>
        ))}
      </div>

      {/* Key performances */}
      {game.performances && game.performances.length > 0 && (
        <div className="mt-8">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Key Performances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {game.performances.map((perf, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="font-display text-duke-navy font-semibold">{perf.player}</div>
                <div className="font-mono text-sm text-duke-gold">{perf.line}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why this game */}
      {game.significance && (
        <div className="mt-8 p-5 rounded-lg border-l-4 border-l-duke-gold bg-amber-50">
          <h3 className="font-mono text-xs text-duke-gold uppercase tracking-wider mb-2">Why This Game Matters</h3>
          <p className="font-body text-gray-700 leading-relaxed">
            <LinkedText text={game.significance} />
          </p>
        </div>
      )}
    </div>
  );
}

// ============ TAB: MARCH ============
function MarchTab({ march, accTournament, ncaaTournament }) {
  if (!march) {
    return (
      <div className="text-center py-12">
        <p className="font-display text-xl text-gray-400">March data coming soon</p>
      </div>
    );
  }

  return (
    <div>
      {/* ACC Tournament */}
      {march.accTourney && march.accTourney.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-xl text-duke-navy font-bold">ACC Tournament</h3>
            <span className="font-mono text-xs px-2 py-1 rounded-full bg-duke-navy text-white">{accTournament}</span>
          </div>
          <div className="space-y-3">
            {march.accTourney.map((game, i) => (
              <GameCard key={i} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* NCAA Tournament */}
      {march.ncaaTourney && march.ncaaTourney.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-xl text-duke-navy font-bold">NCAA Tournament</h3>
            <span className={`font-mono text-xs px-2 py-1 rounded-full ${
              ncaaTournament.includes('Champions') ? 'bg-yellow-500 text-duke-navyDark' : 'bg-duke-navy text-white'
            }`}>{ncaaTournament}</span>
          </div>
          <div className="relative">
            {/* Bracket line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-3">
              {march.ncaaTourney.map((game, i) => (
                <GameCard key={i} game={game} isBracket />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NIT */}
      {march.nit && march.nit.length > 0 && (
        <div className={march.ncaaTourney && march.ncaaTourney.length > 0 ? 'mt-10' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-xl text-duke-navy font-bold">NIT</h3>
            <span className="font-mono text-xs px-2 py-1 rounded-full bg-gray-600 text-white">{ncaaTournament}</span>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-3">
              {march.nit.map((game, i) => (
                <GameCard key={i} game={game} isBracket />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GameCard({ game, isBracket }) {
  const isWin = game.result === 'W';
  return (
    <div className={`${isBracket ? 'ml-8' : ''} p-4 rounded-lg border transition-all ${
      isWin ? 'border-green-200 bg-white' : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-gray-500 w-20">{game.round}</span>
          <span className={`font-mono text-sm font-bold ${isWin ? 'text-green-700' : 'text-red-600'}`}>
            {game.result} {game.score}
          </span>
          <span className="font-display text-sm text-duke-navy">
            vs {game.seed ? `(${game.seed}) ` : ''}{game.opponent}
          </span>
        </div>
        {game.date && <span className="font-mono text-xs text-gray-400 hidden md:block">{formatDate(game.date)}</span>}
      </div>
      {game.story && (
        <p className="font-body text-sm text-gray-600 leading-relaxed mt-2 ml-20">
          <LinkedText text={game.story} />
        </p>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
export default function SeasonPage({ team, roster }) {
  const [activeTab, setActiveTab] = useState('players');

  if (!team) {
    return (
      <Layout title="Season Not Found" canonical="/teams/">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-duke-navy font-bold mb-4">Season Not Found</h1>
          <Link href="/teams/" className="text-duke-gold hover:underline">Browse all seasons</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${team.season} Duke Blue Devils`}
      description={team.tagline}
      canonical={`/teams/${team.season}/`}
    >
      {/* Hero */}
      <section className="bg-duke-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="font-mono text-xs text-duke-goldLight mb-6 tracking-wider">
            <Link href="/" className="hover:text-duke-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/teams/" className="hover:text-duke-gold">Teams</Link>
            <span className="mx-2">/</span>
            <span className="text-duke-gold">{team.season}</span>
          </nav>

          <div className="flex items-end gap-6 mb-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">{team.season}</h1>
            <div className="font-display text-2xl text-duke-gold font-bold">{team.record}</div>
          </div>
          <p className="font-body text-duke-goldLight text-lg italic">{team.tagline}</p>
          <div className="font-mono text-xs text-duke-goldLight mt-2">
            Coach: {team.coach} &bull; {eraNames[team.era]} &bull; {team.ncaaTournament}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 font-mono text-sm tracking-wider transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-duke-gold text-duke-navy font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'players' && <PlayersTab roster={roster} season={team.season} />}
        {activeTab === 'season' && <SeasonTab team={team} />}
        {activeTab === 'stats' && <StatsTab stats={team.stats} roster={roster} playerSeasons={team.playerSeasons} teamTotals={team.teamTotals} opponentTotals={team.opponentTotals} />}
        {activeTab === 'gthc' && <GthcTab games={team.unc} />}
        {activeTab === 'thegame' && <TheGameTab game={team.theGame} />}
        {activeTab === 'march' && <MarchTab march={team.march} accTournament={team.accTournament} ncaaTournament={team.ncaaTournament} />}
      </section>

      {/* Sources */}
      {team.sources && team.sources.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <details className="group">
            <summary className="font-mono text-xs text-gray-400 uppercase tracking-wider cursor-pointer hover:text-duke-gold transition-colors">
              Sources ({team.sources.length})
            </summary>
            <ul className="mt-3 space-y-1">
              {team.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-duke-gold hover:text-duke-navy transition-colors"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      {/* Prev / Next navigation */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="flex justify-between border-t border-gray-200 pt-6">
          {team.prevSeason ? (
            <Link href={`/teams/${team.prevSeason}/`} className="font-mono text-sm text-duke-gold hover:underline">
              &larr; {team.prevSeason}
            </Link>
          ) : <div />}
          {team.nextSeason ? (
            <Link href={`/teams/${team.nextSeason}/`} className="font-mono text-sm text-duke-gold hover:underline">
              {team.nextSeason} &rarr;
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
            '@type': 'SportsTeam',
            name: `${team.season} Duke Blue Devils Men\u2019s Basketball`,
            sport: 'Basketball',
            coach: { '@type': 'Person', name: team.coach },
            memberOf: { '@type': 'SportsOrganization', name: 'Atlantic Coast Conference' },
            url: `https://www.dukebrotherhood.com/teams/${team.season}/`,
            description: team.tagline,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dukebrotherhood.com/' },
              { '@type': 'ListItem', position: 2, name: 'Teams', item: 'https://www.dukebrotherhood.com/teams/' },
              { '@type': 'ListItem', position: 3, name: team.season, item: `https://www.dukebrotherhood.com/teams/${team.season}/` },
            ],
          }),
        }}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = teams.seasons.map(s => ({
    params: { season: s.season },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const idx = teams.seasons.findIndex(s => s.season === params.season);
  const team = teams.seasons[idx];
  if (!team) return { notFound: true };

  // Add prev/next links
  const allSeasons = teams.seasons.map(s => s.season).sort();
  const curIdx = allSeasons.indexOf(params.season);
  team.prevSeason = curIdx > 0 ? allSeasons[curIdx - 1] : null;
  team.nextSeason = curIdx < allSeasons.length - 1 ? allSeasons[curIdx + 1] : null;

  // Attach player-level season stats if available
  const psData = playerSeasonsData[params.season] || null;
  team.playerSeasons = psData ? (psData.players || psData) : null;
  team.teamTotals = psData?.teamTotals || null;
  team.opponentTotals = psData?.opponentTotals || null;

  // Build roster from players.json
  const roster = playerData.players
    .filter(p => p.seasons && p.seasons.includes(params.season))
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      status: p.status,
      pos: p.pos || '',
      height: p.height || '',
      jersey: p.jersey || '',
      hometown: p.hometown || '',
      seasons: p.seasons || [],
    }))
    .sort((a, b) => {
      // Profiled first (done and pledged), then by name
      const aHas = a.status === 'done' || a.status === 'pledged';
      const bHas = b.status === 'done' || b.status === 'pledged';
      if (aHas !== bHas) return aHas ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  return { props: { team, roster } };
}
