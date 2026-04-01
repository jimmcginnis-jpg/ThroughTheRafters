import Link from 'next/link';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

export default function EraPage({ era, players, prevEra, nextEra }) {
  if (!era) return null;

  const doneCount = players.filter(p => p.status === 'done').length;

  return (
    <Layout
      title={`Era ${era.num}: ${era.name} (${era.years})`}
      description={`${era.desc} — ${players.length} players profiled from the ${era.name} era of Kentucky basketball.`}
      canonical={`/eras/${era.key}/`}
    >
      {/* HERO */}
      <section className="bg-uk-slate text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="font-mono text-xs text-uk-silver mb-6 tracking-wider">
            <Link href="/" className="hover:text-uk-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/eras/" className="hover:text-uk-white">Eras</Link>
            <span className="mx-2">/</span>
            <span className="text-uk-white">Era {era.num}</span>
          </nav>

          <div className="font-mono text-uk-white text-sm tracking-widest mb-2">
            ERA {era.num} &bull; {era.years}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{era.name}</h1>
          <p className="font-body text-lg text-uk-silver italic">{era.desc}</p>
          <div className="mt-4 font-mono text-sm text-white/60">
            {doneCount} of {players.length} profiles complete
          </div>
        </div>
      </section>

      {/* PLAYERS GRID */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => {
            const hasProfile = player.status === 'done' || player.status === 'pledged';
            return (
              <Link
                key={player.id}
                href={hasProfile ? `/players/${player.slug}/` : '#'}
                className={`player-card block p-5 border ${
                  hasProfile
                    ? 'bg-white border-gray-200 hover:border-uk-white'
                    : 'bg-gray-50 border-gray-100 opacity-70 cursor-default'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    player.status === 'done' ? 'badge-done' :
                    player.status === 'pledged' ? 'badge-pledged' :
                    player.status === 'soon' ? 'badge-soon' : 'badge-coming'
                  }`}>
                    {player.status === 'done' ? 'Complete' :
                     player.status === 'pledged' ? 'Pledged' :
                     player.status === 'soon' ? 'Priority Next' : 'Coming Soon'}
                  </span>
                </div>
                <h3 className="font-display text-xl text-uk-blue mt-2">{player.name}</h3>
                <div className="font-mono text-xs text-gray-400 mt-1 mb-2">
                  {player.pos} &bull; {player.height} &bull; {player.years}
                </div>
                {hasProfile && (
                  <p className="font-body text-sm text-gray-500 italic line-clamp-2">
                    {player.tagline}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* PREV / NEXT Era */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          {prevEra ? (
            <Link href={`/eras/${prevEra.key}/`} className="group text-left">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">&larr; Previous Era</span>
              <div className="font-display text-uk-blue group-hover:text-uk-white transition-colors">
                {prevEra.num}. {prevEra.name}
              </div>
            </Link>
          ) : <div />}
          {nextEra ? (
            <Link href={`/eras/${nextEra.key}/`} className="group text-right">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Next Era &rarr;</span>
              <div className="font-display text-uk-blue group-hover:text-uk-white transition-colors">
                {nextEra.num}. {nextEra.name}
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = data.eras.map(era => ({
    params: { key: era.key },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const eraIndex = data.eras.findIndex(e => e.key === params.key);
  const era = data.eras[eraIndex];

  const players = data.players
    .filter(p => p.era === era.key)
    .map(p => ({
      id: p.id, slug: p.slug, name: p.name, pos: p.pos,
      years: p.years, height: p.height, tagline: p.tagline, status: p.status,
    }));

  const prevEra = eraIndex > 0 ? { key: data.eras[eraIndex - 1].key, num: data.eras[eraIndex - 1].num, name: data.eras[eraIndex - 1].name } : null;
  const nextEra = eraIndex < data.eras.length - 1 ? { key: data.eras[eraIndex + 1].key, num: data.eras[eraIndex + 1].num, name: data.eras[eraIndex + 1].name } : null;

  return { props: { era, players, prevEra, nextEra } };
}
