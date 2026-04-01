import config from '../../school.config';
// pages/viz/nba-teams.js
// Kentucky Players by NBA Team — all-time and current roster

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

// Merge historical/relocated franchises
const FRANCHISE_MAP = {
  'Vancouver Grizzlies': 'Memphis Grizzlies',
  'New Jersey Nets': 'Brooklyn Nets',
  'Seattle SuperSonics': 'Oklahoma City Thunder',
  'Washington Bullets': 'Washington Wizards',
  'Charlotte Bobcats': 'Charlotte Hornets',
  'Charlotte Bobcats/Hornets': 'Charlotte Hornets',
  'New Orleans Hornets': 'New Orleans Pelicans',
  'New Orleans Hornets/Pelicans': 'New Orleans Pelicans',
  'San Diego Clippers': 'Los Angeles Clippers',
  'New Orleans/Oklahoma City Hornets': 'New Orleans Pelicans',
};

// NBA team colors (approximate primary)
const TEAM_COLORS = {
  'Atlanta Hawks': '#E03A3E',
  'Boston Celtics': '#007A33',
  'Brooklyn Nets': '#000000',
  'Charlotte Hornets': '#1D1160',
  'Chicago Bulls': '#CE1141',
  'Cleveland Cavaliers': '#860038',
  'Dallas Mavericks': '#00538C',
  'Denver Nuggets': '#0E2240',
  'Detroit Pistons': '#C8102E',
  'Golden State Warriors': '#1D428A',
  'Houston Rockets': '#CE1141',
  'Indiana Pacers': '#002D62',
  'Los Angeles Clippers': '#C8102E',
  'Los Angeles Lakers': '#552583',
  'Memphis Grizzlies': '#5D76A9',
  'Miami Heat': '#98002E',
  'Milwaukee Bucks': '#00471B',
  'Minnesota Timberwolves': '#0C2340',
  'New Orleans Pelicans': '#0C2340',
  'New York Knicks': '#006BB6',
  'Oklahoma City Thunder': '#007AC1',
  'Orlando Magic': '#0077C0',
  'Philadelphia 76ers': '#006BB6',
  'Phoenix Suns': '#1D1160',
  'Portland Trail Blazers': '#E03A3E',
  'Sacramento Kings': '#5A2D81',
  'San Antonio Spurs': '#C4CED4',
  'Toronto Raptors': '#CE1141',
  'Utah Jazz': '#002B5C',
  'Washington Wizards': '#002B5C',
};

