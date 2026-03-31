// pages/viz/draft-2026.js
// 2026 NBA Draft Projections — Brotherhood Analogues

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const NAVY = '#001A57';
const GOLD = '#C4A23E';

const prospects = [
  {
    name: 'Cameron Boozer', pos: 'PF', height: '6\'9"', classYear: 'Fr.', jersey: 2,
    projection: { range: '#1-2 Overall', round: 'Lottery Lock', confidence: 98 },
    dukeStats: { ppg: 22.5, rpg: 10.3, apg: 3.1, 'fg%': 56.2 },
    awards: ['ACC POY', 'ACC ROY', 'Unanimous All-American'],
    analysis: 'The best Duke freshman stat line since Zion Williamson. His 22.5/10.3 with 21 double-doubles exceeds every Brotherhood one-and-done except Zion\'s scoring. ACC POY + ROY as a freshman places him in the exclusive Zion/Bagley/Okafor/Flagg club. Consensus #1 pick — the only question is whether the lottery order cooperates.',
    analogues: [
      { name: 'Zion Williamson', year: 2019, pick: '#1 Overall', dukeStat: '22.6 ppg / 8.9 rpg', nbaStat: '2x All-Star, $198M contract', match: 94, slug: 'zion-williamson' },
      { name: 'Marvin Bagley III', year: 2018, pick: '#2 Overall', dukeStat: '21.0 ppg / 11.1 rpg', nbaStat: '6 NBA seasons, journeyman', match: 88, slug: 'marvin-bagley-iii' },
      { name: 'Paolo Banchero', year: 2022, pick: '#1 Overall', dukeStat: '17.2 ppg / 7.8 rpg', nbaStat: '2023 ROY, All-Star', match: 85, slug: 'paolo-banchero' },
    ],
  },
  {
    name: 'Isaiah Evans', pos: 'G/F', height: '6\'6"', classYear: 'So.', jersey: 3,
    projection: { range: '#8-18', round: 'Mid-Lottery', confidence: 75 },
    dukeStats: { ppg: 14.8, rpg: 4.2, apg: 2.1, '3pt%': 37.5 },
    awards: ['2x NC Mr. Basketball', "McDonald's All-American"],
    analysis: 'Prototypical modern NBA wing at 6\'6" with shot-making ability. Two years of Duke development gives him polish that one-and-dones lack. His high school pedigree and sophomore leap project him as a lottery pick. The question is whether he\'s a top-10 talent or a mid-first — the Ingram comp is aspirational, the Reddish comp is cautionary.',
    analogues: [
      { name: 'Brandon Ingram', year: 2016, pick: '#2 Overall', dukeStat: '17.3 ppg / 6.8 rpg', nbaStat: '2x All-Star, MIP, $182M', match: 72, slug: 'brandon-ingram' },
      { name: 'Cam Reddish', year: 2019, pick: '#10 Overall', dukeStat: '13.5 ppg / 3.7 rpg', nbaStat: '5 NBA teams, journeyman wing', match: 78, slug: 'cam-reddish' },
      { name: 'Austin Rivers', year: 2012, pick: '#10 Overall', dukeStat: '15.5 ppg / 3.4 rpg', nbaStat: '11 NBA seasons, role player', match: 70, slug: 'austin-rivers' },
    ],
  },
  {
    name: 'Cayden Boozer', pos: 'PG', height: '6\'5"', classYear: 'Fr.', jersey: 0,
    projection: { range: '#15-25', round: 'Late 1st Round', confidence: 68 },
    dukeStats: { ppg: 12.8, rpg: 3.4, apg: 6.8, '3pt%': 34.2 },
    awards: ['FIBA U17 Gold Medal', '4x FL State Champion'],
    analysis: 'The facilitator twin. His 6.8 assists per game would rank among the best in Duke PG history. Brotherhood data shows pass-first Duke point guards go late first round (Tyus Jones #24) unless they add scoring punch (Bobby Hurley #7). If Cayden\'s shot develops, he moves up. The twin narrative with Cameron adds intrigue but won\'t move the needle alone.',
    analogues: [
      { name: 'Tyus Jones', year: 2015, pick: '#24 Overall', dukeStat: '11.8 ppg / 5.6 apg', nbaStat: '10 NBA seasons, $30M contract', match: 82, slug: 'tyus-jones' },
      { name: 'Bobby Hurley', year: 1993, pick: '#7 Overall', dukeStat: 'NCAA assists leader (1,076)', nbaStat: 'Career derailed by car accident', match: 60, slug: 'bobby-hurley' },
      { name: 'Tre Jones', year: 2020, pick: '#41 Overall', dukeStat: '16.2 ppg / 6.4 apg (soph)', nbaStat: '5 NBA seasons, Spurs starter', match: 75, slug: 'tre-jones' },
    ],
  },
  {
    name: 'Dame Sarr', pos: 'G/F', height: '6\'8"', classYear: 'Fr.', jersey: 15,
    projection: { range: '#25-40', round: 'Late 1st / Early 2nd', confidence: 55 },
    dukeStats: { ppg: 8.4, rpg: 3.8, apg: 1.9, '3pt%': 32.8 },
    awards: ['International recruit', 'Belgian youth teams'],
    analysis: 'The most intriguing projection on the roster. NBA-level length at 6\'8" with guard skills is the modern prototype. But Brotherhood data is unforgiving: Duke players with elite physical tools but modest college stats have wildly variable outcomes. Harry Giles went #20 on pure upside despite 3.9 ppg. AJ Griffin went #16 at 10.4 ppg. Gary Trent Jr. went #37 and made $70M+. Same archetype, three completely different trajectories.',
    analogues: [
      { name: 'AJ Griffin', year: 2022, pick: '#16 Overall', dukeStat: '10.4 ppg / 44.7% 3PT', nbaStat: 'Retired from NBA after 2 seasons', match: 68, slug: 'aj-griffin' },
      { name: 'Harry Giles III', year: 2017, pick: '#20 Overall', dukeStat: '3.9 ppg / 26 games', nbaStat: '165 NBA games, now Klutch agent', match: 55, slug: 'harry-giles-iii' },
      { name: 'Gary Trent Jr.', year: 2018, pick: '#37 Overall', dukeStat: '14.5 ppg / 40.2% 3PT', nbaStat: '7 NBA seasons, $70M+ earnings', match: 62, slug: 'gary-trent-jr' },
    ],
  },
  {
    name: 'Maliq Brown', pos: 'F', height: '6\'8"', classYear: 'Sr.', jersey: 14,
    projection: { range: '#30-45', round: '2nd Round', confidence: 60 },
    dukeStats: { ppg: 9.2, rpg: 6.1, apg: 2.3, 'stl': 1.8 },
    awards: ['ACC DPOY', 'ACC 6th Man', 'Historic 5x5 game'],
    analysis: 'Duke\'s two previous ACC DPOYs — Shane Battier (#6) and Shelden Williams (#5) — both went top 10, but both scored 14+ ppg. Brown\'s offensive limitations and senior status push him to the second round. But NBA teams increasingly value switchable defensive forwards, and a 5x5 game gets scouts\' attention. The Ojeleye comp is the realistic floor.',
    analogues: [
      { name: 'Shane Battier', year: 2001, pick: '#6 Overall', dukeStat: '19.2 ppg / DPOY + POY', nbaStat: '2x NBA Champion, 13 seasons', match: 50, slug: 'shane-battier' },
      { name: 'Semi Ojeleye', year: 2017, pick: '#37 Overall', dukeStat: '2.0 ppg Duke; 19.0 at SMU', nbaStat: '4 NBA seasons, defense specialist', match: 72, slug: 'semi-ojeleye' },
      { name: 'Shelden Williams', year: 2006, pick: '#5 Overall', dukeStat: '13.9 ppg / 2x DPOY', nbaStat: '4 NBA seasons, 228 games', match: 58, slug: 'shelden-williams' },
    ],
  },
  {
    name: 'Caleb Foster', pos: 'G', height: '6\'5"', classYear: 'Jr.', jersey: 1,
    projection: { range: '#35-55', round: '2nd Rd / Bubble', confidence: 40 },
    dukeStats: { ppg: 8.5, rpg: 2.4, apg: 3.2, '3pt%': 40.2 },
    awards: ['2x All-ACC Academic', '96 career games'],
    analysis: 'Foster\'s 40.2% three-point shooting is his NBA ticket — the league pays for spacing. But 8.5 ppg as a third-year player won\'t generate buzz. Duke multi-year guards without star scoring go late second round or undrafted. The smart play may be returning for a senior year to be "the guy" — a 15-ppg senior season with 40% threes changes everything.',
    analogues: [
      { name: 'Chris Duhon', year: 2004, pick: '#38 Overall', dukeStat: '133 starts, floor general', nbaStat: '8 NBA seasons, 462 games', match: 70, slug: 'chris-duhon' },
      { name: 'Quinn Cook', year: 2015, pick: 'Undrafted', dukeStat: '106 starts, 15.3 ppg senior', nbaStat: 'NBA Champion 2018, 4 seasons', match: 65, slug: 'quinn-cook' },
      { name: 'Kyle Singler', year: 2011, pick: '#33 Overall', dukeStat: '148 games, 2010 Champion', nbaStat: '5 NBA seasons, 261 games', match: 55, slug: 'kyle-singler' },
    ],
  },
];

