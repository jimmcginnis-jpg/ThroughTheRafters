// pages/search.js
// Dedicated search page — also accessible via nav overlay

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import data from '../data/players.json';

const eraNames = {
  foundation: 'I. Foundation (1981–85)',
  dynasty1: 'II. First Dynasty (1986–94)',
  transition: 'III. Transition (1995–98)',
  dynasty2: 'IV. Second Dynasty (1999–04)',
  between: 'V. In Between (2005–09)',
  resurgence: 'VI. Resurgence (2010–15)',
  superteam: 'VII. Superteam Era (2016–22)',
  scheyer: 'VIII. The Scheyer Era (2022–)',
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Pick up ?q= from URL
  useEffect(() => {
    if (router.query.q) setQuery(router.query.q);
  }, [router.query.q]);

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const q = query.toLowerCase().trim();
  const results = q.length >= 2
    ? data.players.filter(p => {
        const searchable = [
          p.name, p.hometown || '', p.highSchool || '',
          p.pos || '', p.years || '', p.jersey || '',
          eraNames[p.era] || '', p.tagline || '', p.now || '',
        ].join(' ').toLowerCase();
        return searchable.includes(q);
      })
    : [];

  const profiled = results.filter(p => p.status === 'done');
  const stubs = results.filter(p => p.status === 'stub');

  return (
    <Layout
      title="Search Players"
      description="Search all 238 Kentucky basketball players by name, hometown, high school, position, and more."
      canonical="/search/"
    >
      <section className="bg-uk-slate text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-4">Search Players</h1>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, hometown, high school, position, era..."
              className="w-full pl-12 pr-4 py-4 text-lg font-body text-uk-slate rounded-lg outline-none"
            />
          </div>
          <p className="font-mono text-xs text-uk-silver mt-3">
            {q.length >= 2
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for \u201C${query}\u201D`
              : `${data.players.length} players available \u2014 type at least 2 characters`
            }
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        {q.length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <p className="font-display text-2xl text-uk-blue mb-2">No results found</p>
            <p className="font-body text-gray-500">
              Try searching by name, hometown, high school, or position.
            </p>
          </div>
        )}

        {/* Profiled results */}
        {profiled.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-3">
              Profiled Players ({profiled.length})
            </h2>
            <div className="space-y-2">
              {profiled.map(player => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}/`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-uk-white transition-all bg-white"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-uk-blue flex items-center justify-center">
                    <span className="font-mono text-sm text-uk-white font-bold">
                      {player.jersey || '#'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg text-uk-blue font-semibold truncate">
                      {player.name}
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {player.pos} &bull; {player.height} &bull; {player.years} &bull; {eraNames[player.era]}
                    </div>
                    {player.tagline && (
                      <p className="font-body text-sm text-gray-500 italic mt-1 truncate">{player.tagline}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stub results */}
        {stubs.length > 0 && (
          <div>
            <h2 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-3">
              Roster Players ({stubs.length})
            </h2>
            <div className="space-y-2">
              {stubs.map(player => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50 opacity-75"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-mono text-sm text-gray-500 font-bold">
                      {player.jersey || '#'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg text-gray-600 truncate">
                      {player.name}
                    </div>
                    <div className="font-mono text-xs text-gray-400">
                      {player.pos} &bull; {player.height || '?'} &bull; {player.years} &bull; {eraNames[player.era]}
                      {player.hometown ? ` \u2022 ${player.hometown}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick search suggestions when empty */}
        {q.length < 2 && (
          <div className="py-8">
            <h2 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Try searching for</h2>
            <div className="flex flex-wrap gap-2">
              {['Los Angeles', 'Chicago', 'Guard', 'Center', '7\u20190', 'Harvard', 'IMG Academy', 'Australia', 'Walk-on', 'Scheyer'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1.5 border border-gray-200 rounded-full font-mono text-xs text-gray-600 hover:border-uk-white hover:text-uk-blue transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
