// pages/teams/index.js
// All seasons landing page

import Link from 'next/link';
import Layout from '../../components/Layout';
import teams from '../../data/teams.json';

const eraNames = {
  foundation: 'Foundation (1981–85)',
  dynasty1: 'First Dynasty (1986–94)',
  transition: 'Transition (1995–98)',
  dynasty2: 'Second Dynasty (1999–04)',
  between: 'In Between (2005–09)',
  resurgence: 'Resurgence (2010–15)',
  superteam: 'Superteam (2016–22)',
  scheyer: 'Scheyer Era (2022–)',
};

// Color-code NCAA outcomes
function outcomeColor(outcome) {
  if (!outcome) return 'text-gray-400';
  if (outcome.includes('National Champions')) return 'text-yellow-500';
  if (outcome.includes('Runner-Up')) return 'text-gray-300';
  if (outcome.includes('Final Four')) return 'text-blue-300';
  if (outcome.includes('Elite')) return 'text-blue-400';
  return 'text-duke-goldLight';
}

export default function TeamsIndex({ seasons }) {
  // Group by era
  const grouped = {};
  seasons.forEach(s => {
    if (!grouped[s.era]) grouped[s.era] = [];
    grouped[s.era].push(s);
  });

  return (
    <Layout
      title="Teams by Season"
      description="Every Duke basketball season from 1981 to present — rosters, results, UNC games, and March stories."
      canonical="/teams/"
    >
      <section className="bg-duke-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-2">Teams</h1>
          <p className="font-body text-duke-goldLight text-lg">
            Every season, every roster, every March. {seasons.length} seasons documented.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        {Object.entries(grouped).map(([era, szns]) => (
          <div key={era} className="mb-10">
            <h2 className="font-display text-xl text-duke-navy font-bold mb-4 border-b-2 border-duke-gold pb-2">
              {eraNames[era] || era}
            </h2>
            <div className="space-y-3">
              {szns.map(s => (
                <Link
                  key={s.season}
                  href={`/teams/${s.season}/`}
                  className="group flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-duke-gold hover:shadow-md transition-all bg-white"
                >
                  <div className="shrink-0 w-16 text-center">
                    <div className="font-mono text-lg text-duke-navy font-bold">{s.season.split('-')[0]}</div>
                    <div className="font-mono text-xs text-gray-400">–{s.season.split('-')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-duke-navy font-semibold group-hover:text-duke-gold transition-colors">
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
          </div>
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
        accRecord: s.accRecord,
        ncaaTournament: s.ncaaTournament,
        tagline: s.tagline,
      })),
    },
  };
}
