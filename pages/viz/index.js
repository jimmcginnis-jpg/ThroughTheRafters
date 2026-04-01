// pages/viz/index.js
// Viz landing page — links to all visualizations

import Link from 'next/link';
import Layout from '../../components/Layout';

const vizzes = [
  {
    slug: 'compare',
    title: 'Flagg vs Boozer',
    desc: 'Back-to-back generational freshmen compared — per-game stats, shooting splits, and season totals side by side.',
    stat: 'Freshman vs Freshman',
  },
  {
    slug: 'height',
    title: 'All Players by Height',
    desc: '219 players visualized from 5\'8" to 7\'2" — hover to explore.',
    stat: '5\'8" to 7\'2"',
  },
  {
    slug: 'map',
    title: 'Recruiting Map',
    desc: 'Where Kentucky gets its players — 200 hometowns pinned from Los Angeles to South Sudan.',
    stat: '200 hometowns',
  },
  {
    slug: 'nba',
    title: 'Kentucky in the NBA',
    desc: 'How many Through the Rafters members were in the league each season — from 2 in 1986 to 23 at the peak.',
    stat: '41 seasons',
  },
  {
    slug: 'nba-teams',
    title: 'Kentucky by NBA Team',
    desc: 'Every NBA franchise\u2019s Kentucky connection — all-time rosters and who\u2019s playing right now.',
    stat: '30 teams',
  },
  {
    slug: 'chain',
    title: 'Wildcats Chain',
    desc: 'Degrees of separation between any two Kentucky players — the unbroken chain of teammates from 1978 to today.',
    stat: '14 max degrees',
  },
  {
    slug: 'draft-2026',
    title: '2026 Draft Projections',
    desc: 'Where will this roster land in the 2026 NBA Draft? Through the Rafters analogues for every prospect — powered by 45 years of draft data.',
    stat: '8 prospects',
  },
];

export default function VizIndex() {
  return (
    <Layout
      title="Visualizations"
      description="Interactive data visualizations of Through the Rafters — height charts, recruiting maps, and more."
      canonical="/viz/"
    >
      <section className="bg-uk-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-2">Viz</h1>
          <p className="font-body text-uk-silver text-lg">
            Interactive explorations of Through the Rafters data.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {vizzes.map(v => (
            <Link
              key={v.slug}
              href={`/viz/${v.slug}/`}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-uk-white hover:shadow-lg transition-all bg-white"
            >
              <div className="font-mono text-xs text-uk-white uppercase tracking-wider mb-2">{v.stat}</div>
              <h2 className="font-display text-xl text-uk-blue font-bold group-hover:text-uk-white transition-colors mb-2">
                {v.title}
              </h2>
              <p className="font-body text-gray-500 text-sm">{v.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