function ConfidenceBar({ value }) {
  const color = value >= 80 ? '#22c55e' : value >= 60 ? GOLD : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function MatchBadge({ value }) {
  const color = value >= 80 ? 'bg-green-100 text-green-800' : value >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${color}`}>
      {value}%
    </span>
  );
}

function ProspectCard({ prospect, isSelected, onClick }) {
  const p = prospect;
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-xl p-5 border transition-all duration-200 ${
        isSelected
          ? 'border-duke-navy bg-duke-navy/5 shadow-lg ring-2 ring-duke-navy/20'
          : 'border-gray-200 bg-white hover:border-duke-navy/40 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: GOLD }}>{p.projection.round}</div>
          <div className="font-display text-xl font-bold text-duke-navy mt-1">{p.name}</div>
          <div className="font-mono text-xs text-gray-400 mt-0.5">#{p.jersey} · {p.pos} · {p.height} · {p.classYear}</div>
        </div>
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: NAVY }}>
          <div className="font-mono text-base font-extrabold text-white leading-tight">{p.projection.range}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-3">
        {Object.entries(p.dukeStats).map(([key, val]) => (
          <div key={key} className="text-center">
            <div className="font-mono text-lg font-bold text-duke-navy">{val}</div>
            <div className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">{key}</div>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">Draft Confidence</span>
          <span className="font-mono text-[11px] text-gray-500">{p.projection.confidence}%</span>
        </div>
        <ConfidenceBar value={p.projection.confidence} />
      </div>

      <div className="flex gap-1.5 flex-wrap mt-3">
        {p.awards.slice(0, 3).map((a, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md font-semibold border" style={{ color: GOLD, borderColor: `${GOLD}44`, background: `${GOLD}0a` }}>
            {a}
          </span>
        ))}
      </div>
    </button>
  );
}

function AnaloguePanel({ prospect }) {
  if (!prospect) return null;
  const p = prospect;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-5 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: GOLD }}>Brotherhood Analogues</div>
          <div className="font-display text-2xl font-bold text-duke-navy mt-1">{p.name}</div>
        </div>
        <div className="rounded-lg px-4 py-2" style={{ background: NAVY }}>
          <div className="font-mono text-lg font-extrabold text-white">{p.projection.range}</div>
          <div className="font-mono text-[9px] text-gray-300 text-center">PROJECTED</div>
        </div>
      </div>

      <p className="font-body text-[15px] leading-relaxed text-gray-600 mb-6">{p.analysis}</p>

      <div className="space-y-3">
        {p.analogues.map((a, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div>
                <Link href={`/players/${a.slug}`} className="font-display text-base font-bold text-duke-navy hover:underline">
                  {a.name}
                </Link>
                <div className="font-mono text-xs font-semibold" style={{ color: GOLD }}>{a.pick} · {a.year}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">At Duke</div>
                <div className="font-body text-sm text-gray-600">{a.dukeStat}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">NBA Career</div>
                <div className="font-body text-sm text-gray-600">{a.nbaStat}</div>
              </div>
              <div className="text-right">
                <MatchBadge value={a.match} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DraftProjections2026() {
  const [selected, setSelected] = useState(0);

  return (
    <Layout
      title="2026 NBA Draft Projections"
      description="Where will Duke's 2025-26 roster land in the 2026 NBA Draft? Brotherhood historical analogues for every prospect."
      canonical="/viz/draft-2026"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: '2026 Duke NBA Draft Projections — Brotherhood Analogues',
              description: 'Statistical comparisons to 77 drafted Duke players (1981-2025) to project the 2026 draft class.',
            }),
          }}
        />
      </Head>

      <section className="bg-duke-slate text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="font-mono text-duke-gold text-[11px] tracking-[0.3em] uppercase mb-3">
            DukeBrotherhood.com &bull; 2026 NBA Draft
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Brotherhood <span className="text-duke-gold">Draft Board</span>
          </h1>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            We used 45 years of Brotherhood data — every Duke player drafted since 1981 — to find the closest
            statistical and profile analogues for each 2025-26 prospect. Here&rsquo;s what the history says.
          </p>
          <div className="inline-flex gap-6 bg-white/5 backdrop-blur rounded-lg px-6 py-3 border border-white/10">
            <div className="text-center">
              <div className="font-mono text-xl font-extrabold text-duke-gold">77</div>
              <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Players Drafted</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-mono text-xl font-extrabold text-duke-gold">5</div>
              <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">#1 Overall Picks</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="font-mono text-xl font-extrabold text-duke-gold">4-6</div>
              <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Projected 2026</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
            {prospects.map((p, i) => (
              <ProspectCard key={p.name} prospect={p} isSelected={selected === i} onClick={() => setSelected(i)} />
            ))}
          </div>

          <AnaloguePanel prospect={prospects[selected]} />

          <div className="mt-10 text-center text-xs text-gray-400 font-mono">
            Projections based on statistical comparison to 77 drafted Duke players (1981&ndash;2025).
            <br />Match percentages reflect similarity in Duke stats, physical profile, draft position, and era context.
            <br />
            <Link href="/viz" className="text-duke-navy hover:underline mt-2 inline-block">
              &larr; Back to Visualizations
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
