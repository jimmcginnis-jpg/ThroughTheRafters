import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import data from '../../data/players.json';

export default function PlayersIndex({ eras, players }) {
  const router = useRouter();
  const [filterEra, setFilterEra] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const donePlayers = players.filter(p => p.status === 'done');
  const goToRandomPlayer = () => {
    const random = donePlayers[Math.floor(Math.random() * donePlayers.length)];
    router.push(`/players/${random.slug}/`);
  };

  const filtered = players.filter(p => {
    if (filterEra !== 'all' && p.era !== filterEra) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase().trim();
      const searchable = [p.name, p.pos, p.years, p.hometown || '', p.highSchool || '', p.tagline || ''].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  return (
    <Layout
      title="All Players"
      description="Complete roster of Through the Rafters — every significant player across eight eras of Kentucky basketball."
      canonical="/players/"
    >
      <section className="bg-uk-slate text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-4">All Players</h1>
          <p className="font-body text-uk-silver text-lg">
            {players.filter(p => p.status === 'done').length} profiles complete
            &bull; {players.length} total players
          </p>
          <button
            onClick={goToRandomPlayer}
            className="mt-4 bg-uk-blue text-white px-4 py-2 font-mono text-xs tracking-wider uppercase hover:bg-uk-blue/80 transition-colors cursor-pointer"
            title="Random Player Generator — inspired by Wilco"
          >
            &#9861; Random Player
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, hometown, school..."
              className="border border-gray-300 px-3 py-2 font-body text-sm bg-white w-full"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-1">Era</label>
            <select
              value={filterEra}
              onChange={e => setFilterEra(e.target.value)}
              className="border border-gray-300 px-3 py-2 font-body text-sm bg-white"
            >
              <option value="all">All Eras</option>
              {eras.map(era => (
                <option key={era.key} value={era.key}>
                  {era.num}. {era.name} ({era.years})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-300 px-3 py-2 font-body text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="done">Complete</option>
              <option value="soon">Priority Next</option>
              <option value="coming">Coming Soon</option>
            </select>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(player => {
            const era = eras.find(e => e.key === player.era);
            const isDone = player.status === 'done';
            const hasProfile = player.status === 'done' || player.status === 'pledged';
            return (
              <Link
                key={player.id}
                href={hasProfile ? `/players/${player.slug}/` : '#'}
                className={`player-card block p-4 border ${
                  hasProfile
                    ? 'bg-white border-gray-200 hover:border-uk-white cursor-pointer'
                    : 'bg-gray-50 border-gray-100 cursor-default opacity-70'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-uk-white">{era?.name}</span>
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
                <h3 className="font-display text-lg text-uk-blue">{player.name}</h3>
                <div className="font-mono text-xs text-gray-400 mt-1">
                  {player.pos} &bull; {player.height} &bull; {player.years}
                </div>
                {hasProfile && player.tagline && (
                  <p className="font-body text-sm text-gray-500 italic mt-2 line-clamp-2">
                    {player.tagline}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12 font-body">
            No players match the current filters.
          </p>
        )}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Pass minimal data for listing (not full bios — those are on individual pages)
  const players = data.players.map(p => ({
    id: p.id,
    slug: p.slug,
    era: p.era,
    name: p.name,
    pos: p.pos,
    years: p.years,
    height: p.height,
    tagline: p.tagline,
    status: p.status,
    hometown: p.hometown || '',
    highSchool: p.highSchool || '',
  }));

  return {
    props: { eras: data.eras, players },
  };
}