export default function NBATeamsViz() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sortBy, setSortBy] = useState('allTime'); // 'allTime' | 'current' | 'name'

  const teamData = useMemo(() => {
    const teams = {};

    data.players.forEach(p => {
      if (!p.nba || !p.nba.teams || !Array.isArray(p.nba.teams)) return;
      p.nba.teams.forEach(t => {
        if (!t.team) return;
        const franchise = FRANCHISE_MAP[t.team] || t.team;
        if (!teams[franchise]) teams[franchise] = { allTime: new Map(), current: new Map() };

        // All-time (deduplicate by player name)
        if (!teams[franchise].allTime.has(p.name)) {
          const seasons = t.seasons || [];
          teams[franchise].allTime.set(p.name, {
            name: p.name,
            slug: p.slug,
            status: p.status,
            seasons: seasons.join(', '),
            firstSeason: seasons[0] || '',
          });
        }

        // Current (2025-26 only — not prior seasons)
        if (t.seasons && t.seasons.includes('2025-26')) {
          if (!teams[franchise].current.has(p.name)) {
            teams[franchise].current.set(p.name, {
              name: p.name,
              slug: p.slug,
              status: p.status,
            });
          }
        }
      });
    });

    return Object.entries(teams).map(([team, d]) => ({
      team,
      allTime: Array.from(d.allTime.values()).sort((a, b) => a.firstSeason.localeCompare(b.firstSeason)),
      current: Array.from(d.current.values()),
      color: TEAM_COLORS[team] || '#555',
    }));
  }, []);

  const sorted = useMemo(() => {
    const copy = [...teamData];
    if (sortBy === 'allTime') copy.sort((a, b) => b.allTime.length - a.allTime.length);
    else if (sortBy === 'current') copy.sort((a, b) => b.current.length - a.current.length || b.allTime.length - a.allTime.length);
    else copy.sort((a, b) => a.team.localeCompare(b.team));
    return copy;
  }, [teamData, sortBy]);

  const maxAllTime = Math.max(...teamData.map(t => t.allTime.length));
  const totalCurrent = teamData.reduce((sum, t) => sum + t.current.length, 0);
  const teamsWithCurrent = teamData.filter(t => t.current.length > 0).length;
  const selected = selectedTeam ? sorted.find(t => t.team === selectedTeam) : null;

  return (
    <Layout
      title="Kentucky Players by NBA Team"
      description="Every NBA team's Kentucky connection — all-time roster and current players."
      canonical="/viz/nba-teams/"
    >
      <div className="bg-school-dark py-12">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="font-mono text-xs text-school-accentLight mb-6 tracking-wider">
            <a href="/" className="hover:text-school-accent">Home</a>
            <span className="mx-2">/</span>
            <a href="/viz/" className="hover:text-school-accent">Viz</a>
            <span className="mx-2">/</span>
            <span className="text-school-accent">Kentucky by NBA Team</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
            Kentucky Players by NBA Team
          </h1>
          <p className="font-body text-school-accentLight text-lg mb-6">
            The Through the Rafters&rsquo;s footprint across the league
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-school-accent text-2xl font-bold">{sorted.length}</div>
              <div className="font-mono text-xs text-white/60">NBA Franchises</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-school-accent text-2xl font-bold">{totalCurrent}</div>
              <div className="font-mono text-xs text-white/60">Active Now</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-school-accent text-2xl font-bold">{teamsWithCurrent}</div>
              <div className="font-mono text-xs text-white/60">Teams w/ Kentucky Player</div>
            </div>
            <div className="rounded-lg text-center py-3" style={{ background: '#111d33' }}>
              <div className="font-display text-school-accent text-2xl font-bold">{maxAllTime}</div>
              <div className="font-mono text-xs text-white/60">Most All-Time (1 team)</div>
            </div>
          </div>

          {/* Sort controls */}
          <div className="flex gap-2 mb-6">
            <span className="font-mono text-xs text-white/40 self-center mr-2">Sort by:</span>
            {[
              { key: 'allTime', label: 'All-Time Count' },
              { key: 'current', label: 'Current Roster' },
              { key: 'name', label: 'Team Name' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1 font-mono text-xs rounded-full transition-colors ${
                  sortBy === opt.key ? 'bg-school-primary text-white' : 'bg-white/10 text-school-accentLight hover:bg-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sorted.map(t => {
              const isSelected = selectedTeam === t.team;
              const barWidth = (t.allTime.length / maxAllTime) * 100;
              const currentWidth = (t.current.length / maxAllTime) * 100;

              return (
                <div
                  key={t.team}
                  className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-school-accent' : ''
                  }`}
                  style={{ background: '#111d33', border: '1px solid ' + (isSelected ? '#C5A258' : '#1e3a5f') }}
                  onClick={() => setSelectedTeam(isSelected ? null : t.team)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                        <span className="font-display text-white text-sm font-semibold">{t.team}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {t.current.length > 0 && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400">
                            {t.current.length} now
                          </span>
                        )}
                        <span className="font-mono text-xs text-school-accent font-bold">{t.allTime.length}</span>
                      </div>
                    </div>

                    {/* Stacked bar */}
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: '#0d1f3c' }}>
                      <div className="h-full flex">
                        {t.current.length > 0 && (
                          <div
                            className="h-full"
                            style={{ width: `${currentWidth}%`, background: '#22c55e' }}
                          />
                        )}
                        <div
                          className="h-full"
                          style={{ width: `${barWidth - currentWidth}%`, background: t.color, opacity: 0.6 }}
                        />
                      </div>
                    </div>

                    {/* Current players inline */}
                    {t.current.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.current.map(p => (
                          <span key={p.name} className="font-mono text-[10px] text-green-400/80">{p.name}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="px-4 pb-4 border-t border-white/10">
                      <h4 className="font-mono text-xs text-school-accent uppercase tracking-wider mt-3 mb-2">
                        All-Time Kentucky Players ({t.allTime.length})
                      </h4>
                      <div className="space-y-1">
                        {t.allTime.map(p => {
                          const isCurrent = t.current.find(c => c.name === p.name);
                          return p.status === 'done' ? (
                            <Link
                              key={p.name}
                              href={`/players/${p.slug}/`}
                              className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              <span className="font-body text-sm text-school-accent">{p.name}</span>
                              <div className="flex items-center gap-2">
                                {isCurrent && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-green-900/50 text-green-400">Active</span>}
                                <span className="font-mono text-[10px] text-white/30">{p.seasons}</span>
                              </div>
                            </Link>
                          ) : (
                            <div key={p.name} className="flex items-center justify-between py-1 px-2">
                              <span className="font-body text-sm text-white/50">{p.name}</span>
                              <div className="flex items-center gap-2">
                                {isCurrent && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-green-900/50 text-green-400">Active</span>}
                                <span className="font-mono text-[10px] text-white/30">{p.seasons}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm" style={{ background: '#22c55e' }} />
              <span className="font-mono text-xs text-school-accentLight">Current roster</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm" style={{ background: '#555', opacity: 0.6 }} />
              <span className="font-mono text-xs text-white/50">Historical</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
