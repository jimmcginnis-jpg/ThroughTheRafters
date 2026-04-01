import config from '../../school.config';
// pages/viz/compare.js
// Freshman comparison: Kentucky freshmen

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import playerSeasonsData from '../../data/playerseasons.json';
import playerData from '../../data/players.json';

const NAVY = '#001A57';
const GOLD = '#C4A23E';
const NAVY_20 = 'rgba(0,26,87,0.12)';
const GOLD_20 = 'rgba(196,162,62,0.12)';

function getPlayer(id) {
  return playerData.players.find(p => p.id === id) || {};
}

function getStats(id, season) {
  const seasonData = playerSeasonsData[season] || {};
  const records = seasonData.players || [];
  if (!Array.isArray(records)) return null;
  return records.find(r => r.playerId === id) || null;
}

function StatCard({ label, val1, val2, unit }) {
  const v1 = parseFloat(val1);
  const v2 = parseFloat(val2);
  const leader1 = v1 > v2;
  const leader2 = v2 > v1;
  const tied = v1 === v2;
  return (
    <div className="rounded-lg py-3 px-2 text-center" style={{ background: 'rgba(0,0,0,0.03)' }}>
      <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex justify-center items-end gap-4">
        <div>
          <div className={`font-display text-xl font-bold ${leader1 && !tied ? 'text-school-primary' : 'text-gray-400'}`}>
            {val1}
          </div>
          <div className="font-mono text-[10px] text-gray-400">{unit}</div>
        </div>
        <div>
          <div className={`font-display text-xl font-bold ${leader2 && !tied ? '' : tied ? 'text-gray-600' : 'text-gray-400'}`}
            style={leader2 && !tied ? { color: GOLD } : {}}>
            {val2}
          </div>
          <div className="font-mono text-[10px] text-gray-400">{unit}</div>
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, val1, val2 }) {
  const v1 = parseFloat(val1);
  const v2 = parseFloat(val2);
  const total = v1 + v2;
  const pct1 = total > 0 ? Math.round(100 * v1 / total) : 50;
  const pct2 = 100 - pct1;

  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-9 text-right font-mono text-[11px] text-gray-400 shrink-0">{label}</div>
      <div className="flex-1 flex h-6 rounded overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
        <div
          className="flex items-center justify-end pr-1.5 text-white font-mono text-[11px] font-bold rounded-l"
          style={{ width: `${pct1}%`, background: NAVY, minWidth: '30px' }}
        >
          {val1}
        </div>
        <div
          className="flex items-center justify-start pl-1.5 text-white font-mono text-[11px] font-bold rounded-r"
          style={{ width: `${pct2}%`, background: GOLD, minWidth: '30px' }}
        >
          {val2}
        </div>
      </div>
    </div>
  );
}

