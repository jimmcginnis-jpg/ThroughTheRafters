import config from '../../school.config';
// pages/teams/index.js
// All seasons landing page — collapsible eras with descriptions

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import teams from '../../data/teams.json';
import playerData from '../../data/players.json';

// Pull era info from players.json so labels stay in sync
const eraInfo = {};
if (playerData.eras) {
  playerData.eras.forEach(e => { eraInfo[e.key] = e; });
}

const eraDescriptions = {
  rupp: 'Four national championships. The Baron of the Bluegrass. The man who built Kentucky basketball into a religion.',
  hall: 'Following a legend. The 1978 national championship. The burden and the glory of being next.',
  sutton: 'Elite Eight runs, NCAA violations, and the scandal that nearly destroyed the program.',
  pitino: 'From probation to the 1996 national championship. Full-court press. The Unforgettables. Kentucky reborn.',
  tubby: 'A title in year one. Ten straight NCAA tournaments. Never enough for the most demanding fanbase in America.',
  gillispie: 'Two seasons. No NCAA tournament. The lowest point in modern Kentucky basketball.',
  calipari: 'One-and-done factory. The 2012 national championship. 38-0. The most polarizing era in program history.',
  pope: 'The former Wildcat returns home. A new beginning built on old roots.',
};

// Color-code NCAA outcomes
function outcomeColor(outcome) {
  if (!outcome) return 'text-gray-400';
  if (outcome.includes('National Champions')) return 'text-yellow-500';
  if (outcome.includes('Runner-Up')) return 'text-gray-300';
  if (outcome.includes('Final Four')) return 'text-blue-300';
  if (outcome.includes('Elite')) return 'text-blue-400';
  return 'text-school-accentLight';
}

function EraSection({ era, seasons, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const info = eraInfo[era];
  const label = info ? `${info.name} (${info.years})` : era;
  const desc = eraDescriptions[era] || '';

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between border-b-2 border-school-accent pb-2 mb-1">
          <h2 className="font-display text-xl text-school-primary font-bold group-hover:text-school-accent transition-colors">
            {label}
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-gray-400">{seasons.length} season{seasons.length !== 1 ? 's' : ''}</span>
            <svg
              className={`w-5 h-5 text-school-accent transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {desc && (
          <p className="font-body text-sm text-gray-500 italic mt-1 mb-2">{desc}</p>
        )}
      </button>

      {open && (
        <div className="space-y-3 mt-3">
          {seasons.map(s => (
            <Link
              key={s.season}
              href={`/teams/${s.season}/`}
              className="group flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-school-accent hover:shadow-md transition-all bg-white"
            >
              <div className="shrink-0 w-16 text-center">
                <div className="font-mono text-lg text-school-primary font-bold">{s.season.split('-')[0]}</div>
                <div className="font-mono text-xs text-gray-400">–{s.season.split('-')[1]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-display text-school-primary font-semibold group-hover:text-school-accent transition-colors">
                    {s.record}
                  </span>
                  <span className="font-mono text-xs text-gray-400">({s.accRecord} ACC)</span>
                </div>
                <div className={`font-mono text-xs ${outcomeColor(s.ncaaTournament)}`}>
                  {s.ncaaTournament}
                </div>
              </div>
              <div className="hidden md:block text-right shrink-0 max-w-xs">
                <p className="font-body text-sm text-gray-500 italic truncate">{s.tagline}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamsIndex({ seasons }) {
  // Group by era, preserving order
  const eraOrder = [];
  const grouped = {};
  seasons.forEach(s => {
    if (!grouped[s.era]) {
      grouped[s.era] = [];
      eraOrder.push(s.era);
    }
    grouped[s.era].push(s);
  });

  return (
    <Layout
      title="Teams by Season"
      description="Every Kentucky basketball season from 1981 to present — rosters, results, UNC games, and March stories."
      canonical="/teams/"
    >
      <section className="bg-school-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-2">Teams</h1>
          <p className="font-body text-school-accentLight text-lg">
            Every season, every roster, every March. {seasons.length} seasons documented.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        {eraOrder.map((era, i) => (
          <EraSection
            key={era}
            era={era}
            seasons={grouped[era]}
            defaultOpen={i === eraOrder.length - 1}
          />
        ))}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seasons: teams.seasons.map(s => ({
        season: s.season,
        era: s.era,
        record: s.record,
        accRecord: s.accRecord || "",
        ncaaTournament: s.ncaaTournament || "",
        tagline: s.tagline || "",
      })),
    },
  };
}
