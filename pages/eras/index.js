import config from '../../school.config';
import Link from 'next/link';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

export default function ErasIndex() {
  return (
    <Layout
      title="All Eras"
      description="Browse Kentucky basketball history by era — from Coach K's Foundation to the Scheyer Era."
      canonical="/eras/"
    >
      <section className="bg-school-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-4">Eras of Kentucky Basketball</h1>
          <p className="font-body text-school-accentLight text-lg">
            Eight chapters, four decades, one Through the Rafters.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {data.eras.map(era => {
            const eraPlayers = data.players.filter(p => p.era === era.key);
            const eraDone = eraPlayers.filter(p => p.status === 'done').length;
            const doneNames = eraPlayers.filter(p => p.status === 'done').map(p => p.name);

            return (
              <Link
                key={era.key}
                href={`/eras/${era.key}/`}
                className="player-card block bg-white border border-gray-200 p-6 hover:border-school-accent"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-sm text-school-accent">Era {era.num}</span>
                    <span className="font-mono text-sm text-gray-400 ml-3">{era.years}</span>
                  </div>
                  <span className="font-mono text-xs text-gray-400">
                    {eraDone}/{eraPlayers.length} complete
                  </span>
                </div>
                <h2 className="font-display text-2xl text-school-primary mb-2">{era.name}</h2>
                <p className="font-body text-gray-600 mb-3">{era.desc}</p>
                {doneNames.length > 0 && (
                  <p className="font-body text-sm text-gray-400">
                    Profiles: {doneNames.join(', ')}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