function ChartCanvas({ id, height, renderFn }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    script.onload = () => {
      if (cancelled || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = renderFn(canvasRef.current);
    };
    if (window.Chart) {
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = renderFn(canvasRef.current);
    } else {
      document.head.appendChild(script);
    }
    return () => { cancelled = true; if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
      <canvas ref={canvasRef} id={id} />
    </div>
  );
}

export default function ComparePage() {
  const flagg = getStats('flagg', '2024-25');
  const boozer = getStats('cameron_boozer', '2025-26');
  const flaggP = getPlayer('flagg');
  const boozerP = getPlayer('cameron_boozer');

  if (!flagg || !boozer) {
    return (
      <Layout title="Player Comparison" canonical="/viz/compare/">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="font-display text-xl text-gray-400">Stats data not loaded</p>
        </div>
      </Layout>
    );
  }

  const categories = [
    { label: 'PTS', f: flagg.pts, b: boozer.pts },
    { label: 'REB', f: flagg.reb, b: boozer.reb },
    { label: 'AST', f: flagg.ast, b: boozer.ast },
    { label: 'STL', f: flagg.stl, b: boozer.stl },
    { label: 'BLK', f: flagg.blk, b: boozer.blk },
    { label: 'FG%', f: flagg.fgPct, b: boozer.fgPct },
    { label: 'FT%', f: flagg.ftPct, b: boozer.ftPct },
    { label: '3P%', f: flagg.tpPct, b: boozer.tpPct },
  ];

  const fWins = categories.filter(c => c.f > c.b).length;
  const bWins = categories.filter(c => c.b > c.f).length;
  const ties = categories.filter(c => c.f === c.b).length;

  return (
    <Layout
      title="Flagg vs Boozer — Freshman Comparison"
      description="Kentucky freshmen: a side-by-side comparison of Kentucky's back-to-back freshman stars."
      canonical="/viz/compare/"
    >
      <Head>
        <meta property="og:title" content="Kentucky Through the Rafters — Flagg vs Boozer Freshman Comparison" />
        <meta property="og:description" content="Two generational freshmen, two different profiles. Per-game stats, shooting splits, and season totals compared." />
      </Head>

      {/* Hero */}
      <div className="bg-school-dark py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="font-mono text-xs text-school-accentLight mb-6 tracking-wider">
            <Link href="/" className="hover:text-school-accent">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/viz/" className="hover:text-school-accent">Viz</Link>
            <span className="mx-2">/</span>
            <span className="text-school-accent">Freshman Comparison</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Flagg vs Boozer
          </h1>
          <p className="font-body text-school-accentLight text-lg italic mb-6">
            Back-to-back generational freshmen. Who had the better debut?
          </p>

          {/* Player cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="rounded-lg p-4 md:p-6" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="font-mono text-xs text-school-accent uppercase tracking-wider mb-1">2024–25</div>
              <Link href={`/players/${flaggP.slug}/`} className="font-display text-xl md:text-2xl font-bold text-white hover:text-school-accent transition-colors">
                Cooper Flagg
              </Link>
              <div className="font-mono text-xs text-school-accentLight mt-1">
                Fr · Forward · 6&apos;9&quot; · #2 · 37 GP · 35-4
              </div>
              <div className="font-display text-3xl text-white font-bold mt-3">
                {flagg.pts}<span className="text-sm text-school-accentLight font-normal ml-1">ppg</span>
              </div>
            </div>

            <div className="rounded-lg p-4 md:p-6" style={{ background: 'rgba(196,162,62,0.1)' }}>
              <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: GOLD }}>2025–26</div>
              <Link href={`/players/${boozerP.slug}/`} className="font-display text-xl md:text-2xl font-bold text-white hover:text-school-accent transition-colors">
                Cameron Boozer
              </Link>
              <div className="font-mono text-xs text-school-accentLight mt-1">
                Fr · Forward · 6&apos;9&quot; · #12 · {boozer.gp} GP · 34-2*
              </div>
              <div className="font-display text-3xl text-white font-bold mt-3">
                {boozer.pts}<span className="text-sm text-school-accentLight font-normal ml-1">ppg</span>
              </div>
            </div>
          </div>

          {/* Scorecard */}
          <div className="flex items-center justify-center gap-6 mt-6 mb-2">
            <div className="text-center">
              <div className="font-display text-2xl text-white font-bold">{fWins}</div>
              <div className="font-mono text-[10px] text-school-accentLight">Flagg leads</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl text-school-accent font-bold">{ties}</div>
              <div className="font-mono text-[10px] text-school-accentLight">Tied</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl text-white font-bold">{bWins}</div>
              <div className="font-mono text-[10px] text-school-accentLight">Boozer leads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Per-game stat cards */}
        <h2 className="font-display text-xl text-school-primary font-bold mb-3">Per game averages</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: NAVY }} />
            <span className="font-mono text-xs text-gray-500">Flagg &apos;25</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: GOLD }} />
            <span className="font-mono text-xs text-gray-500">Boozer &apos;26</span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
          <StatCard label="Points" val1={flagg.pts} val2={boozer.pts} unit="ppg" />
          <StatCard label="Rebounds" val1={flagg.reb} val2={boozer.reb} unit="rpg" />
          <StatCard label="Assists" val1={flagg.ast} val2={boozer.ast} unit="apg" />
          <StatCard label="Steals" val1={flagg.stl} val2={boozer.stl} unit="spg" />
          <StatCard label="Blocks" val1={flagg.blk} val2={boozer.blk} unit="bpg" />
          <StatCard label="Minutes" val1={flagg.mpg} val2={boozer.mpg} unit="mpg" />
        </div>

        {/* Head-to-head bars */}
        <h2 className="font-display text-xl text-school-primary font-bold mb-3">Head-to-head by category</h2>
        <div className="mb-8">
          {categories.map(c => (
            <ComparisonBar key={c.label} label={c.label} val1={c.f} val2={c.b} />
          ))}
        </div>

        {/* Shooting chart */}
        <h2 className="font-display text-xl text-school-primary font-bold mb-3">Shooting efficiency</h2>
        <div className="mb-8">
          <ChartCanvas id="shootChart" height={280} renderFn={(canvas) => {
            return new window.Chart(canvas, {
              type: 'bar',
              data: {
                labels: ['Field goal %', 'Three-point %', 'Free throw %'],
                datasets: [
                  { label: 'Flagg', data: [flagg.fgPct, flagg.tpPct, flagg.ftPct], backgroundColor: NAVY, borderRadius: 4, barPercentage: 0.7, categoryPercentage: 0.6 },
                  { label: 'Boozer', data: [boozer.fgPct, boozer.tpPct, boozer.ftPct], backgroundColor: GOLD, borderRadius: 4, barPercentage: 0.7, categoryPercentage: 0.6 },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '%' } } },
                scales: {
                  y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { ticks: { font: { size: 12 }, autoSkip: false }, grid: { display: false } },
                },
              },
            });
          }} />
        </div>

        {/* Season totals chart */}
        <h2 className="font-display text-xl text-school-primary font-bold mb-3">Season totals</h2>
        <div className="mb-8">
          <ChartCanvas id="totalsChart" height={280} renderFn={(canvas) => {
            return new window.Chart(canvas, {
              type: 'bar',
              data: {
                labels: ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks'],
                datasets: [
                  { label: `Flagg (${flagg.gp} gp)`, data: [flagg.totalPts, flagg.totalReb, flagg.totalAst, flagg.totalStl, flagg.totalBlk], backgroundColor: NAVY, borderRadius: 4, barPercentage: 0.7, categoryPercentage: 0.6 },
                  { label: `Boozer (${boozer.gp} gp)`, data: [boozer.totalPts, boozer.totalReb, boozer.totalAst, boozer.totalStl, boozer.totalBlk], backgroundColor: GOLD, borderRadius: 4, barPercentage: 0.7, categoryPercentage: 0.6 },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y } } },
                scales: {
                  y: { beginAtZero: true, ticks: { font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { ticks: { font: { size: 12 }, autoSkip: false }, grid: { display: false } },
                },
              },
            });
          }} />
        </div>

        {/* Analysis */}
        <div className="prose max-w-none mb-8">
          <h2 className="font-display text-xl text-school-primary font-bold mb-3">The verdict</h2>
          <p className="font-body text-gray-700 leading-relaxed mb-4">
            Boozer leads in scoring (22.5 vs 19.2), rebounding (10.2 vs 7.5), and field goal percentage
            (56.5% vs 48.1%). He&apos;s averaging a double-double as a freshman — only the second Kentucky player
            to do that since Zion Williamson in 2018-19. He also gets there on better efficiency, shooting
            nearly 57% from the field.
          </p>
          <p className="font-body text-gray-700 leading-relaxed mb-4">
            Flagg&apos;s edge is on the defensive end — 1.4 blocks per game vs Boozer&apos;s 0.5, and his
            free throw shooting (84% vs 77.5%) shows a more polished perimeter game. Their assists are
            identical at 4.2, remarkable for two forwards.
          </p>
          <p className="font-body text-gray-700 leading-relaxed mb-4">
            The real differentiator? Flagg was a two-way force who could switch 1-5, block shots, and run
            the offense. Boozer is a scoring and rebounding machine who does his damage between the paint
            and the three-point line. Different builds, different skill sets, same result: generational
            Kentucky freshmen.
          </p>
        </div>

        {/* Footer note */}
        <div className="border-t border-gray-200 pt-4 mb-8">
          <p className="font-mono text-[11px] text-gray-400">
            *2025-26 stats through Sweet 16 (34 games). Source: UKAthletics.com official cumulative statistics, ESPN.
            Built by <a href="/" className="text-school-accent hover:underline">DukeThrough the Rafters.com</a>.
          </p>
        </div>
      </div>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Flagg vs Boozer: Kentucky Freshman Comparison',
            description: 'Kentucky freshmen — a side-by-side statistical comparison of Duke\'s back-to-back generational freshmen.',
            url: 'https://www.throughtherafters.com/viz/compare/',
            publisher: { '@type': 'Organization', name: 'Kentucky Through the Rafters', url: 'https://www.throughtherafters.com' },
          }),
        }}
      />
    </Layout>
  );
}
