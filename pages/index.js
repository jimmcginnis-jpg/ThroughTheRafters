import Link from 'next/link';
import Layout from '../components/Layout';
import data from '../data/players.json';

export default function Home({ eras, recentProfiles }) {
  const totalDone = data.players.filter(p => p.status === 'done').length;
  const totalPlayers = data.players.length;

  return (
    <Layout canonical="/">
      {/* HERO */}
      <section className="bg-uk-slate text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="font-mono text-uk-white text-sm tracking-[0.3em] uppercase mb-4">
            Rupp &bull; Pitino &bull; Calipari &bull; Pope
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            <span className="text-uk-white">Through the</span>{' '}
            <span className="text-white">Rafters</span>
          </h1>
          <p className="font-display text-xl md:text-2xl italic text-uk-silver mb-8">
            Where Are They Now?
          </p>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            The complete documentary profile series covering every significant player
            across eight eras of Kentucky basketball. How they got to Kentucky. What made them
            special. What happened after. Where they are now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/players/"
              className="bg-uk-blue text-white px-6 py-3 font-mono text-sm tracking-wider uppercase hover:bg-uk-blue/80 transition-colors"
            >
              Explore All Players
            </Link>
            <Link
              href="/eras/"
              className="border border-uk-white text-uk-white px-6 py-3 font-mono text-sm tracking-wider uppercase hover:bg-uk-blue/10 transition-colors"
            >
              Browse by Era
            </Link>
            <Link
              href="/teams/"
              className="border border-uk-white text-uk-white px-6 py-3 font-mono text-sm tracking-wider uppercase hover:bg-uk-blue/10 transition-colors"
            >
              Browse by Season
            </Link>
            <Link
              href="/where-are-they-now/"
              className="border border-uk-white text-uk-white px-6 py-3 font-mono text-sm tracking-wider uppercase hover:bg-uk-blue/10 transition-colors"
            >
              Where Are They Now?
            </Link>
          </div>
          <div className="mt-10 font-mono text-sm text-uk-silver">
            {totalDone} of {totalPlayers} profiles complete
          </div>
        </div>
      </section>

      {/* ERA OVERVIEW */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-uk-blue text-center mb-10">
          Eight Eras of Kentucky Basketball
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {eras.map(era => {
            const eraPlayers = data.players.filter(p => p.era === era.key);
            const eraDone = eraPlayers.filter(p => p.status === 'done').length;
            return (
              <Link
                key={era.key}
                href={`/eras/${era.key}/`}
                className="player-card block bg-white border border-gray-200 p-6 hover:border-uk-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-uk-white">Era {era.num}</span>
                  <span className="font-mono text-xs text-gray-400">{era.years}</span>
                </div>
                <h3 className="font-display text-xl text-uk-blue mb-2">{era.name}</h3>
                <p className="font-body text-gray-600 text-sm mb-3">{era.desc}</p>
                <div className="font-mono text-xs text-gray-400">
                  {eraDone} of {eraPlayers.length} profiles complete
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED RECENT PROFILES */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-uk-blue text-center mb-10">
            Recently Updated
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentProfiles.map(player => {
              const era = data.eras.find(e => e.key === player.era);
              const dateStr = player.lastUpdated
                ? new Date(player.lastUpdated + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null;
              return (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}/`}
                  className="player-card block bg-uk-cream border border-gray-200 p-5 hover:border-uk-white"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-uk-white">{era?.name}</span>
                    {dateStr && <span className="font-mono text-xs text-gray-400">{dateStr}</span>}
                  </div>
                  <h3 className="font-display text-lg text-uk-blue mt-1 mb-1">{player.name}</h3>
                  <p className="font-body text-sm text-gray-600 italic mb-2">{player.tagline}</p>
                  <div className="font-mono text-xs text-gray-400">{player.pos} &bull; {player.years}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Pick the 3 most recently updated profiles
  const recentProfiles = data.players
    .filter(p => p.status === 'done' && p.lastUpdated)
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 3)
    .map(p => ({ id: p.id, slug: p.slug, name: p.name, tagline: p.tagline, pos: p.pos, years: p.years, era: p.era, lastUpdated: p.lastUpdated }));

  return {
    props: {
      eras: data.eras,
      recentProfiles,
    },
  };
}
