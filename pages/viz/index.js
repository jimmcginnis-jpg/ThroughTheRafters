// pages/viz/index.js
// Viz landing page — links to all visualizations

import Link from 'next/link';
import Layout from '../../components/Layout';

const vizzes = [
  {
    slug: 'height',
    title: 'All Players by Height',
    desc: '219 players visualized from 5\'8" to 7\'2" — hover to explore.',
    stat: '5\'8" to 7\'2"',
  },
  {
    slug: 'map',
    title: 'Recruiting Map',
    desc: 'Where Duke gets its players — 200 hometowns pinned from Los Angeles to South Sudan.',
    stat: '200 hometowns',
  },
  {
    slug: 'nba',
    title: 'Duke in the NBA',
    desc: 'How many Brotherhood members were in the league each season — from 2 in 1986 to 23 at the peak.',
    stat: '41 seasons',
  },
  {
    slug: 'nba-teams',
    title: 'Duke by NBA Team',
    desc: 'Every NBA franchise\u2019s Duke connection — all-time rosters and who\u2019s playing right now.',
    stat: '30 teams',
  },
];

export default function VizIndex() {
  return (
    <Layout
      title="Visualizations"
      description="Interactive data visualizations of Duke's Brotherhood — height charts, recruiting maps, and more."
      canonical="/viz/"
    >
      <section className="bg-duke-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-2">Viz</h1>
          <p className="font-body text-duke-goldLight text-lg">
            Interactive explorations of the Brotherhood data.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {vizzes.map(v => (
            <Link
              key={v.slug}
              href={`/viz/${v.slug}/`}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-duke-gold hover:shadow-lg transition-all bg-white"
            >
              <div className="font-mono text-xs text-duke-gold uppercase tracking-wider mb-2">{v.stat}</div>
              <h2 className="font-display text-xl text-duke-navy font-bold group-hover:text-duke-gold transition-colors mb-2">
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
